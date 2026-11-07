import { createConsumer, Consumer } from "@rails/actioncable";

let consumer: Consumer | null = null;
let consumerToken: string | null = null;

/** One websocket per signed-in token; browsers can't send headers, so the JWT rides as ?token=. */
const cableFor = (token: string): Consumer => {
  if (consumer && consumerToken === token) return consumer;
  consumer?.disconnect();
  consumer = createConsumer(`/cable?token=${encodeURIComponent(token)}`);
  consumerToken = token;
  return consumer;
};

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const fromBase64 = (text: string): Uint8Array =>
  Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

export { cableFor, toBase64, fromBase64 };
