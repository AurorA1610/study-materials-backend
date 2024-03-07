const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
  {
    author: String,
    pdf: String,
    title: String,
  },
  { collection: "PdfDetails" }
);

mongoose.model("PdfDetails", PdfDetailsSchema);
