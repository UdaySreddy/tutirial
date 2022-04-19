let express = require("express");
let sqlite = require("sqlite");
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let app = express();
app.use(express.json());
let dataBase = path.join(__dirname, "todoApplication.db");
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

app.get("/todos/", async (request, response) => {
  let { search_q = "", status, priority } = request.query;
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
    query1 = `select * from todo 
    where todo like "%${search_q}%";`;
  }
  let result = await db.all(query1);
  response.send(result);
});

//get todo based on ID
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let query2 = `select * from todo where
    id = ${todoId};`;
  let result = await db.get(query2);
  response.send(result);
});

//create todo

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  let query3 = `insert into todo (id,todo,priority,status)
    values(${id},"${todo}","${priority}","${status}");`;
  await db.run(query3);
  response.send("Todo Successfully Added");
});

// put todo

app.put("/todos/:todoId/", async (request, response) => {
  let query4 = null;
  const { todoId } = request.params;
  const { id, todo, priority, status } = request.body;
  if (todo !== undefined) {
    query4 = `update todo set 
        todo = "${todo}" where
        id =${todoId};`;
    await db.run(query4);
    response.send("Todo Updated");
  } else if (priority !== undefined) {
    query4 = `update todo set 
        priority ="${priority}" where
        id =${todoId};`;
    await db.run(query4);
    response.send("Priority Updated");
  } else {
    query4 = `update todo set 
       status ="${status}" where
        id =${todoId};`;
    await db.run(query4);
    response.send("Status Updated");
  }
});

//delete todo
app.delete("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let query5 = `delete from todo where
    id = ${todoId};`;
  await db.run(query5);
  response.send("Todo Deleted");
});

module.exports = app;
