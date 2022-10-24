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
    uploadDividedDataToBDs,
    checkAuthentication,
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

routes.post( '/postEditorial', checkAuthentication, ( req, res ) => {
    if ( req.admin || req.editor ) {
        uploadToDynamoDB( tables.names[ 0 ], '/', req, res );
    } else {
        res.redirect( '/nopage' );
    }
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

routes.post( '/postExitingForWomens', checkAuthentication, async ( req, res ) => {
    let dataObject = await req.body;
    if ( req.admin || req.editor ) {
        await uploadDividedDataToBDs( ForwomenData, tables.names[ 2 ], dataObject, res, '/forwomen' );
    } else {
        res.redirect( '/nopage' );
    }
} )

routes.post( '/postInternships', checkAuthentication, async ( req, res ) => {
    let newInternship = req.body;
    if ( req.admin || req.editor ) {
        newInternship = await getJobTimePeriodType( newInternship );
        await uploadDividedDataToBDs( InternshipsData, tables.names[ 4 ], newInternship, res, '/internships' );
    } else {
        res.redirect( '/nopage' );
    }
} )

routes.post( '/postJob', checkAuthentication, async ( req, res ) => {
    let dataObject = req.body;
    if ( req.admin || req.editor ) {
        dataObject = await getJobTimePeriodType( dataObject );
        await uploadDividedDataToBDs( JobsData, tables.names[ 6 ], dataObject, res, '/jobs' );
    } else {
        res.redirect( '/nopage' );
    }
} )

routes.post( '/postReferral', checkAuthentication, async ( req, res ) => {
    let dataObject = req.body;
    if ( req.admin || req.editor ) {
        dataObject = await getJobTimePeriodType( dataObject );
        await uploadDividedDataToBDs( ReferralsData, tables.names[ 8 ], dataObject, res, '/referral' );
    } else {
        res.redirect( '/nopage' );
    }
} )

routes.post( '/postScholarship', checkAuthentication, async ( req, res ) => {
    let dataObject = req.body;
    if ( req.admin || req.editor ) {
        await uploadDividedDataToBDs( ScholarshipsData, tables.names[ 10 ], dataObject, res, '/scholarships' );
    } else {
        res.redirect( '/nopage' );
    }
} )

routes.post( '/deleteDataFromDb', checkAuthentication, async ( req, res ) => {
    let infoObject = req.body;
    if ( req.admin ) {
        await deleteDataFromBothDBsById( infoObject );
    }
    res.redirect( `/${infoObject.database}` );
} )

module.exports = routes;