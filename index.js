const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server side of car-house");
});
app.get("/checkingroute", (req, res) => {
  res.send("working fine");
});

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsdfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();

    const carsCollection = client.db("car-house").collection("cars");
    const ordersCollection = client.db("car-house").collection("orders");
    const usersCollection = client.db("car-house").collection("users");
    const reviewsCollection = client.db("car-house").collection("reviews");

    //get methods
    app.get("/cars", async (req, res) => {
      const result = await carsCollection.find({}).toArray();
      res.json(result);
    });
    app.get("/car/:id", async (req, res) => {
      const result = await carsCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
    app.get("/myorder", async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.query.email })
        .toArray();
      res.json(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find({}).toArray();
      res.json(result);
    });
    app.get("/user/:email", async (req, res) => {
      const result = await usersCollection.findOne({ email: req.params.email });
      res.json(result);
    });

    app.get("/allorders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.json(result);
    });

    // post methods
    app.post("/order", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.json(result);
    });
    app.post("/adduser", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      res.json(result);
    });
    app.post("/review", async (req, res) => {
      const result = await reviewsCollection.insertOne(req.body);
      res.json(result);
    });
    app.post("/addcar", async (req, res) => {
      const result = await carsCollection.insertOne(req.body);
      res.json(result);
    });

    //delete methods
    app.delete("/deleteorder/:id", async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
    app.delete("/deleteorder", async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.body.id),
      });
      res.json(result);
    });
    app.delete("/deletecar", async (req, res) => {
      const result = await carsCollection.deleteOne({
        _id: ObjectId(req.body.id),
      });
      res.json(result);
    });

    //put methods
    app.put("/makeAdmin", async (req, res) => {
      const user = req.body;
      const updateDoc = { $set: { role: "admin" } };
      const filter = { email: user.email };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    app.put("/confirmOrder", async (req, res) => {
      const id = req.body.id;
      const updateDoc = { $set: { status: "Confirmed" } };
      const filter = { _id: ObjectId(id) };

      const result = await ordersCollection.updateOne(filter, updateDoc);

      res.json(result);
    });
  } catch {
    //   await client.close()
  }
}
run().catch(console.dir);

app.listen(PORT, () => {});
