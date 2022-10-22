const aws = require( 'aws-sdk' );
require( 'dotenv' ).config();
aws.config.update( {
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
} );
const dynamoClient = new aws.DynamoDB.DocumentClient();
const tables = {
    'names': [
        'editorials',
        'forwomenData',
        'forwomenDetails',
        'internshipsData',
        'internshipsDetails',
        'jobsDatas',
        'jobsDetails',
        'referralsData',
        'referralsDetails',
        'scholarshipsData',
        'scholarshipsDetails'
    ]
}
const getData = async ( TABLE_NAME ) => {
    const params = {
        TableName: TABLE_NAME,
    };
    const allRecords = await dynamoClient.scan( params ).promise();
    return allRecords;
};

const getDataById = async ( TABLE_NAME, id ) => {
    if ( !id ) {
        return {};
    }
    const params = {
        TableName: TABLE_NAME,
        Key: {
            '_id': id,
        },
    };
    return await dynamoClient.get( params ).promise();
};

const addOrUpdateData = async ( TABLE_NAME, item ) => {
    const params = {
        TableName: TABLE_NAME,
        Item: item,
    };
    return await dynamoClient.put( params ).promise();
};

const deleteDataById = async ( TABLE_NAME, id ) => {
    if ( !id )
        return;
    const params = {
        TableName: TABLE_NAME,
        Key: {
            '_id': id,
        },
    };
    return await dynamoClient.delete( params ).promise();
};

let {
    dataUpload
} = require( '../data/variablesData' );
const addOrUpdateDataMulti = async ( TABLE_NAME, items ) => {
    for ( let i = 0; i < items.length; i++ ) {
        // console.log( deleteDataById( TABLE_NAME, items[ i ][ '_id' ] ) );
        addOrUpdateData( TABLE_NAME, items[ i ] );
    }
};
// addOrUpdateDataMulti( 'scholarshipsDetails', dataUpload );

module.exports = {
    tables,
    dynamoClient,
    getData,
    getDataById,
    addOrUpdateData,
    deleteDataById
};