let mysql = require( 'mysql' );
require( 'dotenv' ).config();

let coursesDB = mysql.createPool( {
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_COURSES,
    timezone: 'utc',
    debug: false
} );
let blogsDB = mysql.createPool( {
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_BLOGS,
    timezone: 'utc',
    debug: false
} );
let usersDB = mysql.createPool( {
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_USERS,
    timezone: 'utc',
    debug: false
} );
let toolsoc2 = mysql.createPool( {
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_OC2,
    timezone: 'utc',
    debug: false
} );

coursesDB.getConnection( ( err, connection ) => {
    if ( err ) {
        console.log( "Not connected !!! " + err );
        return;
    }
    console.log( 'MySql Connected as id ' + connection.threadId );
} );
blogsDB.getConnection( ( err, connection ) => {
    if ( err ) {
        // console.log( "Not connected !!! " + err );
        return;
    }
    // console.log( 'MySql Connected as id ' + connection.threadId );
} );
usersDB.getConnection( ( err, connection ) => {
    if ( err ) {
        // console.log( "Not connected !!! " + err );
        return;
    }
    // console.log( 'MySql Connected as id ' + connection.threadId );
} );
toolsoc2.getConnection( ( err, connection ) => {
    if ( err ) {
        // console.log( "Not connected !!! " + err );
        return;
    }
    // console.log( 'MySql Connected as id ' + connection.threadId );
} );
// let tempSql = 'ALTER TABLE `allCourses` CHANGE `courseId` `courseId` BIGINT NOT NULL DEFAULT AUTO_INCREMENT';
// let sqlQueryString = `CREATE TABLE allCourses (
//                             courseId BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//                             courseTitle TEXT,
//                             courseKeyWords TEXT,
//                             courseAuthor TEXT,
//                             courseUpdated DATE DEFAULT CURDATE(),
//                             courseOrganisation TEXT,
//                             courseChapters INT,
//                             courseInterviews INT,
//                             courseHours INT,
//                             courseImgUrl VARCHAR( 500 ),
//                             FULLTEXT( courseTitle, courseKeyWords, courseAuthor, courseOrganisation )
//                         )`;
// let detailsQueryString = `CREATE TABLE coursesBlogs (
//                             courseId  BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//                             courseTitle TEXT,
//                             jdFull TEXT,
//                             courseAuthor TEXT,
//                             courseUpdated DATE DEFAULT CURDATE()
//                         )`;
// let sqlQueryString = `CREATE TABLE GeneralCourses (
//                             genId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//                             courseId BIGINT NOT NULL,
//                             FOREIGN KEY( courseId ) REFERENCES allCourses( courseId )
//                         )`;
// let sqlQueryString = `CREATE TABLE Interviews (
//                             interviewId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//                             courseId BIGINT NOT NULL,
//                             FOREIGN KEY( courseId ) REFERENCES allCourses( courseId )
//                         )`;
// let sqlQueryString = `CREATE TABLE trending (
//                             trendId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//                             courseId BIGINT NOT NULL,
//                             FOREIGN KEY( courseId ) REFERENCES allCourses( courseId )
//                         )`;
// let userQueryString = `CREATE TABLE usersBasicInfo (
//                             id CHAR(30) NOT NULL PRIMARY KEY,
//                             name VARCHAR( 100 ) NOT NULL,
//                             email VARCHAR( 100 ) NOT NULL UNIQUE,
//                             password TEXT NOT NULL,
//                             provider CHAR(20) NOT NULL
//                         )`;
// let toolsQueryString = `CREATE TABLE smaptorss (
//                             rssid VARCHAR(50) NOT NULL PRIMARY KEY,
//                             userid char( 30 ),
//                             emails TEXT,
//                             urls TEXT,
//                             included TEXT,
//                             excluded TEXT,
//                             language VARCHAR(10),
//                             frequency INT,
//                             ndtype CHAR(10),
//                             updated datetime DEFAULT CURRENT_TIMESTAMP()
//                         )`;
// SET username = '${ dataObject.username }',
//     emails = '${dataObject.emails }',
//     urls = '${ dataObject.urls }',
//     included = '${ dataObject.included }',
//     excluded = '${ dataObject.excluded }',
//     language = '${ dataObject.language }',
//     frequency = '${ dataObject.frequency }',
//     updated = CURDATE(),
//     WHERE id = $ {
//         dataObject.id
//     }


//trending, Interviews, GeneralCourses
// let sqlQueryString = `SELECT * FROM
//                         allCourses`;
// let tempSql = 'ALTER TABLE `allCourses` CHANGE `courseId` `courseId` BIGINT NOT NULL AUTO_INCREMENT';
// let tempSql = 'ALTER TABLE `coursesBlogs` CHANGE `courseId` `courseId` BIGINT NOT NULL AUTO_INCREMENT';
// let tempSql = 'Drop table `trending`';
// let tempSql = 'Drop table `Interviews`';
// let tempSql = 'Drop table `GeneralCourses`';
// coursesDB.query( sqlQueryString, ( err, results, fields ) => {
//     if ( err ) {
//         console.log( "Not connected !!! " + err );
//         return;
//     }
//     console.log( 'The data from users table are: \n', results, fields );
// } );
// blogsDB.query( tempSql, ( err, results, fields ) => {
//     if ( err ) {
//         console.log( "Not connected !!! " + err );
//         return;
//     }
//     console.log( 'The data from users table are: \n', results, fields );
// } );
// usersDB.query( userQueryString, ( err, results, fields ) => {
//     if ( err ) {
//         console.log( "Not connected !!! " + err );
//         return;
//     }
//     console.log( 'The data from users table are: \n', results, fields );
// } );
// toolsoc2.query( toolsQueryString, ( err, results, fields ) => {
//     if ( err ) {
//         console.log( "Not connected !!! " + err );
//         return;
//     }
//     console.log( 'The data from users table are: \n', results, fields );
// } );

module.exports = {
    coursesDB,
    blogsDB,
    usersDB,
    toolsoc2
};