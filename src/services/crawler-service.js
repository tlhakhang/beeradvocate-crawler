'use strict'
const fetch = require('node-fetch');
const cheerio = require('cheerio');

let findAvailableStateCodes = (url) => {
    return fetch(url.href).then((resp) => {
        return resp.text();
    }).then((body) => {
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
    }).catch((err) => {
        console.log(err);
    });
}

let getBreweryCount = (url) => {
    // url is a url object that will include the state code.
    return fetch(url.href).then((resp) => {
        return resp.text();
    }).then((body) => {
        let $ = cheerio.load(body);
        // the below will selector will aim to get the total
        // using that we can find how far to traverse this state's brewery list page.
        let countText = $('table tr td span b', '#ba-content').first().text();
        return countText.match(/out of (\d+)/g)[0].match(/(\d+)/g)[0];
    }).catch((err) => {
        console.log(err);
    })
}

let getBreweryLinks = (url) => {
    // we are given a brewery list page
    // go find all the brewery links
    return fetch(url.href).then((resp) => {
        return resp.text();
    }).then((body) => {
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
        }).map((link) => {
            //append all links
            if (link.indexOf('?') != -1) {
                return `${link.split('?')[0]}?view=beers&show=all`;
            } else {
                return `${link}?view=beers&show=all`;
            }
        });
        // for debugging
        // validLinks.map((link) => console.log(`brewery profile, ${url.protocol}//${url.hostname}${link}`))
        return validLinks;
    }).catch((err) => {
        console.log(err);
    })
}

let getBeerLinks = (url) => {
    // we are given the brewery page
    // go find all beer links
    return fetch(url.href).then((resp) => {
        return resp.text();
    }).then((body) => {
        // process the text body of beers list
        let $ = cheerio.load(body);
        let filteredNodes = Array.prototype.filter.call($('a'), function(i) {
            let link = $(i).attr('href');
            if (link && link.startsWith(url.path.split('?')[0])) {
                return true
            } else {
                return false
            }
        })

        let validLinks = filteredNodes.map((node) => {
            return $(node).attr('href');
        }).filter((link) => {
            return (link.match(/\/$/) && !link.endsWith(url.path.split('?')[0]));
        });
        // for debugging
        // validLinks.map((link) => console.log(`beer profile, ${url.protocol}//${url.hostname}${link}`))
        return validLinks;
    }).catch((err) => {
        console.log(err);
    });
}

let getBeerInfo = (url) => {
    return fetch(url).then((resp) => {
        return resp.text();
    }).then((body) => {
        // process the text body of the beer profile
        let $ = cheerio.load(body);
        let title = $('.titleBar > h1').text();
        let score = $('.BAscore_big.ba-score').text();
        let scoreText = $('.ba-score_text').text();

        let beerDivs = $('#ba-content div.break');
        let beerDivAnchors = beerDivs.children('a');

        let beer = {
            name: title.split(' | ')[0],
            brewery: title.split(' | ')[1],
            beerScore: score,
            scoreText,
            beerStats: {},
            state: '',
            beerInfo: {
              brewedBy: '',
              style: '',
              alcoholByVolume: '',
              availability: '',
              notes: '',
              addedBy: '',
              addedDate: '',
            }
        };

        let state = Array.prototype.filter.call($(beerDivAnchors), function(i) {
            let link = $(i).attr('href');
            if (link && link.match(/\/place\/directory\/9\/US\/.+/)) {
                return true
            } else {
                return false
            }
        }).map((node) => {
          return $(node).attr('href');
        });;

        beer = Object.assign(beer, { state: state[0].split('/').reverse()[1]});

        if (beerDivs.length == 3) {
            // got the correct sections

            let beerInfoOutput = beerDivs.first().next().text().replace(/BEER INFO/, '').replace(/Brewed by/, 'BrewedBy').replace(/Alcohol by volume \(ABV\)/, '|AlcoholByVolume').replace(/Notes \/ Commercial Description/, '|Notes').replace(/Added by/, '\r\n|AddedBy:').replace(/Style:/, '|Style:').replace(/Availability/, '|Availability').replace(/United States/, 'US ').trim().replace(/\s+/g, ' ').split('|');
            beerInfoOutput.map((info) => {
                let kvPair = info.split(':').map((i) => i.trim());
                let key = kvPair[0].substring(0, 1).toLowerCase() + kvPair[0].substring(1);
                beer.beerInfo = Object.assign(beer.beerInfo, {
                    [key]: kvPair[1]
                });
                if (key == 'addedBy' && kvPair[1].match(/\d\d-\d\d-\d\d\d\d/)) {
                    let extractedDate = kvPair[1].match(/\d\d-\d\d-\d\d\d\d/)[0];
                    let beerAddDate = new Date(extractedDate);
                    beer.beerInfo = Object.assign(beer.beerInfo, {
                        addedDate: beerAddDate.toLocaleDateString()
                    })
                };
            });

            let beerStatsOutput = beerDivs.first().next().next().text().replace(/BEER STATS/, '').replace(/For Trade/, 'ForTrade').trim().replace(/\s+/g, ' ').replace(/: /g, ':').replace(/\s/g, ',').split(',');

            beerStatsOutput.map((stat) => {
                let kvPair = stat.split(':');
                let key = kvPair[0].substring(0, 1).toLowerCase() + kvPair[0].substring(1);
                beer.beerStats = Object.assign(beer.beerStats, {
                    [key]: kvPair[1]
                });

            });

        }


        return beer;
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = {
    findAvailableStateCodes,
    getBreweryCount,
    getBreweryLinks,
    getBeerLinks,
    getBeerInfo
}
