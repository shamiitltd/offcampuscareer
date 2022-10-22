const {
    language,
} = require( '../data/staticData' );
const {
    toolsoc2
} = require( '../database/mysqlDB' );
const shortid = require( 'shortid' );
shortid.characters( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@' );
const {
    finalRssGeneration
} = require( './sitemapscanner' );

async function toolsUiLoader( tableName, fileLocation, id, req, res ) {
    if ( req.admin || req.editor ) {
        if ( !id ) {
            return res.render( fileLocation, {
                language,
                dataObject: {
                    uid: req.user.id,
                    username: req.user.name
                }
            } );
        } else {
            let sqlQueryString = `SELECT * FROM  
                        ${tableName} WHERE rssid='${id}' AND (userid=${req.user.id} or ${req.admin} IS TRUE)`;
            toolsoc2.query( sqlQueryString, ( err, results, fields ) => {
                if ( err ) {
                    return res.send( "Please check your internet connection" + err );
                }
                // console.log( 'Getting data from table is: \n', results[ 0 ] );
                if ( !results.length )
                    return res.render( fileLocation, {
                        language,
                        dataObject: {
                            uid: req.user.id,
                            username: req.user.name
                        }
                    } ); //stringToArray
                dataObject = {
                    rssid: results[ 0 ].rssid,
                    uid: results[ 0 ].userid,
                    emails: stringToArray( results[ 0 ].emails ),
                    urls: stringToArray( results[ 0 ].urls ),
                    included: stringToArray( results[ 0 ].included ),
                    excluded: stringToArray( results[ 0 ].excluded ),
                    username: req.user.name,
                    language: results[ 0 ].language,
                    frequency: results[ 0 ].frequency,
                    ndtype: results[ 0 ].ndtype
                };
                return res.render( fileLocation, {
                    language,
                    dataObject
                } );
            } );
        }
    } else {
        res.redirect( '/nopage' );
    }
}

async function uploadtoolInfoData( tableName, dataObject, res, path ) {
    dataObject = await arrayToStringObjectTool( dataObject );
    let sqlQueryString;
    if ( dataObject.rssid ) {
        sqlQueryString = `UPDATE ${ tableName } 
                        SET userid='${ dataObject.userid }',
                        emails = '${ dataObject.emails ? dataObject.emails:'' }',
                        urls = '${ dataObject.urls ? dataObject.urls:'' }',
                        included = '${ dataObject.included ? dataObject.included:'' }',
                        excluded = '${ dataObject.excluded ? dataObject.excluded:'' }',
                        language='${ dataObject.language }',
                        frequency = '${ dataObject.frequency ? dataObject.frequency:0 }',
                        ndtype='${ dataObject.ndtype }',
                        updated = DATE_ADD( CURRENT_TIMESTAMP(), INTERVAL ${dataObject.frequency !='0' ? 1400/dataObject.frequency:5256000} MINUTE )
                        WHERE rssid='${dataObject.rssid}'
                        `;
    } else {
        let rssid = shortid.generate();
        dataObject.rssid = rssid;
        sqlQueryString = `INSERT INTO 
                        ${tableName}( rssid, userid, emails, urls, included, excluded, language, frequency, ndtype)
                        VALUES( '${dataObject.rssid}', '${dataObject.userid}', '${dataObject.emails?dataObject.emails:''}', '${dataObject.urls?dataObject.urls:''}', '${dataObject.included?dataObject.included:''}', '${dataObject.excluded?dataObject.excluded:''}', '${dataObject.language}', '${dataObject.frequency}', '${dataObject.ndtype}' )
                        `;
    }
    toolsoc2.query( sqlQueryString, async ( cerr, cresults, cfields ) => {
        if ( cerr ) {
            // console.log( "Not connected !!! " + err );
            return res.send( 'Course not upload !!!' + cerr );
        }
        // console.log( 'The Inserted in table is: \n', cresults, cfields );
        let mailObj = {
            emails: dataObject.emails ? dataObject.emails : '',
            rssid: dataObject.rssid,
            userid: dataObject.userid,
        }
        await finalRssGeneration( dataObject.rssid, dataObject.language, stringToArray( dataObject.urls ), stringToArray( dataObject.included ), stringToArray( dataObject.excluded ), mailObj );
        path = await path + '/' + dataObject.rssid + '.xml';
        return await res.redirect( path );
    } );
}

function stringToArray( str ) { //make array unique
    if ( !str || str.length == 0 )
        return [];
    return str.split( ',' );
}

async function makeArrRecordUniqueNormal( arrOld ) {
    let tempObj = {};
    await arrOld.forEach( ( record ) => {
        record = record.trim();
        tempObj[ record ] = true
    } );
    let arrNew = [];
    arrNew = Object.keys( tempObj ).map( ( key ) => [ key ] );
    return arrNew;
}

async function arrayToStringObjectTool( dataObject ) {
    for ( let key in dataObject ) {
        if ( Array.isArray( dataObject[ key ] ) ) {
            dataObject[ key ] = await makeArrRecordUniqueNormal( dataObject[ key ] );
            let str = '';
            for ( let i = 0; i < dataObject[ key ].length; i++ ) {
                if ( str != '' ) str += ',';
                str += dataObject[ key ][ i ];
            }
            dataObject[ key ] = str;
        }
    }
    return await dataObject;
}
// let smapUrls = " https://timesofindia.indiatimes.com/videos/entertainment/regional/bhojpuri, https://www.aajtak.in/,https://www.aajtak.in/rssfeeds/news-sitemap.xml"
// let included = "";
// let excluded = "";
// finalRssGeneration( "sdfj3fds34", 'en', stringToArray( smapUrls ), stringToArray( included ), stringToArray( excluded ) );

module.exports = {
    toolsUiLoader,
    uploadtoolInfoData,
};