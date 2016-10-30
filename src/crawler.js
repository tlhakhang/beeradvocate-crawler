'use strict'
var crawlerService = require('./services/crawler-service');

var RSVP = require('rsvp');
var _ = require('lodash');
var url = require('url');

let config = {
    address: 'http://beeradvocate.com'
};

let getBeerStats = () => {
    crawlerService.findAvailableStateCodes(url.parse(`${config.address}/place/directory/0/US/`))
        .then((validStateCodes) => {
            let promises = {};
            // go get the breweries count
            validStateCodes.map((stateCode) => {
                promises[stateCode] = crawlerService.getBreweryCount(url.parse(`${config.address}/place/list/?c_id=US&s_id=${stateCode}&brewery=Y`))
            });
            return RSVP.hash(promises);
        }).then((breweryCountPerState) => {
            let promises = [];
            for (let stateCode in breweryCountPerState) {
                _.range(0, breweryCountPerState[stateCode], 20).forEach((startKey) => {
                    promises.push(crawlerService.getBreweryLinks(url.parse(`${config.address}/place/list/?start=${startKey}&c_id=US&s_id=${stateCode}&brewery=Y`)))
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
                promises.push(crawlerService.getBeerLinks(url.parse(`${config.address}${link}`)));
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
