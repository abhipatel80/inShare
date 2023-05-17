const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/FileSharing').then(()=>{
    console.log("Database Connected");
}).catch(()=>{
    console.log("Connection Failed");
})
 