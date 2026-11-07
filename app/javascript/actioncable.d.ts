// Minimal types for the parts of @rails/actioncable the journal uses.
declare module "@rails/actioncable" {
  interface Subscription {
    perform(action: string, data?: Record<string, unknown>): void;
    unsubscribe(): void;
  }

  interface SubscriptionCallbacks {
    received?(data: any): void;
    connected?(): void;
    disconnected?(): void;
    rejected?(): void;
  }

  interface Consumer {
    subscriptions: {
      create(
        params: Record<string, unknown>,
        callbacks: SubscriptionCallbacks,
      ): Subscription;
    };
    disconnect(): void;
  }

  function createConsumer(url?: string): Consumer;

  export { createConsumer, Consumer, Subscription };
}
