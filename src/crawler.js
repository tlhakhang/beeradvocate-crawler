'use strict';
import {
    findAvailableStateCodes,
    getBreweryCount,
    getBreweryLinks,
    getBeerLinks,
    getBeers,
    getBeer
} from './services/crawler-service';

import RSVP from 'rsvp';
import _ from 'lodash';
import url from 'url';

let config = {
    address: 'http://beeradvocate.com'
};

let getBeerStats = () => {
    findAvailableStateCodes(url.parse(`${config.address}/place/directory/0/US/`))
        .then((validStateCodes) => {
            let promises = {};
            // go get the breweries count
            validStateCodes.map((stateCode) => {
                promises[stateCode] = getBreweryCount(url.parse(`${config.address}/place/list/?c_id=US&s_id=${stateCode}&brewery=Y`))
            });
            return RSVP.hash(promises);
        }).then((breweryCountPerState) => {
            console.log(breweryCountPerState);
            let promises = [];
            for (let stateCode in breweryCountPerState) {
                _.range(0, breweryCountPerState[stateCode], 20).forEach((startKey) => {
                    promises.push(getBreweryLinks(url.parse(`${config.address}/place/list/?start=${startKey}&c_id=US&s_id=${stateCode}&brewery=Y`)))
                });
            };
            return RSVP.all(promises).then((result) => {
                return _.flattenDeep(result);
            });
        })
        .then((breweryLinks) => {
          
          // do things with brewery links
            var promises = [];
            breweryLinks.map((link) => {
                promises.push(getBeerLinks(url.parse(`${config.address}${link}`)));
            });

            return RSVP.all(promises).then((result) => {
                return _.flattenDeep(result);
            });

        })
        .then((beerLinks) => {
          // do things with beer links
        });
}

getBeerStats();
