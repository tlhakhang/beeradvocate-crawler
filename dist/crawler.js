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

	var beerCrawlJob = function beerCrawlJob() {
	    var promises = [];

	    _lodash2.default.range(0, 17).forEach(function (i) {
	        var startKey = 1;
	        if (i != 0) startKey = 25 * i;
	        (0, _crawlerService.getBeers)('https://www.beeradvocate.com/beer/?start=' + startKey).then(function (result) {
	            console.log(result);
	        });
	    });
	};

	beerCrawlJob();

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
	    var beers = [];
	    return beers;
	  }).catch(function (err) {
	    console.log(err);
	  });
	};

	var getBeer = function getBeer(url) {
	  return (0, _nodeFetch2.default)(url).then(function (resp) {
	    return resp.text();
	  }).then(function (body) {
	    // process the text body of the beer profile
	    var $ = _cheerio2.default.load(body);
	    var beer = {};
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