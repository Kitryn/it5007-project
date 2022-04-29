import shell from "shelljs";
import path from "path";

const buildFolder = "./dist";
const srcFolder = "./src";
const folders = new Set(["./models/sql"]);

folders.forEach((folder) => {
  const fullPath = path.resolve(srcFolder, folder);
  const fullDest = path.resolve(buildFolder, folder);
  shell.mkdir("-p", fullDest);
  shell.cp("-R", `${fullPath}/*.sql`, fullDest);
});
