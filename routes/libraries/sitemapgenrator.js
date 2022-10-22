const axios = require( 'axios' );

function filteStringSpace( str ) {
    let newStr = '';
    if ( !str.length ) {
        return str;
    }
    for ( let i = 0; i < str.length - 1; i++ ) {
        if ( str[ i ] === '\n' || str[ i ] === '\t' )
            continue;
        if ( str[ i ] === ' ' && ( str[ i + 1 ] === ' ' || str[ i + 1 ] === '\n' || str[ i + 1 ] === '\t' ) ) {
            continue;
        }
        newStr += str[ i ];
    }
    newStr += str[ str.length - 1 ];
    return newStr;
}


function removeSpecialChar( str ) {
    let newstr = '';
    for ( let i = 0; i < str.length; i++ ) {
        let ascii = str[ i ].charCodeAt( 0 );
        if ( ( ascii >= 48 && ascii <= 57 ) || ( ascii >= 65 && ascii <= 90 ) || ( ascii >= 97 && ascii <= 122 ) ) {
            newstr += str[ i ];
        } else if ( str[ i ] === '%' ) {
            newstr += ' percent ';
        } else if ( str[ i ] === '+' ) {
            newstr += ' plus ';
        } else {
            newstr += ' ';
        }
    }
    return newstr;
}

function stringToUrlStrEncode( title ) {
    title = title.toLowerCase();
    let newstr = removeSpecialChar( title );
    newstr = filteStringSpace( newstr );
    let output = '';
    for ( let i = 0; i < newstr.length; i++ ) {
        if ( newstr[ i ] === ' ' ) {
            output += '-';
        } else {
            output += newstr[ i ];
        }
    }
    return output;
}

async function generateXmlFor( xmlFileName, urlTable, databaseName, tableName, count, page, priority = 0.9 ) {
    // axios.defaults.baseURL = "https://offcampuscareer.com/"
    let res = await axios.get( `http://localhost:3000/secure/${databaseName}/${tableName}/${count}/${page}` ); //access only for private members
    let urlArr = res.data.titles;
    console.log( urlArr.length, res.data );
    let head = `<?xml version="1.0" encoding="UTF-8"?>
                <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
    console.log( head );
    if ( urlArr ) {
        for ( let i in urlArr ) {
            let url = await stringToUrlStrEncode( urlArr[ i ] );
            let data = `<url>
                            <loc>https://offcampuscareer.com/${urlTable}/${res.data.ids[i]}/${url}</loc>
    	                    <lastmod>${res.data.dates[i]}</lastmod>
    	                    <priority>${priority}</priority>
                        </url>`
            console.log( data );
            // nodemon index.js > sitemap_output.xml
        }
    }
    let footer = `</urlset>`;
    console.log( footer );
}

// function numtoalpha( num ) {
//     if ( num <= 9 ) {
//         return num.toString();
//     } else {
//         let alpha = 'a'.charCodeAt( 0 ) + ( num - 10 );
//         return String.fromCharCode( alpha );
//     }
// }

// function getAlphaNumValue( num ) {
//     let str = '';
//     while ( num ) {
//         let r = num % 36;
//         num = Math.floor( num / 36 );
//         str += numtoalpha( r );
//     }
//     return str;
// }
// console.log( getAlphaNumValue( 1642293514164 ) )
// generateXmlFor( 'sitemap_output.xml', 'coursesdb', 'allCourses', 50000, 1 );
// generateXmlFor( 'sitemap_output.xml', 'jobs', 'mongodb', 'jobs', 50000, 1 );
// generateXmlFor( 'sitemap_output.xml', 'internships', 'mongodb', 'internships', 50000, 1 );
// generateXmlFor( 'sitemap_output.xml', 'referral', 'mongodb', 'referral', 50000, 1 );
// generateXmlFor( 'sitemap_output.xml', 'forwomen', 'mongodb', 'forwomen', 50000, 1 );
// generateXmlFor( 'sitemap_output.xml', 'scholarships', 'mongodb', 'scholarships', 50000, 1 );
const shortid = require( 'shortid' );
shortid.characters( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@' );
//function from normal_function file
function duplication( SchemaMongo, tableAws ) {
    const myMap = new Map();
    myMap.set( "Nathan", "555-0182" );
    myMap.set( "Jane", "315-0322" );
    SchemaMongo.paginate( {}, {
            lean: true,
            page: 1,
            limit: 500
        },
        async function ( err, result ) {
            if ( err ) {
                return console.log( "Some err: " + err );
            }
            let events = result.docs;
            console.log( events.length );
            console.log( '[' )
            for ( let i = 0; i < events.length; i++ ) {
                let id = events[ i ]._id.toString();
                let tableData = await getDataById( tableAws, id );
                let newID = shortid.generate();
                tableData = tableData.Item;
                events[ i ]._id = newID;
                tableData._id = newID;
                delete events[ i ].id;
                delete events[ i ].__v;
                // console.log( events[ i ], tableData );
                console.log( `'${id}',` );
                const addData2Mongo = await new SchemaMongo( events[ i ] );
                await addOrUpdateData( tableAws, tableData );
                await addData2Mongo.save();
            }
            console.log( '];' )

        } );

    // for ( let [ key, value ] of myMap ) {
    //     console.log( `${key} = ${value}` );
    // }
}
// duplication( ForwomenData, tables.names[ 2 ] );
// console.log( shortid.generate(), shortid.generate() )

function dataDeletion( dbName ) {
    let ids = [
        '61dfe8e760c1ab0ca91047b1',
        '61dfed8f60c1ab0ca91047b5',
        '61dff5eb60c1ab0ca91047e5',
        '61dffc1260c1ab0ca91047f4',
    ];
    let infoObject = {};
    for ( let i = 0; i < ids.length; i++ ) {
        infoObject.database = dbName;
        infoObject.id = ids[ i ];
        deleteDataFromBothDBsById( infoObject );
    }
}
// dataDeletion( 'forwomen' );

module.exports = {
    generateXmlFor
};