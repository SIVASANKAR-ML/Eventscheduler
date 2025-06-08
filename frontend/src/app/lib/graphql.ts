import { gql } from '@apollo/client';

export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents {
    events {
      _id
      title
      startTime
      location
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    event(id: $id) {
      _id
      title
      description
      startTime
      endTime
      location
      isRecurring
      recurrenceRule
    }
  }
`;

export const ADD_EVENT = gql`
  mutation AddEvent($input: EventInput!) {
    addEvent(input: $input) {
      _id
      title
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      _id
      title
      description
      startTime
      endTime
      location
      isRecurring
      recurrenceRule
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      _id
    }
  }
`;

export const FILTER_EVENTS_BY_DATE = gql`
    query EventsByDateRange($startDate: Date!, $endDate: Date!) {
        eventsByDateRange(startDate: $startDate, endDate: $endDate) {
            _id
            title
            startTime
            location
        }
    }
`;