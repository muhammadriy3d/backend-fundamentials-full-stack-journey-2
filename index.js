const { time } = require("console");
const fs = require("fs");

const DEFAULT_STATUS = "todo";

const args = process.argv.slice(2);

let todoList = [];

function initializeDB() {
  const data = fs.readFileSync("db/data.json", "utf8", (err, data) => {
    if (err) {
      if (err.code !== "ENOENT") {
        console.error("Could not read todos:", err);
        return;
      }

      fs.mkdir("db", { recursive: true }, (mkdirErr) => {
        if (mkdirErr) {
          console.error("Could not create db directory:", mkdirErr);
          return;
        }

        fs.writeFile("db/data.json", "[]", "utf8", (writeErr) => {
          if (writeErr) {
            console.error("Could not initialize todo file:", writeErr);
            return;
          }

          console.log("Initialized db/data.json");
        });
      });

      return data;
    }
  });

  todoList = JSON.parse(data);
}

initializeDB();

function readFile(callback) {
  fs.readFile("db/data.json", "utf8", (err, data) => {
    if (err) {
      return callback(err);
    }

    try {
      callback(null, JSON.parse(data));
    } catch (parseError) {
      callback(parseError);
    }
  });
}

function writeFile(todos, callback) {
  const data = JSON.stringify(todos, null, 2);

  fs.writeFile("db/data.json", data, "utf8", (err) => {
    if (err) {
      return callback(err);
    }

    callback(null);
  });
}

// add
if (args[0] === "add") {
  if (args.length >= 2) {
    const currentArgs = args.slice(1, args.length);
    currentArgs.forEach((value) => {
      const item = {
        id: todoList.length + 1,
        description: value,
        status: DEFAULT_STATUS,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      todoList.push(item);
    });

    writeFile(todoList, (err) => {
      if (err) {
        console.error("Could not save todos:", err);
        return;
      }

      console.log("Items have been added to your list!");
    });
  }
}

//
// update
if (args[0] === "update") {
  const id = Number(args[1]);
  const index = todoList.findIndex((item) => item.id === id);

  if (index === -1) return console.log("Cannot find an item!");

  todoList[index].description = args[2];
  todoList[index].updatedAt = new Date();

  writeFile(todoList, (err) => {
    if (err) {
      console.error("Could not save todos:", err);
      return;
    }

    console.log(`An item with this id '${id}' has been updated successfully!`);
  });
  return;
}

// delete
//
if (args[0] === "delete") {
  const id = Number(args[1]);
  const index = todoList.findIndex((item) => item.id === id);

  if (index === -1) return console.log("Cannot find an item!");

  todoList.splice(index, 1);

  writeFile(todoList, (err) => {
    if (err) {
      console.error("Could not save todos:", err);
      return;
    }

    console.log(`Item with following id: ${id} has been deleted!`);
  });

  return;
}

// mark-in-progress
if (args[0] === "mark-in-progress") {
  const id = Number(args[1]);
  const index = todoList.findIndex((item) => item.id === id);

  if (index === -1) return console.log("Cannot find an item!");

  todoList[index].status = "in-progress";

  writeFile(todoList, (err) => {
    if (err) {
      console.error("Could not save todos:", err);
      return;
    }

    console.log(
      `"${id}: ${todoList[index].description}" updated to in-progress!`,
    );
  });
}

// mark-done
if (args[0] === "mark-done") {
  const id = Number(args[1]);
  const index = todoList.findIndex((item) => item.id === id);

  if (index === -1) {
    return console.log(`Cannot find an item!`);
  }

  todoList[index].status = "mark-done";

  writeFile(todoList, (err) => {
    if (err) {
      console.error("Could not save todos:", err);
      return;
    }

    console.log(
      `"${id}: ${todoList[index].description}" Has been completed! Enjoy your coffee :).`,
    );
  });
}

// list
//  Done
//  In-Progress
//  todo

// if we were in runtime we should think of this differently s
if (args[0] === "list") {
  if (todoList.length - 1 <= 0) {
    console.log("YAY! You have nothing todo today! Get a coffe :)");
  }

  switch (args[1]) {
    case "done":
      todoList.forEach((value, index) => {
        if (value.status !== "done") return;
        console.log(value);
      });
      break;
    case "in-progress":
      for (let i = 0; i <= todoList.length - 1; i++) {
        if (todoList[i].status === "in-progress") {
          console.log(todoList[i]);
        }
      }
      break;
    case "todo":
      todoList.forEach((value, index) => {
        if (value.status === "todo") {
          console.log(todoList[index]);
        }
        return;
      });
      break;
    default:
      todoList.forEach((value, index) => {
        if (value.status === "todo") {
          console.log(todoList[index]);
        }
        return;
      });
      break;
  }
}
