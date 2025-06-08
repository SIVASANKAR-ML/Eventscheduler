// graphql/typeDefs.js

export const typeDefs = `#graphql
  # Using the "scalar" keyword to define a custom type for Date
  scalar Date

  type Event {
    _id: ID!
    title: String!
    description: String!
    startTime: Date!
    endTime: Date!
    location: String!
    isRecurring: Boolean
    recurrenceRule: String
  }
  
  # Input type for creating a new event
  input EventInput {
    title: String!
    description: String!
    startTime: Date!
    endTime: Date!
    location: String!
    isRecurring: Boolean
    recurrenceRule: String
  }

  # Input type for updating an event (all fields are optional)
  input UpdateEventInput {
    title: String
    description: String
    startTime: Date
    endTime: Date
    location: String
    isRecurring: Boolean
    recurrenceRule: String
  }
  
  type Query {
    # Fetches all events (for 'upcoming', we'll filter in the resolver)
    events: [Event]
    # Fetches a single event by its ID
    event(id: ID!): Event
    # Fetches events within a specific date range
    eventsByDateRange(startDate: Date!, endDate: Date!): [Event]
  }

  type Mutation {
    addEvent(input: EventInput!): Event
    updateEvent(id: ID!, input: UpdateEventInput!): Event
    deleteEvent(id: ID!): Event
  }
`;