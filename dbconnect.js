const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
//const  url  =  "mongodb://localhost:27017/chat1";
const  url  =  "mongodb+srv://chatuser:ch4at3us7er@cluster0-9wsys.mongodb.net/chat?retryWrites=true&w=majority";

const  connect  =  mongoose.connect(url, { useNewUrlParser: true, 
                                           useUnifiedTopology: true  
                                    });
module.exports  =  connect;