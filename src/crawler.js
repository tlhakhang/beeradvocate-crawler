'use strict';
import {
    getBeers,
    getBeer
} from './services/crawler-service';

import RSVP from 'rsvp';
import _ from 'lodash';

let config = {
  address: 'https://beeradvocate.com'
};

let getBeerStats = () => {
    let promises = [];

    _.range(0, 17).forEach((i) => {
        let startKey = 0;
        if (i != 0) startKey = 25 * i;
        // console.log(startKey); -- debug the startKey variable
        promises.push(getBeers(`${config.address}/beer/?start=${startKey}`));
    });

    return RSVP.all(promises).then((results) => {
        return _.flattenDeep(results);
    }).then((beerProfileLinks) => {
      return beerProfileLinks.slice(0,10).map((link) => {
        return getBeer(`${config.address}${link}`);
      });
    }).then((beerPromises) => {
      RSVP.all(beerPromises).then((results) => {
        console.log(results);
      });
    });
}

getBeerStats();
