const express = require( 'express' );
const routes = express.Router();
const {
    courseDescription,
    crPastCheckOutsRecom,
    dataForCourseRecByTable,
    dataForCourseRecommandation,
    getTitleFromMySql
} = require( './libraries/mysql_functions' );
const {
    dataForHomeRecFresh,
    dataForHomeRecExpJobs,
    getDescWithDataFromMongoDB,
    dataForHomeRecInern,
    getTitleFromMongo
} = require( './libraries/functions' );

const {
    JobsData,
    InternshipsData,
    ReferralsData,
    ScholarshipsData,
    ForwomenData
} = require( './database/schemas' );
const courses = require( './data/coursesNamesData' );
const {
    checkAuthentication
} = require( './libraries/normal_functions' );
const {
    coursesDB
} = require( './database/mysqlDB' );
const {
    tables
} = require( './database/dynamoDB' );


routes.get( '/hrFreshJobs', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/jobsCardsBlockHome'
    dataForHomeRecFresh( JobsData, 0, 1, fileLocation, queryString, res, 1, 3 );
} )
routes.get( '/hrExpJobs', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/jobsCardsBlockHome'
    dataForHomeRecExpJobs( JobsData, fileLocation, queryString, res, 1, 3 );
} )
routes.get( '/hrInternships', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/jobsCardsBlockHome'
    dataForHomeRecInern( InternshipsData, 0, fileLocation, queryString, res, 1, 3 );
} )

routes.get( '/crPastCheckOuts', async ( req, res ) => {
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    crPastCheckOutsRecom( fileLocation, repeatingBox, req, res, 1, 4 );
} )
routes.get( '/crTrending', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecByTable( 'trending', fileLocation, repeatingBox, queryString, res, 1, 4 );
} )
routes.get( '/crBasedOnSearch', async ( req, res ) => {
    const queryString = {};
    let qstr = req.cookies[ 'QRY' ];
    if ( !qstr )
        return res.send( '' );
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecommandation( fileLocation, repeatingBox, queryString, qstr, res, 1, 4 );
} )
routes.get( '/crInterview', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecByTable( 'Interviews', fileLocation, repeatingBox, queryString, res, 1, 4 );
} )
routes.get( '/crGeneral', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecByTable( 'GeneralCourses', fileLocation, repeatingBox, queryString, res, 1, 4 );
} )
routes.get( '/crEngineering', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecommandation( fileLocation, repeatingBox, queryString, '', res, 1, 4 );
} )
routes.get( '/crMedical', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecommandation( fileLocation, repeatingBox, queryString, '', res, 1, 4 );
} )

routes.get( '/crMiscellaneous', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecommandation( fileLocation, repeatingBox, queryString, '', res, 1, 4 );
} )
routes.get( '/crCompetitive', async ( req, res ) => {
    const queryString = await req.query;
    const fileLocation = 'containers/courseCardsBlockHome'
    const repeatingBox = 'coursebox';
    dataForCourseRecommandation( fileLocation, repeatingBox, queryString, '', res, 1, 4 );
} )

routes.get( '/viewcoursesdatastr/:qstr', async ( req, res ) => {
    const {
        qstr
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/coursedescbox';
    courseDescription( "coursesBlogs", fileLocation, qstr, res );
} )

routes.get( '/forwomendescboxstr/:qstr', async ( req, res ) => {
    const {
        qstr
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/scholarshipdescbox';
    getDescWithDataFromMongoDB( ForwomenData, tables.names[ 2 ], fileLocation, qstr, res );
} )

routes.get( '/internshipdescboxstr/:qstr', async ( req, res ) => {
    const {
        qstr
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/jobdescriptionbox';
    getDescWithDataFromMongoDB( InternshipsData, tables.names[ 4 ], fileLocation, qstr, res );
} )

routes.get( '/jobdescboxstr/:qstr', async ( req, res ) => {
    const {
        qstr
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/jobdescriptionbox';
    getDescWithDataFromMongoDB( JobsData, tables.names[ 6 ], fileLocation, qstr, res );
} )

routes.get( '/referraldescboxstr/:qstr', async ( req, res ) => {
    const {
        qstr
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/jobdescriptionbox';
    getDescWithDataFromMongoDB( ReferralsData, tables.names[ 8 ], fileLocation, qstr, res );
} )

routes.get( '/scholarshipdescboxstr/:qstr', async ( req, res ) => {
    const {
        qstr
    } = req.params;
    const fileLocation = 'boxes/viewOnlyBoxes/scholarshipdescbox';
    getDescWithDataFromMongoDB( ScholarshipsData, tables.names[ 10 ], fileLocation, qstr, res );
} )


routes.get( '/courseitemboxloader/:ctype/:spos', async ( req, res ) => {
    let {
        ctype,
        spos
    } = req.params;
    const fileLocation = 'boxes/smallboxes/courseitembar';
    res.render( fileLocation, {
        courses,
        ctype,
        spos
    } );
} )

routes.get( '/courseBySearch', async ( req, res ) => {
    // console.log( 'Hello' )
    const queryString = await req.query;
    const fileLocation = 'boxes/smallboxes/coursessearchall';
    const repeatingBox = 'coursebox';
    dataForCourseRecommandation( fileLocation, repeatingBox, queryString, '', res, 1, 50 );
} )

routes.get( '/secure/:dbName/:tableName/:count/:page', async ( req, res ) => {
    let {
        dbName,
        tableName,
        count,
        page
    } = req.params;
    // if ( req.admin || req.editor ) {
    if ( dbName === 'coursesdb' )
        getTitleFromMySql( res, coursesDB, tableName, count, page );
    else if ( dbName === 'mongodb' ) {
        if ( tableName === 'jobs' )
            getTitleFromMongo( res, JobsData, count, page );
        else if ( tableName === 'internships' )
            getTitleFromMongo( res, InternshipsData, count, page );
        else if ( tableName === 'referral' )
            getTitleFromMongo( res, ReferralsData, count, page );
        else if ( tableName === 'forwomen' )
            getTitleFromMongo( res, ForwomenData, count, page );
        else if ( tableName === 'scholarships' )
            getTitleFromMongo( res, ScholarshipsData, count, page );
    }
    // } else {
    // const fileLocation = 'boxes/viewOnlyBoxes/nopage';
    // res.render( fileLocation );
    // }
} )


module.exports = routes