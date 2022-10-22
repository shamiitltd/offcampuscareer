const {
    currencyExchange,
    experienceLevelExchange,
    suggestions,
    admins,
    editors
} = require( '../data/staticData' );
const {
    tables,
    getData,
    getDataById,
    addOrUpdateData,
    deleteDataById
} = require( '../database/dynamoDB' );
const {
    v4: uuid
} = require( 'uuid' );
const {
    JobsData,
    ForwomenData,
    InternshipsData,
    ReferralsData,
    ScholarshipsData
} = require( '../database/schemas' );
const {
    coursesDB,
    blogsDB
} = require( '../database/mysqlDB' );

function updateSearchForm( fileLocation, queryString, res ) {
    res.render( fileLocation, {
        currencyExchange,
        experienceLevelExchange,
        queryString
    } );
}

async function newOrEditForm( SchemaBasic, tableName, fileLocation, id, req, res ) {
    if ( req.admin || req.editor ) {
        if ( !id ) {
            return res.render( fileLocation, {
                currencyExchange,
                experienceLevelExchange,
                suggestions,
                dataObject: {}
            } );
        } else {
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
                    suggestions,
                    dataObject: companyDetails
                } );
            } ).catch( ( err ) => {
                return res.send( 'Error: Do not disturb URL/ Check database connection' );
            } );
        }
    } else {
        res.redirect( '/nopage' );
    }

}

function uploadToDynamoDB( tabName, path, req, res ) {
    const bodyData = req.body;
    bodyData.minSalary = bodyData.minSalary * currencyExchange[ bodyData.currency ];
    bodyData.maxSalary = bodyData.maxSalary * currencyExchange[ bodyData.currency ];
    bodyData._id = uuid();
    addOrUpdateData( tabName, bodyData );
    res.redirect( path );
}

function normalPostingFunction( NewSchema, path, req, res ) {
    const bodyData = req.body;
    if ( path === '/referral' )
        bodyData = getJobTimePeriodType( bodyData );
    bodyData.minSalary = bodyData.minSalary * currencyExchange[ bodyData.currency ];
    bodyData.maxSalary = bodyData.maxSalary * currencyExchange[ bodyData.currency ];
    const uploadToDB = new NewSchema( bodyData );
    uploadToDB.save();
    res.redirect( path )
}

function checkAuthentication( req, res, next ) {
    if ( req.isAuthenticated() ) {
        if ( admins.includes( req.user.email ) )
            req.admin = true;
        if ( editors.includes( req.user.email ) )
            req.editor = true;
        return next();
    }
    let strurl = req.url
    // req.protocol + "://" + req.headers.host +
    res.cookie( 'PRURL', strurl );
    return res.redirect( '/signin' );
}

function checkNotAuthenticated( req, res, next ) {
    if ( req.isAuthenticated() ) {
        return res.redirect( '/' );
    }
    return next();
}


function getJobTimePeriodType( dataObject ) {
    let newStrjtp = '';
    let newStrperks = '';
    for ( let key in dataObject ) {
        if ( key === 'ft' || key === 'pt' || key === 'ct' || key === 'st' ) {
            newStrjtp += dataObject[ key ] + ', ';
        }
        if ( key === 'visaSponser' || key === 'paidRelocation' ) {
            newStrperks += dataObject[ key ] + ', ';
        }

    }
    for ( let key in dataObject ) {
        if ( key === 'ft' || key === 'pt' || key === 'ct' || key === 'st' || key === 'visaSponser' || key === 'paidRelocation' ) {
            delete dataObject[ key ];
        }
    }
    dataObject[ 'jtp' ] = newStrjtp;
    dataObject[ 'perks' ] = newStrperks;
    return dataObject;
}

function uploadDividedDataToBDs( MongodbSchema, dynamoTableName, dataObject ) {
    if ( !dataObject.lastDate ) {
        delete dataObject.lastDate; //to access default date
    }
    let id = '';
    if ( dataObject.id ) {
        id = dataObject.id;
        delete dataObject.id;
    }
    let formDataPart1 = {};
    let formDataPart2 = {};
    let flag = 1;
    for ( let key in dataObject ) {
        if ( flag ) {
            formDataPart1[ key ] = dataObject[ key ];
        } else {
            if ( key === 'perks' || key === 'jtp' )
                formDataPart1[ key ] = dataObject[ key ];
            else
                formDataPart2[ key ] = dataObject[ key ];
        }
        if ( key === 'city' ) {
            flag = 0;
        }
    }

    // console.log(formDataPart1, formDataPart2);
    formDataPart1.minSalary = formDataPart1.minSalary * currencyExchange[ formDataPart1.currency ];
    formDataPart1.maxSalary = formDataPart1.maxSalary * currencyExchange[ formDataPart1.currency ];
    if ( id ) {
        MongodbSchema.findOneAndUpdate( {
            _id: id
        }, formDataPart1, {
            upsert: true
        }, function ( err, doc ) {} );
        formDataPart2._id = id;
        addOrUpdateData( dynamoTableName, formDataPart2 );
    } else {
        const addData2Mongo = new MongodbSchema( formDataPart1 );
        formDataPart2._id = addData2Mongo._id.toString();
        addOrUpdateData( dynamoTableName, formDataPart2 );
        addData2Mongo.save();
    }
}

function deleteDataFromBothDBsById( infoObject ) {
    let {
        database,
        id
    } = infoObject;
    if ( database ) {
        if ( database === 'forwomen' ) {
            ForwomenData.deleteMany( {
                _id: id
            } ).catch( err => {} );
            deleteDataById( tables.names[ 2 ], id );
        } else if ( database === 'internships' ) {
            InternshipsData.deleteMany( {
                _id: id
            } ).catch( err => {} );
            deleteDataById( tables.names[ 4 ], id );
        } else if ( database === 'jobs' ) {
            JobsData.deleteMany( {
                _id: id
            } ).catch( err => {} );
            deleteDataById( tables.names[ 6 ], id );
        } else if ( database === 'referral' ) {
            ReferralsData.deleteMany( {
                _id: id
            } ).catch( err => {} );
            deleteDataById( tables.names[ 8 ], id );
        } else if ( database === 'scholarships' ) {
            ScholarshipsData.deleteMany( {
                _id: id
            } ).catch( err => {} );
            deleteDataById( tables.names[ 10 ], id );
        } else if ( database === 'courses' ) {
            let sqlQueryString = `DELETE FROM  
                        allCourses WHERE courseId=${id}`;
            coursesDB.query( sqlQueryString, ( err, results, fields ) => {
                if ( err ) {
                    // console.log( "Not connected !!! " + err );
                    return;
                }
                // console.log( 'Getting data from table is: \n', results );
            } );
            let detailsQueryString = `DELETE FROM  
                        coursesBlogs WHERE courseId=${id}`;
            blogsDB.query( detailsQueryString, ( err, results, fields ) => {
                if ( err ) {
                    // console.log( "Not connected !!! " + err );
                    return;
                }
                // console.log( 'Getting data from table is: \n', results );
            } );

        }
    }
}

module.exports = {
    getJobTimePeriodType,
    updateSearchForm,
    uploadToDynamoDB,
    uploadDividedDataToBDs,
    normalPostingFunction,
    checkAuthentication,
    checkNotAuthenticated,
    newOrEditForm,
    deleteDataFromBothDBsById
};