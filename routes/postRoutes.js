const {
    JobsData,
    InternshipsData,
    ReferralsData,
    ScholarshipsData,
    ForwomenData
} = require( './database/schemas' );
const {
    currencyExchange
} = require( './data/staticData' );
const {
    getJobTimePeriodType,
    uploadToDynamoDB,
    checkAuthentication,
    uploadDividedDataToBDs,
    deleteDataFromBothDBsById
} = require( './libraries/normal_functions' );
const {
    uploadDataCourseTable,
    registerUserFunction,
    resetNewPasswordFunction
} = require( './libraries/mysql_functions' );
const {
    tables,
    addOrUpdateData
} = require( './database/dynamoDB' );
const passport = require( 'passport' );
const express = require( 'express' );
const routes = express.Router();
const bcrypt = require( 'bcrypt' );
const saltRounds = 10;

routes.post( '/postEditorial', ( req, res ) => {
    uploadToDynamoDB( tables.names[ 0 ], '/', req, res );
} )


routes.post( '/postCourse', checkAuthentication, ( req, res ) => {
    let dataObject = req.body;
    if ( req.admin || req.editor ) {
        uploadDataCourseTable( dataObject, res, '/viewcourses' );
    } else {
        res.redirect( '/nopage' );
    }
} )

routes.post( '/signinUser', function ( req, res, next ) {
    passport.authenticate( 'local', function ( err, user, info ) {
        if ( err ) {
            return res.send( info.message );
        }
        if ( !user ) {
            return res.send( info.message );
            // return res.redirect( '/signin' );
        }
        req.logIn( user, function ( err ) {
            if ( err ) {
                return res.send( 'Authentication error' );
            }
            return res.send( 'success' );
            // return res.redirect( '/users/' + user.username );
        } );
    } )( req, res, next );
} );

routes.post( '/registerNewUser', async ( req, res ) => {
    let dataObject = req.body;
    dataObject.password = await bcrypt.hash( req.body.password, saltRounds );
    registerUserFunction( dataObject, res );
} )

routes.post( '/resetNewPassword', async ( req, res ) => {
    let dataObject = req.body;
    dataObject.password = await bcrypt.hash( req.body.password, saltRounds );
    resetNewPasswordFunction( dataObject, res );
} )

routes.post( '/postExitingForWomens', async ( req, res ) => {
    let dataObject = await req.body;
    await uploadDividedDataToBDs( ForwomenData, tables.names[ 2 ], dataObject );
    res.redirect( '/forwomen' );
} )

routes.post( '/postInternships', async ( req, res ) => {
    let newInternship = req.body;
    newInternship = await getJobTimePeriodType( newInternship );
    await uploadDividedDataToBDs( InternshipsData, tables.names[ 4 ], newInternship );
    res.redirect( '/internships' );
} )

routes.post( '/postJob', async ( req, res ) => {
    let dataObject = req.body;
    dataObject = await getJobTimePeriodType( dataObject );
    await uploadDividedDataToBDs( JobsData, tables.names[ 6 ], dataObject );
    res.redirect( '/jobs' );
} )

routes.post( '/postReferral', async ( req, res ) => {
    let dataObject = req.body;
    dataObject = await getJobTimePeriodType( dataObject );
    await uploadDividedDataToBDs( ReferralsData, tables.names[ 8 ], dataObject );
    res.redirect( '/referral' );
} )

routes.post( '/postScholarship', async ( req, res ) => {
    let dataObject = req.body;
    await uploadDividedDataToBDs( ScholarshipsData, tables.names[ 10 ], dataObject );
    res.redirect( '/scholarships' );
} )

routes.post( '/deleteDataFromDb', async ( req, res ) => {
    let infoObject = req.body;
    await deleteDataFromBothDBsById( infoObject );
    res.redirect( `/${infoObject.database}` );
} )

module.exports = routes;