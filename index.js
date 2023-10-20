const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://websakib07:VBhIcdXYTrBzNWYR@assignment10.oekdryf.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const products = client.db("productsDB").collection("products");

    app.get("/products", async (req, res) => {
      const cursor = products.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      console.log(brand);
      const query = { brand: brand };
      const result = await products.find(query).toArray();
      res.send(result);
    });

    app.get("/products1/:id", async (req, res) => {
      //   const brand = req.params.brand;
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });

    app.put("/products1/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          description: updateProduct.description,
          rating: updateProduct.rating,
          photo: updateProduct.photo,
        },
      };

      const result = await products.updateOne(filter, product, options);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newUser = req.body;
      const result = await products.insertOne(newUser);
      res.send(result);
    });

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
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Running at ${port}`);
});
