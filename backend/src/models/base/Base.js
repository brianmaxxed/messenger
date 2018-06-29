/* eslint class-methods-use-this: 0 */

import express from 'express';
import _ from 'lodash';

import c from '../../config/consts';
import sc from '../../config/statusCodes';
import db from '../../config/db';
import env from '../../config/env';

export default class Base {
  constructor() {
    this.M = null;
    this.query = null;
    this.seachLog = 'search_log';

    this.project = {
      default: {
        credits: 0,
        combined_credits: 0,
        movie_credits: 0,
        tv_credits: 0,
        external_ids: 0,
        production_companies: 0,
        images: 0,
        tagged_imaged: 0,
        production_countries: 0,
        reviews: 0,
        videos: 0,
        recommendations: 0,
        similar: 0,
        networks: 0,
        adult: 0,
        belongs_to_collection: 0,
        spoken_languages: 0,
        _id: 0,
      },
    };
  }
}
