const express = require('express')
const app = express();
const cors = require('cors');
app.use(cors());
const bcrypt = require("bcryptjs");
require('dotenv').config()
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const port = 4000;

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}!`)
});


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>console.log('MongoDB connected...'))
        .catch(err => console.log(err));
    
 const Schema = mongoose.Schema;

 const pharmaSchema = new Schema({
    pharmacy: {type: String, required: true},
    drugName: {type: String, required: true},
    price: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true}
 })

 const Pharmacy = mongoose.model('Pharmacy', pharmaSchema);

 app.use(express.json());
 app.use(bodyParser.json());
 
 app.use(express.urlencoded({ extended: true }));


  let resObj = {};


app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/views/index.html')
});


  const createAndSavePharmacy = (req, res) => {
     const pharmacy = new Pharmacy({
     pharmacy: req.body.pharmaname,
     drugName: req.body.drugname,
     address:  req.body.address, 
     phone: req.body.phone,
     price: req.body.price
     })

     pharmacy.save((err, data) =>{
        if(err){
            console.log(err);
        }else{
            resObj['pharmacyName'] = data.pharmacy
            resObj['drugName'] = data.drugName;
            resObj['address'] = data.address;
            resObj['phone'] =  data.phone;
            resObj['price'] = data.price;
            res.json(resObj);
        }
     })
  }
  

  app.get('/api/pharmacy', (req, res) =>{
    Pharmacy.find()
            .select('pharmacy drugName price address phone')
            .exec((err, data) =>{
                if(!err){
                    res.json(data)
                }
            })
  });

  app.post('/api/users', (req, res) =>{
      createAndSavePharmacy(req, res);
  });
  
  // User registration
  require("./userdetails")


  const User = mongoose.model("UserInfo");
  app.post("/register", async(req, res)=>{
    const { fname, lname,  uname, password} = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try{
        const oldUser = await User.findOne({ uname });
        if (oldUser) {
            return res.json({ error: "User Exists" });
          }

       await User.create({
         fname,
         lname,
         uname,
         password:encryptedPassword,
         
       });
       res.send({ status: "ok" });
    }catch(error){
       res.send({ status: "error" });
    }

  });

  // Login Users
  app.post("/login-user", async(req, res)=>{
    const {uname, password } = req.body;
    const user = await User.findOne({uname});

    if (!user) {
        return res.json({ error: "User Not found" });
      }
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({uname: user.uname}, JWT_SECRET);
        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
          } else {
            return res.json({ error: "error" });
          }
          
      }
      res.json({ status: "error", error: "InvAlid Password" });
  });

  app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);
  
      const username = user.uname;
      User.findOne({uname: username })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });



  // Register pharmacy
   require("./pharmadetails")
  const Pharma = mongoose.model("PharmaDetails");

  const addPharma = (req, res) =>{
      const pharmacy = new Pharma({})
  } 
  app.post("/registerpharmacy",async (req, res) =>{
    const { pname, paddress, phone, uname, state} = req.body;
    try{
    //  const oldPharma = await User.findOne({ pname });
     // if (oldPharma) {
       //   return res.json({ error: "Pharma Exists" });
       // }
      // const pharmacy = new Pharma({})
     await Pharma.create({
       pname,
       paddress,
       phone,
       uname,
       state
      
     });
    
     res.send({ status: "ok" });
  }catch(error){
     res.send({ status: "error" });
  }
  })


  
// Get the list of pharmacies
  
app.get('/listpharmacies', (req, res) =>{
  Pharma.find()
          .select('pname paddress phone uname state')
          .exec((err, data) =>{
              if(!err){
                  res.json(data)
              }
          })
});







  app.post("/pharmaData", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);
  
      const username = user.uname;
      Pharma.findOne({uname: username })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });


  app.post("/multipharmaData", async (req, res) => {
    const { token, pname } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);
  
       const username = user.uname;
      Pharma.find({ uname: username })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });

  
/*
  app.post("/singlepharmaData", async (req, res) => {
    const { token, pname } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);
  
       const username = user.uname;
      Pharma.findOne({ pname })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });


*/

  app.get("/pharmalistuname", async (req, res)=>{
        try{
             Pharma.find()
             .select('uname')
             .exec((err, data) =>{
                 if(!err){
                    // res.json(data)
                    res.send({ status: "ok", data: data});
                 }
             })
         
         }catch(error){
          res.send({ status: "error" });
         }   

  })
  

  require("./userviews")
  const UserV = mongoose.model("Userviews");

  app.get("/userviews", async (req, res)=>{

    try{
      UserV.find()
      .select('username')
      .exec((err, data) =>{
          if(!err){
             // res.json(data)
             res.send({ status: "ok", data: data});
          }
      })
  
  }catch(error){
   res.send({ status: "error" });
  }
})

// Register drugs

  require("./drugdetails")
  const Drug = mongoose.model("DrugDetails");
  app.post("/registerdrug",async (req, res) =>{
    const {drugname, mg, uname, pricepercard, pricepercarton,
      priceperpack, pname, paddress, phone, alternativedrugname,
      alternativedrugprice, alternativedrugmg, time, drugcategory, expdate, othersCategory} = req.body;
    try{
      const userName = await Drug.findOne({ uname });
        const oldDrug = await Drug.findOne({ drugname });
       // if (oldDrug && userName) {
         //  return res.json({ error: "Product Exists" });
        // }
        const product = await Pharma.findOne({uname});
        if (!product) {
          return res.json({ error: "Pls Register Pharmacy" });
        }


       
     await Drug.create({
       drugname,
       mg,
       uname,
       pricepercard,
       pricepercarton,
       priceperpack,
       pname, 
       paddress, 
       phone,
       alternativedrugname,
       alternativedrugprice,
       alternativedrugmg,
       time,
       drugcategory,
       expdate,
       othersCategory
      
     });

     res.send({ status: "ok" });
  }catch(error){
     res.send({ status: "error" });
  }
  })
  
  // Editing drugs

  app.post("/editdrug", async (req, res)=>{
   
    const {id, drugname, mg, price, time} = req.body;

         try{
            Drug.findByIdAndUpdate(id, {drugname: drugname, mg:mg, price:price, time:time}, {new: true}, (error, data)=>{
            // if(error){
             //   console.log(error);
            // }else{
             // console.log('Updated');
            // } 
          })
          res.send({ status: "ok" });
         }catch(error){
          res.send({ status: "error" });
         }
       

  })
  

// Deleting drugs
app.post("/deletedrug", async (req, res)=>{
   
  const {id} = req.body;

       try{
          Drug.findByIdAndDelete(id, (error, data)=>{
          // if(error){
           //   console.log(error);
          // }else{
           // console.log('Updated');
          // } 
        })
        res.send({ status: "ok" });
       }catch(error){
        res.send({ status: "error" });
       }
     

})


// res.json({ status: "ok", data: token });

  app.post("/viewdrugs", async(req, res) =>{
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);
  
      const username = user.uname;
     await Drug.find({uname: username })
        .then((data) => {

          res.send({ status: "ok", data: data });

        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });

  app.post("/viewalldrugs", (req, res) =>{
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);
  
      const username = user.uname;
      Drug.find({uname: username })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });



  app.get('/viewalldrugs', (req, res) =>{
    Drug.find()
            .select('drugname mg pricepercard pricepercarton priceperpack pname paddress phone drugcategory expdate')
            .exec((err, data) =>{
                if(!err){
                    res.json(data)
                }
            })
  });

  /*
    app.get('/api/pharmacy', (req, res) =>{
    Pharmacy.find()
            .select('pharmacy drugName price address phone')
            .exec((err, data) =>{
                if(!err){
                    res.json(data)
                }
            })
  });
  */