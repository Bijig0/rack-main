const mongoose = require("mongoose");

let mongoUrl = process.env.MONGODB_URL;

let options = {
    connectTimeoutMS: 10000,
    family: 4,
};

connect = () => {
    mongoose.connect(mongoUrl, options);
    mongoose.Promise = global.Promise;
    return mongoose.connection;
};

const mongodb = mongoose.connection;

// CONNECTION EVENTS

// When successfully connected
mongodb.on("connected", function () {
    console.log("Mongoose Connected");
});

// If the connection throws an error
mongodb.on("error", function (err) {
    console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongodb.on("disconnected", function () {
    console.log("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function () {
    mongodb
        .close()
        .then(() => {
            console.log(
                "Mongoose default connection disconnected through app termination"
            );
            process.exit(0);
        })
        .catch((err) => console.log("Error while closing Connection =>", err));
});

module.exports = {
    connect,
    mongoUrl,
};