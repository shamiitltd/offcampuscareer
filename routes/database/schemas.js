const mongoose = require( './connectDB' );
const mongoosePaginate = require( 'mongoose-paginate-v2' );
const shortid = require( 'shortid' );
shortid.characters( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@' );
const jobsData = new mongoose.Schema( {
    // jobType: {
    _id: {
        type: String,
        default: shortid.generate
    },
    r: {
        type: String,
        default: ''
    },
    g: {
        type: String,
        default: ''
    },
    jtp: {
        type: String,
        default: ''
    },
    // },
    // skills: {
    qualification: {
        type: [ String ],
        default: []
    },
    majSub: {
        type: [ String ],
        default: []
    },
    aoi: {
        type: [ String ],
        default: []
    }, //area of interest
    // },
    // salary: {
    currency: String,
    minSalary: {
        type: Number,
        default: 0
    },
    maxSalary: {
        type: Number,
        default: 0
    },
    // },
    // backGround: {
    minexp: {
        type: Number,
        default: 0
    },
    maxexp: {
        type: Number,
        default: 7
    },
    // expYears: { type: Number, default: 0 },
    role: {
        type: [ String ],
        default: []
    },
    // },
    // others: {
    industries: {
        type: [ String ],
        default: []
    },
    companies: {
        type: String,
        default: ''
    },
    jobTitle: {
        type: String,
        default: ''
    },
    perks: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date( Date.now() + ( 30 * 24 * 60 * 60 * 1000 ) )
    },
    responseRate: {
        type: Number,
        default: 3
    },
    quickApply: {
        type: String,
        default: ''
    },
    logoUrl: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    }
    // }
} );
jobsData.index( {
    "$**": "text"
}, {
    "weights": {
        jobTitle: 7,
        r: 5,
        g: 5,
        jtp: 5,
        qualification: 5,
        role: 4,
        majSub: 4,
        companies: 3,
        aoi: 3,
        industries: 2
    }
} );
jobsData.plugin( mongoosePaginate );

const JobsData = mongoose.model( 'jobsData', jobsData );
const InternshipsData = mongoose.model( 'internshipsData', jobsData );
const ReferralsData = mongoose.model( 'referralsData', jobsData );

const scholarshipsData = new mongoose.Schema( {
    _id: {
        type: String,
        default: shortid.generate
    },
    g: {
        type: String,
        default: ''
    },
    aoi: {
        type: [ String ],
        default: []
    }, //area of interest
    qualification: {
        type: [ String ],
        default: []
    },
    currency: String,
    minSalary: {
        type: Number,
        default: 0
    },
    maxSalary: {
        type: Number,
        default: 0
    },
    companies: {
        type: String,
        default: ''
    },
    jobTitle: {
        type: String,
        default: ''
    },
    responseRate: {
        type: Number,
        default: 3
    },
    quickApply: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date( Date.now() + ( 30 * 24 * 60 * 60 * 1000 ) )
    },
    logoUrl: {
        type: String,
        default: ''
    },
    // location: {
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    }
    // }
} );
scholarshipsData.index( {
    "$**": "text"
}, {
    "weights": {
        jobTitle: 6,
        g: 5,
        qualification: 5,
        companies: 3,
        aoi: 3,
    }
} );
scholarshipsData.plugin( mongoosePaginate );
const ScholarshipsData = mongoose.model( 'scholarshipsData', scholarshipsData );
const ForwomenData = mongoose.model( 'forwomenData', scholarshipsData );

//Deletion of some data starts here

/*
let delJid = '6177626aab47e980f83d6abe';
JobsData.deleteMany({ _id: delJid }).then(data => console.log(data));
JobsDetails.deleteMany({ jid: delJid }).then(data => console.log(data));
*/

//Deletion end here
// for ( let i = 0; i < 10; i++ ) {
//     console.log( shortid.generate() )
// }
module.exports = {
    JobsData,
    InternshipsData,
    ReferralsData,
    ScholarshipsData,
    ForwomenData
};