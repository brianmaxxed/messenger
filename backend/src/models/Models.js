import User from './User';

export default class Models {
  constructor() {
    this.models = Models.all;
  }

  static get all() {
    return {
      user: new User(),
    };
  }

  get all() {
    return Object.assign({}, this.models);
  }
}
