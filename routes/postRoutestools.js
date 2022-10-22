const {
    checkAuthentication,
} = require( './libraries/normal_functions' );
const {
    uploadtoolInfoData
} = require( './libraries/toolFunctions' );
const express = require( 'express' );
const routes = express.Router();

routes.post( '/postsitemaptorss', checkAuthentication, async ( req, res ) => {
    let dataObject = req.body;
    if ( req.admin || req.editor ) {
        uploadtoolInfoData( "smaptorss", dataObject, res, '/feeds' );
    } else {
        res.redirect( '/nopage' );
    }
} )

module.exports = routes;