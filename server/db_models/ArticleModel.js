const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  unique_key:{
  type:String,
  default:'codersnexus@gmail.comno title',
  require:true
  },
  email:{
    type:String,
    default:"codersnexus@gmail.com",
    required:true
  },
  author:
  {
    type:String,
    default:"tourist",
    require:true
  },
  title:{
    type:String,
    default:"DP",
    required:true
  },
  ops_array: {
    type: [{}], //here data type will be array of mixed,this requires extra step while saving as it won't detect changes automotically
    default: [{ insert: "\n" }],
    required:true
  },
  article_html: {
    type: String,
    default: "<p><br/></p>",
    required:true
  },
  review_status:{
    type:Number,
    default: 0,//0 means not under review, 1 means under review,2 means published,-1 means rejected
    required:true
  }
});

const ArticlesData = mongoose.model("article", articleSchema);//naming convention for mongodb collections is camelCase so first letter will by default become small even if we write capital here

module.exports = ArticlesData;