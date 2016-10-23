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

	  return _rsvp2.default.all(promises).then(function (results) {
	    return _lodash2.default.flattenDeep(results);
	  }).then(function (beerProfileLinks) {
	    return beerProfileLinks.slice(0, 10).map(function (link) {
	      return (0, _crawlerService.getBeer)('' + config.address + link);
	    });
	  }).then(function (beerPromises) {
	    _rsvp2.default.all(beerPromises).then(function (results) {
	      console.log(results);
	    });
	  });
	};

	getBeerStats();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getBeer = exports.getBeers = undefined;

	var _nodeFetch = __webpack_require__(2);

	var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

	var _cheerio = __webpack_require__(3);

	var _cheerio2 = _interopRequireDefault(_cheerio);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    var beer = {
	      name: title.split(' | ')[0],
	      brewery: title.split(' | ')[1]
	    };
	    return beer;
	  }).catch(function (err) {
	    console.log(err);
	  });
	};

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

/***/ }
/******/ ]);