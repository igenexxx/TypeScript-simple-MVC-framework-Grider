type Callback = () => void;

export class Eventing {
  private events: { [key: string]: Callback[] } = {};

  on = (eventName: string, callback: Callback): void => {
    this.events[eventName] = [...(this.events[eventName] || []), callback];
  }

  trigger = (eventName: string): void => {
    const handlers = this.events[eventName];

    if (!(handlers && handlers.length)) {
      return;
    }

    handlers.forEach(callback => callback());
  }
}
