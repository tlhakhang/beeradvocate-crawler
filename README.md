# Summary
The beeradvocate-crawler is a NodeJS application that systematically retrieves beer information from all beer profile pages on http://beeradvocate.com

##  src/ folder
This application is broken down into several smaller modules located under the src/ folder.

`src/config.js` - This file contains configuration information such as the url of the beeradvocate.com site.

`src/get-breweries.js` - This program retrieves links of all breweries profile pages in the United States from beeradvocate.com site.  This program takes no arguments.

`src/get-beers.js` - This program retrieves links of all beer profile pages from the given brewery profile page link.  This program takes one argument -- the brewery profile page link.

`src/get-beer.js` - This program retrieves all relevalant beer informatino from the given beer profile page link.  This program takes one argument -- the beer profile page link.

src/services/crawler-service.js - This is a function library that is used by src/get-breweries.js, src/get-beers.js, src/get-beer.js.  This file contains all of the logic performed in parsing the beer and breweries profile pages.

## data/ folder
The retrieved data files are located in the folder data/

`data/breweries.log` - This file contains a list of retrieved brewery profile links.

`data/beers.log` - This file contains a list of retrieved beer profile links.

`data/beers.csv` - This file contians a comma-separated values (csv) of beer data from the beer profile pages.
