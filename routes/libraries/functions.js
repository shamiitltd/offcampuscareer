// const { Editorial } = require('../database/schemas');
const {
    currencyExchange,
    experienceLevelExchange
} = require( '../data/staticData' );
const {
    tables,
    getData,
    getDataById,
    addOrUpdateData,
    deleteDataById
} = require( '../database/dynamoDB' );


async function jobDescriptionFromDB( SchemaBasic, tableName, fileLocation, id, res ) {
    SchemaBasic.findOne( {
        _id: id
    }, {}, {
        lean: true
    } ).then( async ( jdata ) => {
        const tableData = await getDataById( tableName, id );
        const companyDetails = await {
            ...jdata,
            ...tableData.Item
        };
        return await res.render( fileLocation, {
            currencyExchange,
            experienceLevelExchange,
            companyDetails
        } );
    } ).catch( ( err ) => {
        return res.send( 'Please check your Internet connection' );
    } );
}
async function getDescWithDataFromMongoDB( SchemaBasic, tableName, fileLocation, qstr, res ) {
    SchemaBasic.findOne( {
        $text: {
            $search: qstr
        }
    }, {}, {
        lean: true
    } ).then( async ( jdata ) => {
        // console.log( jdata._id.toString() );
        const tableData = await getDataById( tableName, jdata._id.toString() );
        const companyDetails = await {
            ...jdata,
            ...tableData.Item
        };
        return await res.render( fileLocation, {
            currencyExchange,
            experienceLevelExchange,
            companyDetails
        } );
    } ).catch( ( err ) => {
        return res.send( 'Please check your Internet connection' );
    } );
}


