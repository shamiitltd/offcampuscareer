const {
    JobsData,
    InternshipsData,
    ReferralsData,
    ScholarshipsData,
    ForwomenData
} = require( './database/schemas' );
const {
    jobArrayFromDB,
    jobDescriptionFromDB,
    getDescWithDataFromMongoDB,
    getSelectionTips
} = require( './libraries/functions' );
const {
    updateSearchForm,
    newOrEditForm,
    checkAuthentication
} = require( './libraries/normal_functions' );
const {
    courseDescription,
    newOrEditCourseForm,
    resetPassWithEmail,
    sendresetpassmail
} = require( './libraries/mysql_functions' );
const {
    tables,
    getData,
    getDataById,
    addOrUpdateData,
    deleteDataById
} = require( './database/dynamoDB' );
const courses = require( './data/coursesNamesData' );

const express = require( 'express' );
const routes = express.Router();
const passport = require( 'passport' );

routes.get( '/homeRecommendation', async ( req, res ) => {
    const fileLocation = 'containers/homeRecommendation';
    res.render( fileLocation );
} )

routes.get( '/courseRecommendation', async ( req, res ) => {
    const fileLocation = 'containers/courseRecommendation'
    let ssvar = { //setSelectedVariable values (0+)
        eng: 1,
        med: 1,
        misc: 1,
        comp: 1
    }
    res.render( fileLocation, {
        courses,
        ssvar
    } );
} )
routes.get( '/coursessearch', async ( req, res ) => {
    const fileLocation = 'containers/coursessearch'
    res.render( fileLocation );
} )

routes.get( '/forwomenContainer', async ( req, res ) => {
    const queryString = await req.query;
    if ( !parseInt( queryString.page ) )
        queryString.page = 1;
    const fileLocation = 'containers/basicAndDescBoxes';
    const repeatingBox = 'scholarshipbox';
    const descriptionBox = 'scholarshipdescbox';
    jobArrayFromDB( ForwomenData, tables.names[ 2 ], repeatingBox, descriptionBox, fileLocation, queryString, res, queryString.page );
} )

routes.get( '/filteredInternships', async ( req, res ) => {
    const queryString = await req.query;
    if ( !parseInt( queryString.page ) )
        queryString.page = 1;
    const fileLocation = 'containers/basicAndDescBoxes';
    const repeatingBox = 'jobbox';
    const descriptionBox = 'jobdescriptionbox';
    jobArrayFromDB( InternshipsData, tables.names[ 4 ], repeatingBox, descriptionBox, fileLocation, queryString, res, queryString.page );
} )

routes.get( '/filteredData', async ( req, res ) => {
    const queryString = await req.query;
    if ( !parseInt( queryString.page ) )
        queryString.page = 1;
    const fileLocation = 'containers/basicAndDescBoxes';
    const repeatingBox = 'jobbox';
    const descriptionBox = 'jobdescriptionbox';
    jobArrayFromDB( JobsData, tables.names[ 6 ], repeatingBox, descriptionBox, fileLocation, queryString, res, queryString.page );
} )

routes.get( '/referralsContainer', async ( req, res ) => {
    const queryString = await req.query;
    if ( !parseInt( queryString.page ) )
        queryString.page = 1;
    const fileLocation = 'containers/basicAndDescBoxes';
    const repeatingBox = 'jobbox';
    const descriptionBox = 'jobdescriptionbox';
    jobArrayFromDB( ReferralsData, tables.names[ 8 ], repeatingBox, descriptionBox, fileLocation, queryString, res, queryString.page );
} )

routes.get( '/scholarshipsContainer', async ( req, res ) => {
    const queryString = await req.query;
    if ( !parseInt( queryString.page ) )
        queryString.page = 1;
    const fileLocation = 'containers/basicAndDescBoxes';
    const repeatingBox = 'scholarshipbox';
    const descriptionBox = 'scholarshipdescbox';
    jobArrayFromDB( ScholarshipsData, tables.names[ 10 ], repeatingBox, descriptionBox, fileLocation, queryString, res, queryString.page );
} )

