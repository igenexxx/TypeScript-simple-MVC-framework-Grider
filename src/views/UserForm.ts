import { User, UserProps } from '../models/User';
import { View } from './View';

export class UserForm extends View<User, UserProps> {
  eventsMap(): { [key: string]: () => void } {
    return {
      'click:.set-age': this.onSetAgeClick,
      'click:.set-name': this.onSetNameClick,
      'click:.save-model': this.onSaveClick,
    }
  }

  onSaveClick = (): void => {
    this.model.save();
  }

  onSetNameClick = (): void => {
    const name = this.parent.querySelector('input')?.value;

    name && this.model.set({ name });
  }

  onSetAgeClick = (): void => {
    this.model.setRandomAge();
  }

  template(): string {
    return `
      <div>
        <input placeholder="${this.model.get('name')}">
        <button class="set-name">Change Name</button>
        <button class="set-age">Set random age</button>
        <button class="save-model">Save User</button>
      </div>
    `
  }
}