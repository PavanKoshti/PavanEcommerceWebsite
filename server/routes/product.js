const router = require('express').Router();
const Product = require('../models/product')
const upload = require('../middlewares/upload-photo')

// POST request :- create a new product

router.post('/product', upload.single("photo"), async (req, res) => {
    try {
        let product = new Product();
        product.title = req.body.title;
        product.description = req.body.description;
        product.ownerID = req.body.ownerID;
        product.categoryID = req.body.categoryID;
        product.photo = req.file.filename;
        product.price = req.body.price;
        product.stockQuantity = req.body.stockQuantity;

        await product.save();
        res.status(200).json({
            status: true,
            message: "Successfully Saved Product"
        })
    } catch (error) {
        console.log("Product Save >>>>>>", error);
        res.status(500).json({
            status: false,
            message: error.message
        })
    }

})


// GET request :- get all products

router.get('/products', async (req,res) => {
    try {
        let allProducts = await Product.find().populate('owner category').populate("reviews", "rating").exec();
        res.status(200).json({
            success : true,
            allProducts : allProducts
        })
    } catch (error) {
        console.log("Get All Products Error>>>>>>>>", error)
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})



// GET request :- get a single product

router.get('/product/:id',  async (req,res) => {
    try {
        let product = await Product.findOne({ _id : req.params.id }).populate('owner category').populate("reviews", "rating").lean().exec();
        let averageRating = await Product.findOne({ _id : req.params.id }).populate('owner category').populate("reviews", "rating").exec();
        product.catgType = product.category.type;
        product.ownerName = product.owner.name;
        product.ownerAbout = product.owner.about;
        product.ownerPhoto = product.owner.photo;
        product.averageRating = averageRating.averageRating
        res.status(200).json({
            success : true,
            product : product
        })
    } catch (error) {
        console.log("Get Single Product Error>>>>>>>>", error)
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})


//PUT request :- update a single product

router.put('/product/:id', upload.single("photo"), async (req,res) => {
    try {
        let product = await Product.findOneAndUpdate({ _id : req.params.id }, 
            {
                $set : {
                    title : req.body.title,
                    description : req.body.description,
                    photo : req.file.filename,
                    price : req.body.price,
                    stockQuantity : req.body.stockQuantity,
                    category : req.body.categoryID,
                    owner : req.body.ownerID

                }
            },
            {upsert : true}
        );
        res.status(200).json({
            success : true,
            message : "Product Updated Successfully",
            updatedProduct : product
        })
    } catch (error) {
        console.log("Get Single Product Update Error>>>>>>>>", error)
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})


// DELETE request :- delete a single product

router.delete('/product/:id', async (req,res) => {
    try {
        let deleteProduct = await Product.findOneAndDelete({_id : req.params.id})

        if (deleteProduct) {
            res.status(200).json({
                success : true,
                status : true,
                message : "Successfully Deleted Product",
                deleteProduct : deleteProduct
            })
        }
        

    } catch (error) {
        console.log("Delete Product By ID Error >>>>>>>>", error);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})

module.exports = router