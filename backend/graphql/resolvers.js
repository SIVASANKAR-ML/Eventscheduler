// backend/graphql/resolvers.js

import { ObjectId } from 'mongodb';
import { GraphQLScalarType, Kind } from 'graphql';

// Custom Date Scalar to handle how dates are sent to and from the client.
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) { // This is what's sent to the client.
        if (value instanceof Date) {
            return value.toISOString(); // Convert Date object to a string.
        }
        return null;
    },
    parseValue(value) { // This is what's received from client variables.
        if (typeof value === 'string') {
            return new Date(value); // Convert string back to a Date object.
        }
        return null;
    },
    parseLiteral(ast) { // This is for values hardcoded in the query string.
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});

export const resolvers = {
    // Register our custom Date scalar.
    Date: dateScalar,

    Query: {
        // --- THIS IS THE CORRECTED QUERY ---
        // Fetches all events, sorted by their start time.
        events: async (_, __, { db }) => {
            // The empty filter {} means "match all documents".
            // We removed the date filter to ensure all created events are shown.
            return await db.collection('events').find({}).sort({ startTime: 1 }).toArray();
        },

        // Fetch a single event by its ID.
        event: async (_, { id }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid event ID format');
            }
            return await db.collection('events').findOne({ _id: new ObjectId(id) });
        },

        // Filter events by a specific date range.
        eventsByDateRange: async (_, { startDate, endDate }, { db }) => {
            return await db.collection('events').find({
                startTime: { $gte: startDate, $lte: endDate }
            }).sort({ startTime: 1 }).toArray();
        }
    },

    Mutation: {
        // Add a new event.
        addEvent: async (_, { input }, { db }) => {
            // Simple validation to ensure end time is after start time.
            if (input.endTime <= input.startTime) {
                throw new Error('End time must be after start time.');
            }
            const result = await db.collection('events').insertOne(input);
            // Return the full document that was just inserted.
            return await db.collection('events').findOne({ _id: result.insertedId });
        },

        // Update an existing event.
        updateEvent: async (_, { id, input }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid event ID format');
            }
            const result = await db.collection('events').findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: input },
                { returnDocument: 'after' } // This option ensures the updated document is returned.
            );
            return result.value; // The updated document is in the 'value' property.
        },
        
        // Delete an event.
        deleteEvent: async (_, { id }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid event ID format');
            }
            const result = await db.collection('events').findOneAndDelete({ _id: new ObjectId(id) });
            // findOneAndDelete returns the deleted document.
            return result.value;
        }
    }
};