routes.get( '/viewcoursesdata/:id', async ( req, res ) => {
    const {
        id
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/coursedescbox';
    courseDescription( "coursesBlogs", fileLocation, id, res );
} )

routes.get( '/forwomendescriptionbox/:id', async ( req, res ) => {
    const {
        id
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/scholarshipdescbox';
    jobDescriptionFromDB( ForwomenData, tables.names[ 2 ], fileLocation, id, res );
} )

routes.get( '/internshipdescriptionbox/:id', async ( req, res ) => {
    const {
        id
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/jobdescriptionbox';
    jobDescriptionFromDB( InternshipsData, tables.names[ 4 ], fileLocation, id, res );
} )

routes.get( '/jobdescriptionbox/:id', async ( req, res ) => {
    const {
        id
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/jobdescriptionbox';
    jobDescriptionFromDB( JobsData, tables.names[ 6 ], fileLocation, id, res );
} )

routes.get( '/referraldescriptionbox/:id', async ( req, res ) => {
    const {
        id
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/jobdescriptionbox';
    jobDescriptionFromDB( ReferralsData, tables.names[ 8 ], fileLocation, id, res );
} )

routes.get( '/scholarshipdescriptionbox/:id', async ( req, res ) => {
    const {
        id
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/scholarshipdescbox';
    jobDescriptionFromDB( ScholarshipsData, tables.names[ 10 ], fileLocation, id, res );
} )

routes.get( '/accessEditorial/:id', async ( req, res ) => {
    const {
        id
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/tipsPage';
    getSelectionTips( fileLocation, res, id );
} )

routes.get( '/searchform', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'boxes/searchForms/searchformGeneral';
    updateSearchForm( fileLocation, queryString, res );
} )
routes.get( '/searchformnormal', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'boxes/searchForms/searchformNormal';
    updateSearchForm( fileLocation, queryString, res );
} )

routes.get( '/newEditorialPost', checkAuthentication, async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'boxes/dataUploadForms/newEditorialForm';
    updateSearchForm( fileLocation, queryString, res );
} )

routes.get( '/newCoursePost', checkAuthentication, async ( req, res ) => {
    let {
        id
    } = await req.query;
    const fileLocation = 'boxes/dataUploadForms/newCourseForm';
    newOrEditCourseForm( fileLocation, id, req, res );
} )

routes.get( '/newExitingForWomenPost', checkAuthentication, async ( req, res ) => {
    const {
        id
    } = await req.query;
    const fileLocation = 'boxes/dataUploadForms/newExitingForWomens';
    newOrEditForm( ForwomenData, tables.names[ 2 ], fileLocation, id, req, res );
} )

routes.get( '/newInternPost', checkAuthentication, async ( req, res ) => {
    const {
        id
    } = await req.query;
    const fileLocation = 'boxes/dataUploadForms/newinternshipform';
    newOrEditForm( InternshipsData, tables.names[ 4 ], fileLocation, id, req, res );
} )

routes.get( '/newJobPost', checkAuthentication, async ( req, res ) => {
    const {
        id
    } = await req.query;
    const fileLocation = 'boxes/dataUploadForms/newjobform';
    newOrEditForm( JobsData, tables.names[ 6 ], fileLocation, id, req, res );
} )

routes.get( '/newReferralPost', checkAuthentication, async ( req, res ) => {
    const {
        id
    } = await req.query;
    const fileLocation = 'boxes/dataUploadForms/newreferralform';
    newOrEditForm( ReferralsData, tables.names[ 8 ], fileLocation, id, req, res );
} )

routes.get( '/newScholarshipPost', checkAuthentication, async ( req, res ) => {
    const {
        id
    } = await req.query;
    const fileLocation = 'boxes/dataUploadForms/newScholarshipForm';
    newOrEditForm( ScholarshipsData, tables.names[ 10 ], fileLocation, id, req, res );
} )

routes.get( '/adminPortal', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'admin/allFormsPath';
    updateSearchForm( fileLocation, queryString, res );
} )

routes.get( '/deletorbox', checkAuthentication, async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'admin/dataDeletor';
    if ( req.admin )
        updateSearchForm( fileLocation, queryString, res );
    else
        res.redirect( '/nopage' );
} )

routes.get( '/signinbox', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'boxes/viewOnlyBoxes/signin';
    updateSearchForm( fileLocation, queryString, res );
} )

routes.get( '/useroffline', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'boxes/viewOnlyBoxes/offline';
    updateSearchForm( fileLocation, queryString, res );
} )
routes.get( '/nopage', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'boxes/viewOnlyBoxes/nopage';
    updateSearchForm( fileLocation, queryString, res );
} )
routes.get( '/privpolicy', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'staticContent/privacyPolicy';
    updateSearchForm( fileLocation, queryString, res );
} )

routes.get( '/resetpassword/:email', async ( req, res ) => {
    const {
        email
    } = await req.params;
    sendresetpassmail( email, res );
} )
routes.get( '/authresetpass', async ( req, res ) => {
    const {
        email,
        token
    } = req.query;
    if ( email && token ) {
        const fileLocation = 'boxes/dataUploadForms/resetpass';
        resetPassWithEmail( fileLocation, email, token, res );
    } else {
        res.redirect( '/nopage' );
    }
} )

routes.get( '/signOutFromOc2', async ( req, res ) => {
    req.logOut();
    res.redirect( '/signin' );
} )

routes.get( '/auth/facebook',
    passport.authenticate( 'facebook', {
        scope: [ 'email' ]
    } ) );

routes.get( '/auth/facebook/callback', function ( req, res, next ) {
    callbackAuthenticator( 'facebook', req, res, next );
} );


routes.get( '/auth/google',
    passport.authenticate( 'google', {
        scope: [ 'email', 'profile' ]
    } ) );

routes.get( '/auth/google/callback', function ( req, res, next ) {
    callbackAuthenticator( 'google', req, res, next );
} );


routes.get( '/auth/linkedin',
    passport.authenticate( 'linkedin', {
        scope: [ 'r_liteprofile', 'r_emailaddress' ]
    } ) );
routes.get( '/auth/linkedin/callback', function ( req, res, next ) {
    callbackAuthenticator( 'linkedin', req, res, next );
} );

function callbackAuthenticator( provider, req, res, next ) {
    passport.authenticate( provider, function ( err, user, info ) {
        if ( err ) {
            req.flash( 'info', info.message );
            return res.redirect( '/signin' );
        }
        if ( !user ) {
            req.flash( 'info', info.message );
            return res.redirect( '/signin' );
        }
        req.logIn( user, function ( err ) {
            if ( err ) {
                req.flash( 'info', 'Authentication error' );
                return res.redirect( '/signin' );
            }
            let strurl = req.cookies[ 'PRURL' ];
            if ( strurl ) {
                res.clearCookie( 'PRURL' );
                return res.redirect( strurl );
            } else {
                return res.redirect( '/' );
            }
        } );
    } )( req, res, next );

}
module.exports = routes;