const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 80;

var serveIndex = require("serve-index");

app.use(express.static(path.resolve(__dirname, "build")));
app.use("/build", serveIndex(path.resolve(__dirname, "build")));

// Route to handle file downloads with specific links
app.get("/build/:folder1/:folder2/:filename", (req, res) => {
  const { folder1, folder2, filename } = req.params;
  const filePath = path.join(__dirname, "build", folder1, folder2, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
