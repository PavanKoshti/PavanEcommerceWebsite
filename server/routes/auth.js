const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verify-token')


// SIGNUP ROUTE 

router.post('/auth/signup', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, message: "Please Enter Email and Password" });
    }
    else {
        try {
            let newUser = new User();
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            await newUser.save();
            let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
                expiresIn: 604800 // 1 WEEK
            });
            res.json({
                token: token,
                success: true,
                message: "Successfully Created a New User"
            })
        } catch (error) {
            console.log("Singup Error >>>", error);
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
});

// PROFILE ROUTE 

router.get('/auth/user', verifyToken, async (req, res) => {
    try {
        let foundUser = await User.findOne({ _id: req.decoded._id });
        if (foundUser) {
            res.json({
                success: true,
                user: foundUser
            })
        }
    } catch (error) {
        console.log("Error While Get Profile route >>>", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

//UPDATE PROFILE ROUTE 

router.put('/auth/user', verifyToken, async (req, res) => {
    try {
        let foundUser = await User.findOne({ _id: req.decoded._id });

        if (foundUser) {
            if (req.body.name) foundUser.name = req.body.name;
            if (req.body.email) foundUser.email = req.body.email;
            if (req.body.password) foundUser.password = req.body.password;

            await foundUser.save();

            res.json({
                success: true,
                message: "Successfully updated"
            });
        }
    } catch (error) {
        console.log("Error While Getting Update Profile >>>", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

// LOGIN ROUTE

router.post('/auth/login', async (req, res) => {
    try {
        let foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser) {
            res.status(403).json({
                success: false,
                message: "Authentication failed, User not found"
            });
        }
        else {
            if (foundUser.comparePassword(req.body.password)) {
                let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
                    expiresIn: 604800 // 1 WEEK
                })

                res.json({
                    success: true,
                    token: token,
                    message: "Login Successfully"
                })
            }
            else {
                res.status(403).json({
                    success: false,
                    message: "Authentication failed, Wrong Password!"
                })
            }
        }
    } catch (error) {
        console.log("Error While Getting Login >>>", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

module.exports = router;




