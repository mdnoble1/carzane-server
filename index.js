const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.crviidq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandsCollection = client.db("carzane").collection("brands");
    const productsCollection = client.db("carzane").collection("products");
    const adsCollection = client.db("carzane").collection("ads");

    app.get("/brands", async (req, res) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    



    app.get("/products/:id" , async(req , res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    // app.get("/products/:id" , async(req , res) => {
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)};
    //   const result = await productsCollection.findOne(query);
    //   res.send(result);
    // })


    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.put("/products/:id" , async(req ,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert : true };
      const updatedProduct = req.body;
      const product = {
        $set: {

          productName: updatedProduct.productName,
          brandName: updatedProduct.brandName,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          description: updatedProduct.description
        }
      }

      const result = await productsCollection.updateOne(filter , product , options);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("CARZANE server is running");
});

app.listen(port, () => {
  console.log(`CARZANE server running on ${port}`);
});
