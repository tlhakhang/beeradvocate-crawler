'use strict'
const RSVP = require('rsvp');
const _ = require('lodash');
const url = require('url');

// custom modules
const crawlerService = require('./services/crawler-service');
const config = require('./config');

// only for US
let getBreweriesLink = () => {
    crawlerService.findAvailableStateCodes(url.parse(`${config.address}/place/directory/0/US/`)).then((validStateCodes) => {
        let promises = {};
        // go get the breweries count

        validStateCodes.map((stateCode) => {
            // we need the count of breweries to traverse pages per state
            promises[stateCode] = crawlerService.getBreweryCount(url.parse(`${config.address}/place/list/?c_id=US&s_id=${stateCode}&brewery=Y`));
        });

        return RSVP.hash(promises).then((result) => {
            return result;
        });
    }).then((breweryCountPerState) => {
        let promises = [];
        for (let stateCode in breweryCountPerState) {
            // start traversing the state page of brewery list
            _.range(0, breweryCountPerState[stateCode], 20).forEach((startKey) => {
                // console.log(`${stateCode} - ${startKey}`);
                promises.push(crawlerService.getBreweryLinks(url.parse(`${config.address}/place/list/?start=${startKey}&c_id=US&s_id=${stateCode}&brewery=Y`)));
            });
        };
        return RSVP.all(promises).then((result) => {
            return _.flattenDeep(result);
        });
    }).then((breweryLinks) => {
      breweryLinks.map((link) => console.log(`${config.address}${link}`));
    });
}

getBreweriesLink();
