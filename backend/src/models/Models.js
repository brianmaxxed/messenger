import User from './User';
import Image from './Image';

export default class Models {
  constructor() {
    this.models = Models.all;
  }

  static get all() {
    return {
      user: new User(),
      image: new Image(),
    };
  }

  get all() {
    return Object.assign({}, this.models);
  }
}
