//App.js

const express = require("express");
const stockRouters = require("./routers/stocks");
require("./mongoose/db/mongoose");

//setting up the app express server
const app = express();

//setting up the middlewares
app.use(express.json());
app.use(stockRouters);

module.exports = app;

//Routers/stocks.js

const express = require("express");
const Commodities = require("../mongoose/models/stocks");

//setting up the express router
const stockRouters = express.Router();

//setting up a get route
stockRouters.get("/fetch", async (req, res) => {
  try {
    if(req.query.params === "get") {
      const items = await Commodities.find();
      res.send(items);
    }
    else if (req.query.params === "expired") {
      const items = await Commodities.find({isExpired: true});
      res.send(items)
    }
    else if (req.query.params === "search") {
      const items = await Commodities.find();
      const search = items.find(item => (item.name === req.body.name))
      res.send(search)
    }
  } 
  catch (e) {
    res.status(400).send({ error: e.message} );
  }
});

//setting up a update route
stockRouters.patch("/updateItem/:id", async (req, res) => {
  try {
    const items = await Commodities.findById(req.params.id);
    await items.updateOne({quantity: req.body.quantity + items.quantity})
    res.send({"message": "Item updated successfully"})
  }
  catch (e) {
    res.status(400).send({ error: e.message })
  }
});

//setting up a delete route 
stockRouters.delete("/delete/:id", async (req , res) => {
  try {
    await Commodities.deleteOne({_id : req.params.id});
    res.send({"message": "Item deleted successfully"})
  }
  catch {
    res.status(400).send({ error: e.message })
  }
})

module.exports = stockRouters;


//Model/stocks.js

const mongoose = require("mongoose");

const stocksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    isExpired: {
        type: Boolean,
        required: true
    }
});

//setting up the model
const Stocks = mongoose.model("Stocks", stocksSchema);

//exporting the model
module.exports = Stocks;

//testDB.js

const Stocks = require("../../src/mongoose/models/stocks");
const mongoose = require("mongoose")
require("../../src/mongoose/db/mongoose");

const items = [
    {
        _id: new mongoose.Types.ObjectId,
        name: "Rice",
        mrp: 45,
        quantity: 5,
        gst: 11,
        expiry: 12-10-2023,
        isExpired: false
    },
    {
        _id: new mongoose.Types.ObjectId,
        name: "Noodles",
        mrp: 90,
        quantity: 8,
        gst: 18,
        expiry: 3-1-2021,
        isExpired: true
    },
    {
        _id: new mongoose.Types.ObjectId,
        name: "Sugar",
        mrp: 50,
        quantity: 5,
        gst: 8,
        expiry: 7-5-2021,
        isExpired: true
    },
    {
        _id: new  mongoose.Types.ObjectId,
        name: "Soap",
        mrp: 38,
        quantity: 4,
        gst: 14,
        expiry: 29-6-2022,
        isExpired: false
    },
    {
        _id:  new mongoose.Types.ObjectId,
        name: "Shampoo",
        mrp: 120,
        quantity: 7,
        gst: 17,
        expiry: 11-11-2023,
        isExpired: false
    },
    {
        _id: new  mongoose.Types.ObjectId,
        name: "Oil",
        mrp: 210,
        quantity: 4,
        gst: 10,
        expiry: 6-12-2022,
        isExpired: false
    },
    {
        _id:  new mongoose.Types.ObjectId,
        name: "Ragi",
        mrp: 6,
        quantity: 10,
        gst: 3,
        expiry: 22-9-2024,
        isExpired: false
    },
    {
        _id: new  mongoose.Types.ObjectId,
        name: "Chocolates",
        mrp: 20,
        quantity: 5,
        gst: 12,
        expiry: 8-4-2022,
        isExpired: false
    },
    {
        _id:  new mongoose.Types.ObjectId,
        name: "Ice Cream",
        mrp: 60,
        quantity: 10,
        gst: 10,
        expiry: 23-12-2021,
        isExpired: false
    },
    {
        _id: new  mongoose.Types.ObjectId,
        name: "Dhal",
        mrp: 120,
        quantity: 7,
        gst: 10,
        expiry: 24-2-2025,
        isExpired: false
    },
    {
        _id:  new mongoose.Types.ObjectId,
        name: "Biscuits",
        mrp: 80,
        quantity: 8,
        gst: 4,
        expiry: 30-3-2024,
        isExpired: false
    },
    {
        _id: new  mongoose.Types.ObjectId,
        name: "Chips",
        mrp: 140,
        quantity: 5,
        gst: 6,
        expiry: 10-12-2022,
        isExpired: false
    }
]

const setUpDatabase = async () => {
  await Stocks.deleteMany();
  items.forEach(async (item) => {
    await new Stocks(item).save();
  });
}

module.exports = {
  items,
  setUpDatabase
}


//Stocks Test.js

const request = require("supertest");
const app = require("../src/app");
const Commodities = require("../src/mongoose/models/stocks");
const {
  setUpDatabase,
  items,
} = require("./utils/testDB");

beforeEach(setUpDatabase);

//user getting all the stock
test("Viewing all the stock", async () => {
  const response = await request(app).get("/fetch?params=get").expect(200);
  expect(response.body.length).toBe(12);
  for(let i = 0; i <= 11 ; i++ ){
    expect(response.body[i].name).toBe(items[i].name)
    expect(response.body[i].mrp).toBe(items[i].mrp)
    expect(response.body[i].quantity).toBe(items[i].quantity)
    expect(response.body[i].gst).toBe(items[i].gst)
    expect(response.body[i].isExpired).toBe(items[i].isExpired)
  }
});

//user getting all the expired stock
test("Viewing all the expired stock", async () => {
  const response = await request(app).get("/fetch?params=expired").expect(200);
  expect(response.body.length).toBe(2);
  for(let i = 0; i <= 11 ; i++ ){
    if(items.isExpired) {
      expect(response.body[i].name).toBe(items[i].name)
      expect(response.body[i].mrp).toBe(items[i].mrp)
      expect(response.body[i].quantity).toBe(items[i].quantity)
      expect(response.body[i].gst).toBe(items[i].gst)
      expect(response.body[i].isExpired).toBe(items[i].isExpired)
    }
  }
});

//user updating a stock 
test("update a stock", async () => {
  const response = await request(app).patch(`/updateItem/${items[0]._id}`).send({    
    quantity: 30
  });
  expect(JSON.stringify(response.body)).toBe(JSON.stringify({"message":"Item updated successfully"}));
});


//user search for stock
test("search for stock", async () => {
  const response = await request(app).get("/fetch?params=search").send({name: "Shampoo"});
  console.log("data",response.body);
  expect(response.body.name).toBe(items[4].name);
  expect(response.body.mrp).toBe(items[4].mrp);
  expect(response.body.quantity).toBe(items[4].quantity);
  expect(response.body.gst).toBe(items[4].gst);
  expect(response.body.isExpired).toBe(items[4].isExpired);
});

//user deleteing a stock
test("deleting a stock", async () => {
  const response = await request(app).delete(`/delete/${items[1]._id}`).expect(200);
  const data = await Commodities.find()
  expect(data.length).toBe(11)
  expect(JSON.stringify(response.body)).toBe(JSON.stringify({"message":"Item deleted successfully"}));
});


