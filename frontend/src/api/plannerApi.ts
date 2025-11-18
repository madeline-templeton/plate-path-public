import { apiFetch } from "./client";
import type { Event, CreateEventInput } from "../types/models";

export function getEvents(params?: { from?: string; to?: string }) {
  const qs = params
    ? `?${new URLSearchParams(params as Record<string, string>)}`
    : "";
  return apiFetch<Event[]>(`/events${qs}`);
}

export function createEvent(input: CreateEventInput) {
  return apiFetch<Event>(`/events`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteEvent(id: string) {
  return apiFetch<void>(`/events/${id}`, { method: "DELETE" });
}
// react query-hooks to call backend
