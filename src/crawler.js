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
            console.log(`Received valid state codes: ${validStateCodes}`);
            
            let promises = {};
            // go get the breweries count
            validStateCodes.map((stateCode) => {
                promises[stateCode] = getBreweryCount(url.parse(`${config.address}/place/list/?c_id=US&s_id=${stateCode}&brewery=Y`))
            });
            return RSVP.hash(promises);
        }).then((breweryCountPerState) => {

            console.log(`Received brewery count per state:`);
            console.dir(breweryCountPerState);

            // get all brewery links per state and condense them all to a large list of every brewery link
            let promises = [];
            // this will now allow us to traverse the entire state's brewery list
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
            console.log(`Received brewery links for every state: ${breweryLinks.length} total breweries found.`);
            // console.log(breweryLinks);
            //get all beer links per brewery

            var promises = [];
            breweryLinks.slice(0, 10).forEach((link) => {
                setTimeout(() => {
                    promises.push(getBeerLinks(url.parse(`${config.address}${link}`)));
                }, 1000);
            });

            return RSVP.all(promises).then((result) => {
                return _.flattenDeep(result);
            });
        })
        .then((beerLinks) => {
            // got all the beer links
            beerLinks.map((link) => {
                console.log(`${config.address}${link}`);
            });
        });
}

getBeerStats();
