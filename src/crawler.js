'use strict';
import {
    findAvailableStateCodes,
    getBreweryCount,
    getBreweryLinks,
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
    findAvailableStateCodes(url.parse(`${config.address}/place/directory/0/US/`))
        .then((validStateCodes) => {
            let promises = {};
            // go get the breweries count
            validStateCodes.slice(0, 1).map((stateCode) => {
                promises[stateCode] = getBreweryCount(url.parse(`${config.address}/place/list/?c_id=US&s_id=${stateCode}&brewery=Y`))
            });
            return RSVP.hash(promises);
        }).then((breweryCountPerState) => {
            // get all brewery links per state and condense them all to a large list of every brewery link
            let promises = [];
            console.log(breweryCountPerState);
            // this will now allow us to traverse the entire state's brewery list
            for (let stateCode in breweryCountPerState) {
                _.range(0, breweryCountPerState[stateCode], 20).forEach((startKey) => {
                    promises.push(getBreweryLinks(url.parse(`${config.address}/place/list/?start=${startKey}&c_id=US&s_id=${stateCode}&brewery=Y`)))
                });
            };
            return RSVP.all(promises);
        })
        .then((breweryLink) => {
            // get all beer links per brewery
            return _.flattenDeep(breweryLink);
        });
}

getBeerStats();
