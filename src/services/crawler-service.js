'use strict';

import fetch from 'node-fetch';
import cheerio from 'cheerio';

let findAvailableStateCodes = (url) => {
    return fetch(url.href)
        .then((resp) => {
            return resp.text();
        })
        .then((body) => {
            // load cheerio to parse the html of the response
            let $ = cheerio.load(body);

            // find all anchor tags
            // then get valid anchor tags that have the href attribute
            // then if the href attribute starts with the url.path return true else false
            // -- this logic was known by looking at the page structure
            // the filteredNodes is an array that contains all the valid state links
            let filteredNodes = Array.prototype.filter.call($('a'), function(i) {
                let link = $(i).attr('href');
                if (link && link.startsWith(url.path)) {
                    return true
                } else {
                    return false
                }
            });

            // validate the state codes
            // the value of 5 -- this is known by looking at the url path that the page returns.
            // if the code length is 2 then it is valid state code
            let validStateCodes = filteredNodes.map((node) => {
                return $(node).attr('href').split('/')[5];
            }).filter((code) => {
                return code.length === 2;
            });

            return validStateCodes;
        })
        .catch((err) => {
            console.log(err);
        });
}

let getBreweryCount = (url) => {
    // url is a url object that will include the state code.
    return fetch(url.href)
        .then((resp) => {
            return resp.text();
        })
        .then((body) => {
            let $ = cheerio.load(body);
            // the below will selector will aim to get the total
            // using that we can find how far to traverse this state's brewery list page.
            let countText = $('table tr td span b', '#ba-content').first().text();
            return countText.match(/out of (\d+)/g)[0].match(/(\d+)/g)[0];
        })
        .catch((err) => {
            console.log(err);
        })
}

let getBreweryLinks = (url) => {
    // we are given a brewery list page
    // go find all the brewery links
    return fetch(url.href)
        .then((resp) => {
            return resp.text();
        })
        .then((body) => {
            let $ = cheerio.load(body);
            let filteredNodes = Array.prototype.filter.call($('a'), function(i) {
                let link = $(i).attr('href');
                if (link && link.startsWith('/beer/profile/')) {
                    return true
                } else {
                    return false
                }
            });

            let validLinks = filteredNodes.map((node) => {
                return $(node).attr('href');
            });

            return validLinks;
        })
        .catch((err) => {
            console.log(err);
        })
}

let getBeerLinks = (url) => {
    // we are given the brewery page
    // go find all beer links
    return fetch(url.href)
        .then((resp) => {
            return resp.text();
        })
        .then((body) => {
            // process the text body of beers list
            let $ = cheerio.load(body);
            let filteredNodes = Array.prototype.filter.call($('a'), function(i) {
                let link = $(i).attr('href');
                if (link && link.startsWith(url.path)) {
                    return true
                } else {
                    return false
                }
            });

            let validLinks = filteredNodes.map((node) => {
                return $(node).attr('href');
            }).filter((links) => {
              return links.match(/\/$/);
            });
            return validLinks;
        })
        .catch((err) => {
            console.log(err);
        });
}

let getBeer = (url) => {
    console.log('going to ', url);
    return fetch(url).then((resp) => {
        return resp.text();
    }).then((body) => {
        // process the text body of the beer profile
        let $ = cheerio.load(body);
        let title = $('.titleBar > h1').text();
        let score = $('.BAscore_big.ba-score').text();
        let scoreText = $('.ba-score_text').text();

        let beer = {
            name: title.split(' | ')[0],
            brewery: title.split(' | ')[1],
            beerScore: score,
            scoreText,
        };
        return beer;
    }).catch((err) => {
        console.log(err);
    });
}

export {
    findAvailableStateCodes,
    getBreweryCount,
    getBreweryLinks,
    getBeerLinks,
    getBeer
}
