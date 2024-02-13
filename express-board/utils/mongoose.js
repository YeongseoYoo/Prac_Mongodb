const express = require('express');

const mongoose = require('mongoose');

const MONGO_URL = "mongodb+srv://admin:admin1234@yscluster.y1tyjoy.mongodb.net";
console.log("MONGO_URL: "+MONGO_URL);
mongoose
 .connect(
    MONGO_URL, {
        useUnifiedTopology: true, useNewUrlParser: true
    }
 )
 .then(()=>console.log("Connected Successful"))
 .catch(err=>console.log(err));
module.exports = mongoose;