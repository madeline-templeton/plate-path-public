export function startMockServer() {
  if (import.meta.env.DEV) console.info("Mock server not configured.");
}

export function stopMockServer() {
  // no-op
}
