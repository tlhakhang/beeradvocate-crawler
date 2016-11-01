'use strict'
const crawlerService = require('./services/crawler-service');
const RSVP = require('rsvp');
const _ = require('lodash');
const url = require('url');

let config = {
    address: 'http://beeradvocate.com'
};

let getBeerStats = () => {
    crawlerService.findAvailableStateCodes(url.parse(`${config.address}/place/directory/0/US/`)).then(function(validStateCodes) {
        let promises = {};
        // go get the breweries count
        validStateCodes.map((stateCode) => {
            promises[stateCode] = crawlerService.getBreweryCount(url.parse(`${config.address}/place/list/?c_id=US&s_id=${stateCode}&brewery=Y`))
        });
        return RSVP.hash(promises).then((result) => {
            return result
        });
    }).then(function(breweryCountPerState) {
        let promises = [];
        // debug
        for (let stateCode in breweryCountPerState) {
            _.range(0, breweryCountPerState[stateCode], 20).forEach(function(startKey) {
                //console.log(`${stateCode} - ${startKey}`);
                promises.push(crawlerService.getBreweryLinks(url.parse(`${config.address}/place/list/?start=${startKey}&c_id=US&s_id=${stateCode}&brewery=Y`)))
            });
        };
        return RSVP.all(promises).then(function(result) {
            return _.flattenDeep(result);
        });

    }).then(function(breweryLinks) {
        //console.log(`got brewery links ${breweryLinks.length}`);
        // do things with brewery links
        let promises = [];
        breweryLinks.forEach((link) => {
            //console.log(`${config.address}${link}`);
            promises.push(crawlerService.getBeerLinks(url.parse(`${config.address}${link}`)));
        });

        return RSVP.all(promises).then(function(result) {
            return _.flattenDeep(result);
        });

    })
}

getBeerStats();
