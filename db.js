const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://ajay87891:Aj%40y1234@cluster0.yozyewx.mongodb.net/Ajay-notes"
// const mongoURI = "mongodb://localhost:27017/Ajay"
const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then(()=>console.log("Conneted to MongoDB")).catch(err=>console.log(err));
   
}
module.exports = connectToMongo;