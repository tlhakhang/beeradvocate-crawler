'use strict';
import {
    findAvailableStateCodes,
    getBreweriesCount,
    getBeers,
    getBeer
} from './services/crawler-service';

import RSVP from 'rsvp';
import _ from 'lodash';
import url from 'url';

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

    RSVP.all(promises).then((results) => {
        return _.flattenDeep(results);
    }).then((beerProfileLinks) => {
        return beerProfileLinks.slice(0, 100).map((link) => {
            return getBeer(`${config.address}${link}`);
        });
    }).then((beerPromises) => {
        RSVP.all(beerPromises).then((results) => {
            console.log(results);
        });
    });
}

let getBeerStats = () => {
    findAvailableStateCodes(url.parse(`${config.address}/place/directory/0/US/`))
        .then((validStateCodes) => {
            let promises = {};

            // go get the breweries count
            validStateCodes.map((stateCode) => {
                promises[stateCode] = getBreweriesCount(url.parse(`${config.address}/place/list/?c_id=US&s_id=${stateCode}&brewery=Y`))
            });

            return RSVP.hash(promises);

        }).then((breweryCountsPerState) => {
          // this will now allow us to traverse the entire state's brewery list
          console.log(result);
        });
}

getBeerStats();
