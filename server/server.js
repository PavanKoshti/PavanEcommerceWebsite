const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { connectDb } = require('./config/dbConnection')
const dotenv = require('dotenv')
const cors = require('cors')
const User = require('./models/user')

dotenv.config();

const app = express();
connectDb();

// Middlewares
app.use(cors())
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET Images To Front-end

 app.use(express.static('uploadsImages'));

// require apis

const productRoutes = require("./routes/product")
app.use("/api", productRoutes)

const categoryRoutes = require("./routes/category")
app.use("/api", categoryRoutes)

const ownerRoutes = require("./routes/owner")
app.use("/api", ownerRoutes)

const userRoutes = require("./routes/auth")
app.use("/api", userRoutes)

const reviewRoutes = require('./routes/review')
app.use("/api", reviewRoutes)

const addresRoutes = require('./routes/address')
app.use("/api", addresRoutes)

app.listen(4700, (err) => {
    if (err) {
        console.log("err", err);
    }
    else {
        console.log("Server is Listening on Port 4700");
    }
})

