import { ReactiveVar } from 'meteor/reactive-var';

export class JustinPublications {
  get publicationNames() {
    return this._publicationNames.get();
  }
  addPublicationNames(publications = {}) {
    this._publicationNames.set({ ...this._publicationNames.get(), ...publications });
  }
  constructor() {
    this._publicationNames = new ReactiveVar({});
  }
}

export const Publications = new JustinPublications();
