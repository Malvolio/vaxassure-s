import express = require("express");
import fileUpload = require("express-fileupload");
import cors = require("cors");

const app = express();

// default options
app.use(fileUpload());
const corsOptions = {
  origin: "http://localhost:8000",
};
app.post("/upload", cors(corsOptions), (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const headshot = req.files.headshot;
  console.log(Object.keys(req.files));
  console.log(req.files.notes?.data.toString());
  // Use the mv() method to place the file somewhere on your server
  headshot.mv("./headshot.unk", (err: unknown) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("File uploaded!");
    }
  });
});

app.listen(8001, () => {
  console.log(`upload app listening at http://localhost:8001`);
});
