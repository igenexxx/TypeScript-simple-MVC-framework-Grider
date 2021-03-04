import { AxiosPromise } from 'axios';

interface AttributesModel<T> {
  set(update: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface SyncModel<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface EventsModel {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void
}

interface HasIdModel {
  id?: number;
}

export class Model<T extends HasIdModel> {
  constructor(
    private attributes: AttributesModel<T>,
    private events: EventsModel,
    private sync: SyncModel<T>,
  ) {}

  on = this.events.on;
  trigger = this.events.trigger;
  get = this.attributes.get;

  set(update: T): void {
    this.attributes.set(update);
    this.events.trigger('change');
  }

  async fetch(): Promise<void> {
    const id = this.get('id');

    if (typeof id !== 'number') {
      throw new Error('Cannot fetch without an id');
    }

    try {
      const response = await this.sync.fetch(id);
      this.set(response.data)
    } catch (e) {
      console.error(e);
      throw new Error(`Error during fetch data`);
    }
  }

  async save(): Promise<void> {
    try {
      await this.sync.save(this.attributes.getAll());
      this.trigger('save');
    } catch (e) {
      console.error(e);
      this.trigger('error');
      throw new Error('Error during save data');
    }
  }
}
