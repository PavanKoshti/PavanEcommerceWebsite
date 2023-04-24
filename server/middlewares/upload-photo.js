
const multer = require('multer');

const Storage = multer.diskStorage({
  destination : 'uploadsImages',
  filename : (req,file,cb) => {
    cb(null, file.originalname);
  },
})

const upload = multer({
  storage : Storage
})


module.exports = upload;


// const aws = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// aws.config.update({
//   secretAccessKey: process.env.Secretaccesskey,
//   accessKeyId: process.env.AccesskeyID
// });

// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "pavan-clone-v1",
//     // acl: "public-read",
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, Date.now().toString());
//     }
//   })
// });


