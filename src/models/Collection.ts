import axios from 'axios';
import { Eventing } from './Eventing';

export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  constructor(
    public rootUrl: string,
    public deserialize: (json: K) => T,
  ) {}

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  async fetch(): Promise<void> {
    try {
      const response = await axios.get<K[]>(this.rootUrl);
      this.models = response.data.map(value => this.deserialize(value));
      this.trigger('change');
    } catch (e) {
      console.error(e);
      this.trigger('error');
      throw new Error('Error while getting users list');
    }
  }
}
