//libraries and files
const express = require( 'express' );
const methodOverride = require( 'method-override' );
const cookieParser = require( 'cookie-parser' );
const path = require( 'path' );
const compression = require( 'compression' );
const flash = require( 'express-flash' );
const passport = require( 'passport' );
const session = require( 'express-session' );
const app = express();
const getRoutes = require( './routes/getRoutes' );
const getRoutestools = require( './routes/getRoutestools' );
const getRoutesBox = require( './routes/getRoutesBox' );
const postRoutes = require( './routes/postRoutes' );
const postRoutestools = require( './routes/postRoutestools' );

const {
    initializePassport
} = require( './routes/libraries/passportFunctions' );
const {
    checkAuthentication,
    checkNotAuthenticated
} = require( './routes/libraries/normal_functions' );
require( 'dotenv' ).config();

//use mehtods
app.use( compression() );
app.use( methodOverride( '_method' ) );
app.use( express.json( {
    limit: '50mb'
} ) );
app.use( express.urlencoded( {
    limit: '50mb',
    extended: true
} ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( express.static( path.join( __dirname, 'routes' ) ) );
app.use( cookieParser() );
app.use( flash() );
app.use( session( {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 730 * 86400000
    }
} ) )
initializePassport( passport );
app.use( passport.initialize() );
app.use( passport.session() );


// app.use('/variablesData', variablesData); // Routing path
app.use( '/', getRoutes ); // Routing path 
app.use( '/', getRoutestools ); // Routing path 
app.use( '/', getRoutesBox ); // Routing path 
app.use( '/', postRoutes ); // Routing path
app.use( '/', postRoutestools ); // Routing path


//set methods
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

app.get( '/signin', checkNotAuthenticated, async ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: ''
    } );
} )
app.get( '/offline', async ( req, res ) => {
    res.render( 'outerMostContainers/containerWithOffline', {
        user: req.user
    } );
} )

app.get( '/help', ( req, res ) => {
    res.render( 'landing/help' );
} )


//set Different routes
app.get( '/', async ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/jobs', async ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/internships', async ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )
app.get( '/referral', ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/scholarships', ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )
app.get( '/forwomen', ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )


app.get( '/recruiters', ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/courses', async ( req, res ) => {
    let {
        searchAll
    } = req.query;
    if ( searchAll ) {
        res.cookie( 'QRY', searchAll );
    }
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/courses/search', async ( req, res ) => {
    let {
        searchAll
    } = req.query;
    if ( searchAll ) {
        res.cookie( 'QRY', searchAll );
    }
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )
app.get( '/viewcourses', async ( req, res ) => {
    let {
        searchAll
    } = req.query;
    if ( searchAll ) {
        res.cookie( 'QRY', searchAll );
    }
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )


app.get( '/courses/organisation/:companyName/:jobtitle', async ( req, res ) => { ///courses/organisation/google/software-engineer-1
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/*/new', checkAuthentication, ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )
app.get( '/profile/*', checkAuthentication, ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/*/edit', checkAuthentication, ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )
app.get( '/deleteInfo', checkAuthentication, ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

app.get( '/*', ( req, res ) => {
    res.render( 'outerMostContainers/containerWithSearchForm', {
        user: req.user
    } );
} )

//listening the server
app.listen( process.env.PORT || 3000, () => {
    console.log( `Server is running on port ${process.env.PORT} !!!` );
} )