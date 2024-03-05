const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const multer = require("multer");

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jmyw8mw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ".files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allpdfsCollection = client.db("StudyMaterials").collection("allpdfs");
    app.get("/allpdfs", async (req, res) => {
      const result = await allpdfsCollection.find().toArray();
      res.send(result);
    });
    // app.post("/allpdfs", upload.single("file"), async (req, res) => {
    //   console.log(req.file);
    //   const title = req.body.title;
    //   const fileName = req.file.filename;
    //   try {
    //     await PdfSchema.create({ title: title, pdf: fileName });
    //     res.send({ status: "ok" });
    //   } catch (error) {
    //     res.json({ status: error });
    //   }
    // });

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
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
