/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _crawlerService = __webpack_require__(1);

	var _rsvp = __webpack_require__(4);

	var _rsvp2 = _interopRequireDefault(_rsvp);

	var _lodash = __webpack_require__(5);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _url = __webpack_require__(6);

	var _url2 = _interopRequireDefault(_url);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	    address: 'https://beeradvocate.com'
	};

	var getBeerStats = function getBeerStats() {
	    var promises = [];

	    _lodash2.default.range(0, 17).forEach(function (i) {
	        var startKey = 0;
	        if (i != 0) startKey = 25 * i;
	        // console.log(startKey); -- debug the startKey variable
	        promises.push((0, _crawlerService.getBeers)(config.address + '/beer/?start=' + startKey));
	    });

	    _rsvp2.default.all(promises).then(function (results) {
	        return _lodash2.default.flattenDeep(results);
	    }).then(function (beerProfileLinks) {
	        return beerProfileLinks.slice(0, 100).map(function (link) {
	            return (0, _crawlerService.getBeer)('' + config.address + link);
	        });
	    }).then(function (beerPromises) {
	        _rsvp2.default.all(beerPromises).then(function (results) {
	            console.log(results);
	        });
	    });
	};

	//getBeerStats();

	var getStateLinks = function getStateLinks() {
	    (0, _crawlerService.findAvailableStateCodes)(_url2.default.parse(config.address + '/place/directory/0/US/')).then(function (validStateCodes) {
	        // build your promises
	        var promises = {};

	        // go get the breweries count
	        validStateCodes.map(function (stateCode) {
	            promises[stateCode] = (0, _crawlerService.getBreweriesCount)(_url2.default.parse(config.address + '/place/list/?c_id=US&s_id=' + stateCode + '&brewery=Y'));
	        });
	        return _rsvp2.default.hash(promises);
	    }).then(function (result) {
	        console.log(result);
	    });
	};

	getStateLinks();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getBeer = exports.getBeers = exports.getBrewery = exports.getBreweriesCount = exports.findAvailableStateCodes = undefined;

	var _nodeFetch = __webpack_require__(2);

	var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

	var _cheerio = __webpack_require__(3);

	var _cheerio2 = _interopRequireDefault(_cheerio);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var findAvailableStateCodes = function findAvailableStateCodes(url) {
	    return (0, _nodeFetch2.default)(url.href).then(function (resp) {
	        return resp.text();
	    }).then(function (body) {
	        // load cheerio to parse the html of the response
	        var $ = _cheerio2.default.load(body);

	        // find all anchor tags
	        // then get valid anchor tags that have the href attribute
	        // then if the href attribute starts with the url.path return true else false
	        // -- this logic was known by looking at the page structure
	        // the filteredNodes is an array that
	        var filteredNodes = Array.prototype.filter.call($('a'), function (i) {
	            var link = $(i).attr('href');
	            if (link && link.startsWith(url.path)) {
	                return true;
	            } else {
	                return false;
	            }
	        });

	        // validate the state codes
	        // the value of 5 -- this is known by looking at the url path that the page returns.
	        // if the code length is 2 then it is valid state code
	        var validStateCodes = filteredNodes.map(function (node) {
	            return $(node).attr('href').split('/')[5];
	        }).filter(function (code) {
	            return code.length === 2;
	        });

	        return validStateCodes;
	    }).catch(function (err) {
	        console.log(err);
	    });
	};

	var getBreweriesCount = function getBreweriesCount(url) {
	    // url is a url object that will include the state code.
	    console.log('going to ', url.href);
	    return (0, _nodeFetch2.default)(url.href).then(function (resp) {
	        return resp.text();
	    }).then(function (body) {
	        var $ = _cheerio2.default.load(body);
	        //console.log(body);;
	        // the below will selector will aim to get the total and using that we can find how far to traverse this state page.
	        var countText = $('table tr td span b', '#ba-content').first().text();
	        return countText.match(/out of (\d+)/g)[0].match(/(\d+)/g)[0];
	    }).catch(function (err) {
	        console.log(err);
	    });
	};

	var getBrewery = function getBrewery(url) {};

	var getBeers = function getBeers(url) {
	    return (0, _nodeFetch2.default)(url).then(function (resp) {
	        return resp.text();
	    }).then(function (body) {
	        // process the text body of beers list
	        var $ = _cheerio2.default.load(body);
	        var beers = Array.prototype.map.call($('#rating_fullview_content_2 > h6 > a'), function (i) {
	            return $(i).attr('href');
	        });
	        return beers;
	    }).catch(function (err) {
	        console.log(err);
	    });
	};

	var getBeer = function getBeer(url) {
	    console.log('going to ', url);
	    return (0, _nodeFetch2.default)(url).then(function (resp) {
	        return resp.text();
	    }).then(function (body) {
	        // process the text body of the beer profile
	        var $ = _cheerio2.default.load(body);
	        var title = $('.titleBar > h1').text();
	        var score = $('.BAscore_big.ba-score').text();
	        var scoreText = $('.ba-score_text').text();

	        var beer = {
	            name: title.split(' | ')[0],
	            brewery: title.split(' | ')[1],
	            beerScore: score,
	            scoreText: scoreText
	        };
	        return beer;
	    }).catch(function (err) {
	        console.log(err);
	    });
	};

	exports.findAvailableStateCodes = findAvailableStateCodes;
	exports.getBreweriesCount = getBreweriesCount;
	exports.getBrewery = getBrewery;
	exports.getBeers = getBeers;
	exports.getBeer = getBeer;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("node-fetch");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("cheerio");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("rsvp");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ }
/******/ ]);