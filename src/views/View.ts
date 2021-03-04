import { Model } from '../models/Model';

export abstract class View<T extends Model<K>, K> {
  regions: { [key: string]: Element } = {};

  constructor(
    public parent: Element,
    public model: T,
  ) {
    this.bindModel();
  }

  abstract template(): string;

  regionsMap(): { [key: string]: string } {
    return {};
  }

  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  bindModel(): void {
    this.model.on('change', this.render.bind(this));
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    Object.entries(eventsMap).forEach(([eventSelector, callback]) => {
      const [eventName, selector] = eventSelector.split(':');
      fragment.querySelectorAll(selector)?.forEach(element => {
        element.addEventListener(eventName, callback);
      })
    })
  }

  onRender(): void {}

  render(): void {
    this.parent.innerHTML = '';

    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    const html = templateElement.content;

    this.bindEvents(html);
    this.mapRegions(html);

    this.onRender();

    this.parent.append(html);
  }

  private mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();

    Object.entries(regionsMap).forEach(([regionName, selector]) => {
      const element = fragment.querySelector(selector);
      this.regions = {
        ...this.regions,
        ...element && { [regionName]: element }
      }
    })
  }
}
