const {
    checkAuthentication,
} = require( './libraries/normal_functions' );
const {
    uploadtoolInfoData,
    deleteRssfromDbNFile
} = require( './libraries/toolFunctions' );
const express = require( 'express' );
const routes = express.Router();

routes.post( '/postsitemaptorss', checkAuthentication, async ( req, res ) => {
    let dataObject = req.body;
    uploadtoolInfoData( "smaptorss", dataObject, res );
} )
routes.post( '/deleteRssfile', checkAuthentication, async ( req, res ) => {
    let dataObject = req.body;
    deleteRssfromDbNFile( "smaptorss", dataObject, req, res );
} )

module.exports = routes;