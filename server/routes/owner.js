const router = require('express').Router();
const Owner = require('../models/owner')
const upload = require('../middlewares/upload-photo')

// POST Request

router.post('/owner', upload.single("photo"), async (req,res) => {
    try {
          let owner = new Owner();
          owner.name = req.body.name;
          owner.about = req.body.about;
          owner.photo = req.file.filename;
          
          await owner.save();

          res.status(200).json({
            success : true,
            message : "Successfully created a new owner"
          })
    } catch (error) {
        console.log("Create owner>>>>>", error);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})

// GET request

router.get('/owners', async (req,res) => {
    try {
        let owners = await Owner.find();
        res.status(200).json({
            success : true,
            owners : owners
        })
    } catch (error) {
        console.log("Get All owners Error >>>>>>", error);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})

module.exports = router;
