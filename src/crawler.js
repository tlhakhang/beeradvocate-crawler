'use strict';
import {
    getBeers,
    getBeer
} from './services/crawler-service';
import RSVP from 'rsvp';
import _ from 'lodash';

let beerCrawlJob = () => {
    let promises = [];

    _.range(0,17).forEach((i) => {
        let startKey = 1;
        if (i != 0) startKey = 25 * i;
        getBeers(`https://www.beeradvocate.com/beer/?start=${startKey}`).then((result) => {
          console.log(result);
        });
    });
}

beerCrawlJob();
