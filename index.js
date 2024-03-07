const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const multer = require("multer");
app.use("/uploads", express.static("uploads"));

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jmyw8mw.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const author = req.body.author;
  const title = req.body.pdf_name;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ author: author, title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send(data);
    });
  } catch (error) {}
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
