const mongoose = require("mongoose");


const DrugDetailsScehma = new mongoose.Schema(
  {
    drugname: String,
    mg: { type: String, unique: false },
    uname: String,
    pricepercard: String,
    pricepercarton: String,
    priceperpack: String,
    pname: String,
    paddress: String, 
    phone: String,
    alternativedrugname: String,
    alternativedrugprice: String,
    alternativedrugmg: String,
    time: String,
    drugcategory: String,
    expdate: String,
    othersCategory: String
  },
  {
    collection: "DrugDetails",
  }
);

mongoose.model("DrugDetails", DrugDetailsScehma);