async function jobArrayFromDB( SchemaBasic, tableName, repeatingBox, descriptionBox, fileLocation, queryString, res, pageNumber = 1, lim = 15 ) {
    let id;
    if ( queryString.id ) {
        id = queryString.id;
        delete queryString.id;
    }
    let searchString = searchStringGenerator( queryString );
    if ( queryString.salary )
        queryString.salary = Number( queryString.salary ) * currencyExchange[ queryString.currency ];
    if ( Object.keys( queryString ).length === 0 ) {
        SchemaBasic.paginate( {}, {
                sort: {
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                if ( err ) {
                    return res.send( "Please refresh Your page or check internet" );
                }

                let events = result.docs;
                if ( events.length ) {
                    if ( !id ) {
                        id = events[ 0 ]._id.toString();
                    }
                }
                const tableData = await getDataById( tableName, id );
                const jdata = await events.find( ele => ele._id == id );
                const companyDetails = await {
                    ...jdata,
                    ...tableData.Item
                };
                return await res.render( fileLocation, {
                    repeatingBox,
                    descriptionBox,
                    currencyExchange,
                    experienceLevelExchange,
                    queryString,
                    companiesData: result,
                    companyDetails
                } );
            } );

    } else if ( searchString ) {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        if ( !queryString.minexp )
            queryString.minexp = 0;
        if ( !queryString.maxexp )
            queryString.maxexp = 7;

        SchemaBasic.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( queryString.maxexp )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( queryString.minexp )
                    }
                } ],
                $text: {
                    $search: searchString
                }
            }, {
                score: {
                    $meta: "textScore"
                },
                sort: {
                    score: {
                        $meta: 'textScore'
                    },
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                // console.log( err, result );
                if ( err ) {
                    return res.send( "Please refresh Your page or check internet" );
                }

                let events = result.docs;
                if ( events.length ) {
                    if ( !id ) {
                        id = events[ 0 ]._id.toString();
                    }
                }
                const tableData = await getDataById( tableName, id );
                const jdata = await events.find( ele => ele._id == id );
                const companyDetails = await {
                    ...jdata,
                    ...tableData.Item
                };
                return await res.render( fileLocation, {
                    repeatingBox,
                    descriptionBox,
                    currencyExchange,
                    experienceLevelExchange,
                    queryString,
                    companiesData: result,
                    companyDetails
                } );
            } );

    } else {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        if ( !queryString.minexp )
            queryString.minexp = 0;
        if ( !queryString.maxexp )
            queryString.maxexp = 7;

        SchemaBasic.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( queryString.maxexp )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( queryString.minexp )
                    }
                } ]
            }, {
                sort: {
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                // console.log( err );
                if ( err ) {
                    return res.send( "Please refresh Your page or check internet" );
                }
                let events = result.docs;
                if ( events.length ) {
                    if ( !id ) {
                        id = events[ 0 ]._id.toString();
                    }
                }
                const tableData = await getDataById( tableName, id );
                const jdata = await events.find( ele => ele._id == id );
                const companyDetails = await {
                    ...jdata,
                    ...tableData.Item
                };
                return await res.render( fileLocation, {
                    repeatingBox,
                    descriptionBox,
                    currencyExchange,
                    experienceLevelExchange,
                    queryString,
                    companiesData: result,
                    companyDetails
                } );
            } );

    }
}
async function dataForHomeRecFresh( SchemaJob, minexpji, maxexpji, fileLocation, queryString, res, pageNumber = 1, lim = 3 ) {
    let searchString = searchStringGenerator( queryString );
    if ( queryString.salary )
        queryString.salary = Number( queryString.salary ) * currencyExchange[ queryString.currency ];
    if ( searchString ) {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        SchemaJob.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( maxexpji )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( minexpji )
                    }
                } ],
                $text: {
                    $search: searchString
                }
            }, {
                score: {
                    $meta: "textScore"
                },
                sort: {
                    score: {
                        $meta: 'textScore'
                    },
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                if ( result ) {
                    result.type = 'Freshers';
                    res.render( fileLocation, {
                        currencyExchange,
                        experienceLevelExchange,
                        queryString,
                        result
                    } );
                } else {
                    res.send( "Please refresh Your page or check internet" );
                }
            } );

    } else {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        SchemaJob.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( maxexpji )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( minexpji )
                    }
                } ]
            }, {
                sort: {
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                if ( result ) {
                    result.type = 'Freshers';
                    res.render( fileLocation, {
                        currencyExchange,
                        experienceLevelExchange,
                        queryString,
                        result
                    } );
                } else {
                    res.send( "Please refresh Your page or check internet" );
                }
            } );
    }
}
async function dataForHomeRecExpJobs( SchemaJob, fileLocation, queryString, res, pageNumber = 1, lim = 3 ) {
    let searchString = searchStringGenerator( queryString );
    if ( queryString.salary )
        queryString.salary = Number( queryString.salary ) * currencyExchange[ queryString.currency ];
    if ( searchString ) {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        if ( !queryString.minexp )
            queryString.minexp = 2;
        if ( !queryString.maxexp )
            queryString.maxexp = 7;
        SchemaJob.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( queryString.maxexp )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( queryString.minexp )
                    }
                } ],
                $text: {
                    $search: searchString
                }
            }, {
                score: {
                    $meta: "textScore"
                },
                sort: {
                    score: {
                        $meta: 'textScore'
                    },
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                if ( result ) {
                    result.type = 'Experienced';
                    res.render( fileLocation, {
                        currencyExchange,
                        experienceLevelExchange,
                        queryString,
                        result
                    } );
                } else {
                    res.send( "Please refresh Your page or check internet" );
                }
            } );

    } else {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        if ( !queryString.minexp )
            queryString.minexp = 2;
        if ( !queryString.maxexp )
            queryString.maxexp = 7;
        SchemaJob.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( queryString.maxexp )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( queryString.minexp )
                    }
                } ]
            }, {
                sort: {
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                if ( result ) {
                    result.type = 'Experienced';
                    res.render( fileLocation, {
                        currencyExchange,
                        experienceLevelExchange,
                        queryString,
                        result
                    } );
                } else {
                    res.send( "Please refresh Your page or check internet" );
                }
            } );

    }
}
async function dataForHomeRecInern( SchemaIntern, minexpji, fileLocation, queryString, res, pageNumber = 1, lim = 3 ) {
    let searchString = searchStringGenerator( queryString );
    if ( queryString.salary )
        queryString.salary = Number( queryString.salary ) * currencyExchange[ queryString.currency ];
    if ( searchString ) {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        if ( !queryString.maxexp )
            queryString.maxexp = 7;
        SchemaIntern.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( queryString.maxexp )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( minexpji )
                    }
                } ],
                $text: {
                    $search: searchString
                }
            }, {
                score: {
                    $meta: "textScore"
                },
                sort: {
                    score: {
                        $meta: 'textScore'
                    },
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                if ( result ) {
                    result.type = 'Internships';
                    res.render( fileLocation, {
                        currencyExchange,
                        experienceLevelExchange,
                        queryString,
                        result
                    } );
                } else {
                    res.send( "Please refresh Your page or check internet" );
                }
            } );
    } else {
        if ( !queryString.salary ) {
            queryString.salary = 0;
        }
        if ( !queryString.maxexp )
            queryString.maxexp = 7;
        SchemaIntern.paginate( {
                minSalary: {
                    $gte: Number( queryString.salary )
                },
                $and: [ {
                    "minexp": {
                        $lte: Number( queryString.maxexp )
                    }
                }, {
                    "maxexp": {
                        $gte: Number( minexpji )
                    }
                } ]
            }, {
                sort: {
                    minSalary: -1
                },
                // offset: 0,
                lean: true,
                page: pageNumber,
                limit: lim
            },
            async function ( err, result ) {
                if ( result ) {
                    result.type = 'Internships';
                    res.render( fileLocation, {
                        currencyExchange,
                        experienceLevelExchange,
                        queryString,
                        result
                    } );
                } else {
                    res.send( "Please refresh Your page or check internet" );
                }
            } );

    }
}


