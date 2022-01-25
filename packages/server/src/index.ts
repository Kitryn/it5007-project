import express from "express";
import path from "path";

const PORT = process.env.PORT ?? 5000;
const app = express();

app.use(express.static("build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Hello world listening on port ${PORT}`);
});
