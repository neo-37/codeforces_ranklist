const mongoose = require("mongoose");

const publisedArticleSchema = new mongoose.Schema({
  linking_key:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article'
  },
  unique_key:{
  type:String,
  default:'codersnexus@gmail.comno title',
  require:true
  },
  title:{
    type:String,
    default:"DP",
    required:true
  },
  ops_array:{
    type: [{}], //here data type will be array of mixed,this requires extra step while saving as it won't detect changes automotically
    default: [{ insert: "\n" }],
    required:true
  },
  article_html: {
    type: String,
    default: "<p><br/></p>",
    required:true
  }
});

const PublishedArticlesData = mongoose.model("publishedarticle", publisedArticleSchema);//naming convention for mongodb collections is camelCase so first letter will by default become small even if we write capital here

module.exports = PublishedArticlesData;