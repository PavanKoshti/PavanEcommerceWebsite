const mongoose = require("mongoose");

module.exports = {
    connectDb: async () => {
        try {
            const connect = await mongoose.connect(process.env.DATABASE);
            console.log("Database Connected: ", connect.connection.host, connect.connection.name);
        } catch (error) {
            console.log(error);
            // process.exit(1);
        }
    }
}