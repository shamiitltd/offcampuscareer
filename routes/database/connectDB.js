const mongoose = require( 'mongoose' );
require( 'dotenv' ).config();
const {
    generateXmlFor
} = require( '../libraries/sitemapgenrator' );
//accessing the mongodb database using mongoose
// mongodb+srv://parking:<password>@cluster0.1n30q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect( `mongodb+srv://${process.env.USER_NAME_MONGO}:${process.env.PASSWORD_MONGO}@cluster0.1n30q.mongodb.net/offcampuscareer?retryWrites=true&w=majority`, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    } )
    .then( () => {
        console.log( 'Database connected Successfully !!!' )
    } )
    .catch( err => {
        console.log( 'Disconnected from Database may be your internet is down or any other err !!!' );
    } )
mongoose.Promise = global.Promise;
// let db = mongoose.connection;
// db.on( 'connected', function () {
//     console.log( "Mongoose default connection done Database connnected" );
// } );
// db.on( 'error', function ( err ) {
//     console.log( "Error while connecting with mongoose check your connection" );
// } );

module.exports = mongoose;