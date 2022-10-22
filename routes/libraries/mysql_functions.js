const {
    coursesDB,
    blogsDB,
    usersDB
} = require( '../database/mysqlDB' );
const {
    getAlphaNumValue,
    searchStringGenerator
} = require( './functions' );
const {
    sendMailResetPassWithEmail
} = require( './nodemailer' );
const {
    suggestions,
    admins,
    editors
} = require( '../data/staticData' );
const shortid = require( 'shortid' );
shortid.characters( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@' );

async function crPastCheckOutsRecom( fileLocation, repeatingBox, req, res, pageNumber = 1, lim = 4 ) {
    let tableObj = req.cookies[ 'MRC' ];
    let idsObj = {};
    if ( tableObj )
        idsObj = JSON.parse( tableObj );
    else
        return res.send( '' );
    let sqlQueryString = `SELECT * FROM  
                        allCourses WHERE courseId IN( ${idsObj.ids}) 
                        ORDER BY field( courseId, ${idsObj.ids}) 
                        LIMIT ${ lim }  OFFSET ${ lim * ( pageNumber - 1 ) }`;
    coursesDB.query( sqlQueryString, ( err, results, fields ) => {
        if ( err ) {
            // console.log( err, idsObj.ids );
            return res.send( "Please check your internet connection" );
        }

        if ( !results.length )
            return res.send( '' );
        return res.render( fileLocation, {
            repeatingBox,
            companiesData: results,
        } );
    } );
}
async function dataForCourseRecByTable( tableName, fileLocation, repeatingBox, queryString, res, pageNumber = 1, lim = 4 ) {
    let searchString = searchStringGenerator( queryString );
    // console.log( searchString );
    if ( searchString ) {
        let sqlQueryString = `SELECT * FROM  
                        allCourses WHERE MATCH( courseTitle, courseKeyWords, courseAuthor, courseOrganisation ) 
                        AGAINST( '${searchString}' IN NATURAL LANGUAGE MODE ) LIMIT ${lim} OFFSET ${lim*(pageNumber-1)}`;
        coursesDB.query( sqlQueryString, ( err, results, fields ) => {
            if ( err ) {
                return res.send( "Please check your internet connection" );
            }
            // console.log( 'Getting data from table is: \n', results );
            if ( !results.length )
                return res.send( '' );
            return res.render( fileLocation, {
                repeatingBox,
                companiesData: results,
            } );

        } );
    } else {
        let sqlQueryString = `SELECT * 
                        FROM  allCourses 
                        INNER JOIN ${tableName} ON ${tableName}.courseId = allCourses.courseId 
                        LIMIT ${lim }  OFFSET ${ lim * ( pageNumber - 1 ) }`;
        coursesDB.query( sqlQueryString, ( err, results, fields ) => {
            if ( err ) {
                return res.send( "Please check your internet connection" );
            }
            // console.log( 'Getting data from table is: \n', results );
            if ( !results.length )
                return res.send( '' );
            return res.render( fileLocation, {
                repeatingBox,
                companiesData: results,
            } );
        } );
    }
}
async function dataForCourseRecommandation( fileLocation, repeatingBox, queryString, str, res, pageNumber = 1, lim = 4 ) {
    let searchString;
    if ( str )
        searchString = str;
    else
        searchString = searchStringGenerator( queryString );
    // console.log( searchString );
    if ( searchString ) {
        let sqlQueryString = `SELECT * FROM  
                        allCourses WHERE MATCH( courseTitle, courseKeyWords, courseAuthor, courseOrganisation ) 
                        AGAINST( '${searchString}' IN NATURAL LANGUAGE MODE ) LIMIT ${lim} OFFSET ${lim*(pageNumber-1)}`;
        coursesDB.query( sqlQueryString, ( err, results, fields ) => {
            if ( err ) {
                return res.send( "Please check your internet connection" );
            }
            // console.log( 'Getting data from table is: \n', results );
            return res.render( fileLocation, {
                repeatingBox,
                companiesData: results,
            } );

        } );
    } else {
        let sqlQueryString = `SELECT * FROM  
                        allCourses LIMIT ${lim}  OFFSET ${lim*(pageNumber-1)}`;
        coursesDB.query( sqlQueryString, ( err, results, fields ) => {
            if ( err ) {
                return res.send( "Please check your internet connection" );
            }
            // console.log( 'Getting data from table is: \n', results );
            return res.render( fileLocation, {
                repeatingBox,
                companiesData: results,
            } );
        } );
    }
}

function uploadDataCourseTable( dataObject, res, path ) {
    dataObject = arrayToStringObject( dataObject );
    // '${(new Date()).toLocaleDateString()}'
    let sqlQueryString;
    let detailsQueryString;
    if ( dataObject.courseId ) {
        sqlQueryString = `UPDATE allCourses 
                        SET courseTitle='${dataObject.courseTitle }',
                        courseKeyWords='${ dataObject.courseKeyWords }',
                        courseAuthor='${ dataObject.courseAuthor }',
                        courseUpdated=CURDATE(),
                        courseOrganisation='${ dataObject.courseOrganisation }',
                        courseChapters='${ dataObject.courseChapters }',
                        courseInterviews='${ dataObject.courseInterviews }',
                        courseHours='${ dataObject.courseHours }',
                        courseImgUrl='${ dataObject.courseImgUrl}'  
                        WHERE courseId = ${dataObject.courseId}
                        `;
        detailsQueryString = `UPDATE coursesBlogs 
                        SET courseTitle='${dataObject.courseTitle }', 
                        jdFull='${ dataObject.jdFull }', 
                        courseAuthor='${ dataObject.courseAuthor }', 
                        courseUpdated=CURDATE() 
                        WHERE courseId = ${dataObject.courseId}
                        `;

    } else {
        let newID = new Date().getTime();
        // newID = getAlphaNumValue( newID );
        // let newID = shortid.generate();
        sqlQueryString = `INSERT INTO 
                        allCourses( courseId, courseTitle, courseKeyWords, courseAuthor, courseOrganisation, courseChapters, courseInterviews, courseHours, courseImgUrl )
                        VALUES( '${newID}', '${dataObject.courseTitle}', '${dataObject.courseKeyWords}', '${dataObject.courseAuthor}', '${dataObject.courseOrganisation}', '${dataObject.courseChapters}', '${dataObject.courseInterviews}', '${dataObject.courseHours}', '${dataObject.courseImgUrl}' )
                        `;
        detailsQueryString = `INSERT INTO 
                        coursesBlogs( courseId, courseTitle, jdFull, courseAuthor )
                        VALUES( '${newID}', '${dataObject.courseTitle}', '${dataObject.jdFull}', '${dataObject.courseAuthor}' )
                        `;
    }
    blogsDB.query( detailsQueryString, ( err, results, fields ) => {
        if ( err ) {
            return res.send( 'Course Data not upload !!!' + err );
        }
        // console.log( 'The Inserted in table is: \n', results, fields );
        coursesDB.query( sqlQueryString, ( cerr, cresults, cfields ) => {
            if ( cerr ) {
                // console.log( "Not connected !!! " + err );
                return res.send( 'Course not upload !!!' + cerr );
            }
            // console.log( 'The Inserted in table is: \n', results, fields );
            if ( dataObject.courseId )
                path = path + '/' + dataObject.courseId;
            else
                path = path + '/' + results.insertId;
            return res.redirect( path );
        } );
    } );
}

async function newOrEditCourseForm( fileLocation, id, req, res ) {
    if ( req.admin || req.editor ) {
        if ( !id ) {
            return res.render( fileLocation, {
                suggestions,
                dataObject: {}
            } );
        } else {
            let sqlQueryString = `SELECT * FROM  
                        allCourses WHERE courseId = ${id}`;
            coursesDB.query( sqlQueryString, ( err, results, fields ) => {
                if ( err ) {
                    return res.send( "Please check your internet connection" );
                }
                // console.log( 'Getting data from table is: \n', results[ 0 ] );
                if ( !results.length )
                    return res.render( fileLocation, {
                        suggestions,
                        dataObject: {}
                    } );
                let detailsQueryString = `SELECT jdFull FROM coursesBlogs WHERE courseId = ${ id }`;
                blogsDB.query( detailsQueryString, ( err, details, fields ) => {
                    if ( err ) {
                        return res.send( "Please check your internet connection" );
                    }
                    dataObject = {
                        ...results[ 0 ],
                        ...details[ 0 ]
                    };
                    // console.log( dataObject )
                    return res.render( fileLocation, {
                        suggestions,
                        dataObject
                    } );
                } )

            } );
        }
    } else {
        res.redirect( '/nopage' );
    }

}

function arrayToStringObject( dataObject ) {
    for ( let key in dataObject ) {
        if ( Array.isArray( dataObject[ key ] ) ) {
            let str = '';
            for ( let i = 0; i < dataObject[ key ].length; i++ ) {
                str += dataObject[ key ][ i ] + ', ';
            }
            dataObject[ key ] = str;
        }
    }
    return dataObject;
}

function courseDescription( courseblogTable, fileLocation, id, res ) {
    let detailsQueryString = `SELECT * FROM ${ courseblogTable } WHERE courseId = ${ id }`;
    blogsDB.query( detailsQueryString, ( err, details, fields ) => {
        if ( err ) {
            return res.send( "Please check your internet connection" );
        }
        dataObject = {
            ...details[ 0 ]
        };
        // console.log( dataObject )
        return res.render( fileLocation, {
            suggestions,
            dataObject
        } );
    } )

}

function registerUserFunction( dataObject, res ) {
    // console.log( dataObject );
    let usersQueryString = `INSERT INTO 
                        usersBasicInfo( id, name, email, password, provider )
                        VALUES( '${dataObject.id}', '${dataObject.name}', '${dataObject.email}', '${dataObject.password}', 'offcampuscareer' )
                        `;
    usersDB.query( usersQueryString, ( err, results, fields ) => {
        if ( err ) {
            // console.log( "Not connected !!! " + err );
            return res.send( 'User already exists with this email' );
        }

        // console.log( 'The Inserted in table is: \n', results, fields );
        return res.send( 'success' );
    } );
}

function resetNewPasswordFunction( dataObject, res ) {
    // console.log( dataObject );
    let usersQueryString = `SELECT * FROM usersBasicInfo WHERE email = \'${ dataObject.email }\'`;
    usersDB.query( usersQueryString, ( err, results, fields ) => {
        if ( err ) {
            return res.send( 'Some error, login with another method with different email' );
        }
        if ( !results || !results[ 0 ] ) {
            return res.send( 'No user with this email' );
        } else if ( results[ 0 ].provider !== 'offcampuscareer' ) {
            return res.send( `Already exists with ${results[ 0 ].provider} Sign In method` );
        } else if ( results[ 0 ].password !== dataObject.token ) {
            return res.send( 'Password already updated with this link or outdated link' );
        }
        let usersQueryString2 = `UPDATE usersBasicInfo 
                        SET password = '${dataObject.password }'
                        WHERE email = \'${dataObject.email}\'
                        `;
        usersDB.query( usersQueryString2, ( err, results2, fields ) => {
            if ( err ) {
                return res.send( 'Some error, Please sign in with another method' );
            }
            return res.send( 'success' );
        } );
    } );
}

function sendresetpassmail( email, res ) {
    let usersQueryString = `SELECT * FROM usersBasicInfo WHERE email = \'${ email }\'`;
    usersDB.query( usersQueryString, ( err, results, fields ) => {
        if ( err ) {
            return res.send( 'Some error, login with another method with different email' );
        }
        if ( !results || !results[ 0 ] ) {
            return res.send( 'No user with this email' );
        } else if ( results[ 0 ].provider !== 'offcampuscareer' ) {
            return res.send( `Already exists with ${results[ 0 ].provider} Sign In method` );
        }
        let token = results[ 0 ].password;
        let messgeText = `Hello ${results[0].name},

Follow this link to reset your Offcampuscareer password for your ${email} account.

https: //offcampuscareer.com/auth/resetpass?email=${email}&token=${token}

If you didn’t ask to reset your password, you can ignore this email.

Thanks,

Your Offcampuscareer team`;
        let messageHtml = `<p><strong>Hello ${results[0].name},</strong></p>

<p>Follow this link to reset your Offcampuscareer password for your ${email} account.</p>

<p><a href="https://offcampuscareer.com/auth/resetpass?email=${email}&token=${token}">https://offcampuscareer.com/auth/resetpass?email=${email}&token=${token}</a></p>

<p>If you didn&rsquo;t ask to reset your password, you can ignore this email.</p>

<p><strong>Thanks,</strong></p>

<p><strong>Your Offcampuscareer team</strong></p>
`;
        sendMailResetPassWithEmail( results[ 0 ].email, messgeText, messageHtml, res );
    } );
}

function resetPassWithEmail( fileLocation, email, token, res ) {
    let usersQueryString = `SELECT * FROM usersBasicInfo WHERE email = \'${ email }\'`;
    usersDB.query( usersQueryString, ( err, results, fields ) => {
        if ( err ) {
            return res.render( fileLocation, {
                email,
                token,
                message: 'Some error, Please login with another method with different email'
            } );
        }
        if ( !results || !results[ 0 ] ) {
            return res.render( fileLocation, {
                email,
                token,
                message: 'No user with this email'
            } );
        }
        if ( token == results[ 0 ].password ) {
            return res.render( fileLocation, {
                email,
                token,
                message: ''
            } );
        } else {
            return res.render( fileLocation, {
                email,
                token,
                message: 'Password already updated with this link or outdated link'
            } );
        }
    } );
}

function getTitleFromMySql( res, dbReference, table = 'allCourses', lim = 500, pageNumber = 0 ) {
    let sqlQueryString = `SELECT courseTitle, courseUpdated FROM  
                        ${table} WHERE 1 
                        LIMIT ${ lim }  OFFSET ${ lim * ( pageNumber - 1 ) }`;
    dbReference.query( sqlQueryString, ( err, results, fields ) => {
        if ( err ) {
            // console.log( 'Error: ', err );
            return res.send( '' );
        }
        if ( !results.length )
            return res.send( '' );
        let titles = [];
        let dates = [];
        let ids = [];
        for ( let obj in results ) {
            titles.push( {
                ...results[ obj ]
            }.courseTitle );
            dates.push( {
                ...results[ obj ]
            }.courseUpdated );
            ids.push( {
                ...results[ obj ]
            }.courseId );
        }
        // console.log( titles );
        return res.send( {
            titles,
            dates,
            ids
        } );
    } );

}


module.exports = {
    crPastCheckOutsRecom,
    dataForCourseRecByTable,
    dataForCourseRecommandation,
    uploadDataCourseTable,
    newOrEditCourseForm,
    courseDescription,
    registerUserFunction,
    resetNewPasswordFunction,
    resetPassWithEmail,
    sendresetpassmail,
    getTitleFromMySql
}