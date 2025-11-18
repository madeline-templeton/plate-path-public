export type ID = string;

export type Unit = "metric" | "imperial";

export type User = {
  id: ID;
  email: string;
  displayName?: string;
};

export type Event = {
  id: ID;
  title: string;
  start: string;
  end: string;
  description?: string;
};

export type CreateEventInput = Omit<Event, "id">;
