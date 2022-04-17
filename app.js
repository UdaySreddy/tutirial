let express = require("express");
let sqlite = require("sqlite");
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let app = express();
app.use(express.json());
let dataBase = path.join(__dirname, "cricketMatchDetails.db");
let db = null;
let dbinitialize = async () => {
  try {
    db = await open({
      filename: dataBase,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server http://localhost:3000  is running");
    });
  } catch (error) {
    console.log(`server error:${error.message}`);
    process.exit(1);
  }
};
dbinitialize();

app.get("/todo", async (request, response) => {
  let { status, priority } = request.query;
  let query1 = null;
  if (status !== undefined && priority !== undefined) {
    query1 = `select * from todo where
    status = "${status}" and
    priority="${priority}";`;
  } else if (status === undefined && priority !== undefined) {
    query1 = `select * from todo where
     priority="${priority}";`;
  } else if (status !== undefined && priority === undefined) {
    query1 = `select * from todo where
    status = "${status}";`;
  } else {
    query1 = `select * from todo;`;
  }
  let result = await db.all(query1);
  response.send(result);
});
