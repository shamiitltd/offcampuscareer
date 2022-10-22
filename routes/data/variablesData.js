// const mongoose = require('../database/connectDB');
// const express = require('express');
// const routes = express.Router();
// const varData = new mongoose.Schema({
//     highestQualification: [String]
// });
// const VarData = mongoose.model('varData', varData);
// // const hQ = new VarData({
// //     highestQualification: [
// //         '10th Pass',
// //         '12th Pass',
// //         "Bachelor's Degree",
// //         "Master's Degree",
// //         "Diploma",
// //         "Doctoral Degree"
// //     ]
// // });
// // hQ.save();
// // console.log('Hello king')
// // VarData.find({}).then(data => {
// //     console.log(data);
// //     // res.send(data);
// // });

// routes.get('/:variableName', (req, res) => { //variableName ===> highestQualification
//     const data = req.params.variableName;
//     VarData.findOne({}).then(data => {
//         console.log(data.highestQualification);
//         res.send(data.highestQualification);
//     });
// });
// module.exports = routes;

let dataUpload = [];

module.exports = {
    dataUpload
};