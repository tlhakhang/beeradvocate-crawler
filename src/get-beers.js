'use strict'

const RSVP = require('rsvp');
const _ = require('lodash');
const url = require('url');

// custom modules
const crawlerService = require('./services/crawler-service');
const config = require('./config');

let breweryLink = process.argv[2] || process.exit(1);

let getBeerLinks = (breweryLink) => {
    crawlerService.getBeerLinks(url.parse(breweryLink)).then((beersLink) => {
      beersLink.map((link) => console.log(`${config.address}${link}`));
    });
}

getBeerLinks(breweryLink);
