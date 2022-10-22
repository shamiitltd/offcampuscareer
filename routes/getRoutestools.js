const {
    checkAuthentication
} = require( './libraries/normal_functions' );
const {
    toolsUiLoader
} = require( './libraries/toolFunctions' );
const express = require( 'express' );
const routes = express.Router();

routes.get( '/sitemapscannerbox', checkAuthentication, async ( req, res ) => {
    const {
        id
    } = req.query;
    const fileLocation = 'boxes/webtools/sitemapscanner';
    toolsUiLoader( "smaptorss", fileLocation, id, req, res );
} )
module.exports = routes;