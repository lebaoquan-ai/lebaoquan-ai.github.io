const express = require("express");
const path = require("path");
const { build } = require("./build");

const app = express();
const PORT = process.env.PORT || 3000;

// Build the site first
build();

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, "../dist")));

// Serve all routes as the index.html (SPA-like behavior)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, "../dist")}`);
});