function searchStringGenerator( queryString ) {
    let searchString = '';
    for ( let key in queryString ) {
        if ( !( key === 'salary' || key === 'minexp' || key === 'maxexp' || key === 'currency' || key === 'page' || key === 'limit' ) ) {
            if ( key !== 'searchAll' ) {
                if ( Array.isArray( queryString[ key ] ) ) {
                    queryString[ key ].forEach( element => {
                        if ( element )
                            searchString += ' ' + element + ' ';
                    } )
                } else if ( queryString[ key ] )
                    searchString += ' \"' + queryString[ key ] + '\"';
            } else if ( queryString[ key ] ) {
                searchString += ' ' + queryString[ key ];
            }
        }
    }
    return searchString;
}


async function getSelectionTips( fileLocation, res, id ) {
    const tableData = await getDataById( tables.names[ 0 ], id );
    await res.render( fileLocation, {
        currencyExchange,
        experienceLevelExchange,
        editorialDetails: tableData.Item
    } );
}

function getTitleFromMongo( res, Schema, lim, pageNumber ) {
    Schema.paginate( {}, {
            // offset: 0,
            lean: true,
            page: pageNumber,
            limit: lim
        },
        async function ( err, result ) {
            if ( result ) {
                result = result.docs;
                let titles = [];
                let dates = [];
                let ids = [];
                for ( let obj in result ) {
                    titles.push( result[ obj ].jobTitle );
                    ids.push( result[ obj ]._id );
                    if ( result[ obj ].startDate )
                        dates.push( result[ obj ].startDate.toISOString().slice( 0, 10 ) );
                    else {
                        dates.push( new Date().toISOString().slice( 0, 10 ) );
                    }
                }
                // console.log( titles );
                res.send( {
                    titles,
                    dates,
                    ids
                } );
            } else {
                res.send( '' );
            }
        } );
}

function numtoalpha( num ) {
    if ( num <= 9 ) {
        return num.toString();
    } else {
        let alpha = 'a'.charCodeAt( 0 ) + ( num - 10 );
        return String.fromCharCode( alpha );
    }
}

function getAlphaNumValue( num ) {
    let str = '';
    while ( num ) {
        let r = num % 36;
        num = Math.floor( num / 36 );
        str += numtoalpha( r );
    }
    return str;
}



module.exports = {
    getSelectionTips,
    dataForHomeRecFresh,
    dataForHomeRecExpJobs,
    dataForHomeRecInern,
    jobArrayFromDB,
    jobDescriptionFromDB,
    getDescWithDataFromMongoDB,
    searchStringGenerator,
    getTitleFromMongo,
    getAlphaNumValue
};