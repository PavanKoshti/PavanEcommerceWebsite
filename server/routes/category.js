const router = require('express').Router();
const Category = require('../models/category')

// POST Request

router.post('/categories', async (req,res) => {
    try {
          let category = new Category();
          category.type = req.body.type;
          
          await category.save();

          res.status(200).json({
            success : true,
            message : "Successfully created a new category"
          })
    } catch (error) {
        console.log("Create Categories>>>>>", error);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})


// GET request

router.get('/categories', async (req,res) => {
    try {
        let categories = await Category.find();
        res.status(200).json({
            success : true,
            categories : categories
        })
    } catch (error) {
        console.log("Get All Categories Error >>>>>>", error);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})

module.exports = router;
