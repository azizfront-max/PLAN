console.log("Web server boshlash");
const express = require("express");
const mongodb = require("mongodb")

const fs = require("fs");
let user;

fs.readFile("database/user.json", "utf8", (err, data) => {
  if (err) {
    console.log("ERROR:", err);
  } else {
    user = JSON.parse(data);
  }
});

module.exports = function (db) {
  const app = express();

  //1 - Kirish kodlar
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //2: Session

  //3 - Views kodlar
  app.set("views", "views");
  app.set("view engine", "ejs");

  //4 - Routing kodlar
 app.post("/create-item", async (req, res) => {
    try {
        const new_plan = req.body.reja;
        if (!new_plan || new_plan.trim() === "") {
            return res.status(400).json({ error: "Поле пустое" });
        }

        const result = await db.collection("plans").insertOne({ reja: new_plan });

        res.json({
            _id: result.insertedId,
            reja: new_plan
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "New plan add ERROR" });
    }
});

app.post("/delete-all", async (req, res) => {
  try{
     if(req.body.delete_all) {
      const result = await db.collection("plans").deleteMany({})
      console.log("All cleaned:", result.deletedCount)
      res.json({state: "success", deletedCount: result.deletedCount})
     } else {
      res.status(400).json({error: "delete_all error"})
     }
  } catch(err) {
    console.log("delete all error:", err)
  }
})

  app.post("/delete-item", async (req, res) => {
    try {
        const id = req.body.id;
        console.log("Удаляем:", id);

        const result = await db.collection("plans").deleteOne({
            _id: new mongodb.ObjectId(id)
        });

        console.log("Удалено:", result.deletedCount);
        res.json({ state: "success", deletedCount: result.deletedCount });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Delete ERROR" });
    }
});

app.post("/edit-item", async (req, res) => {
try {
const {id, reja} = req.body
const result = await db.collection("plans").updateOne(
  { _id: new mongodb.ObjectId(id)},
  { $set: {reja: reja}}
)
console.log("Edited:", result.modifiedCount)
res.json({state: "success"})
} catch(err) {
console.log(err)
}
})

  app.get("/author", (req, res) => {
    res.render("author", { user: user });
  });

  app.get("/hello", function (req, res) {
    res.end(`<h1 style = "background: green" >Hello World</h1>`);
  });

  app.get("/gift", function (req, res) {
    res.end(`<h1 style = "background: green" >Siz sovg'alar bolimidasiz</h1>`);
  });

  // app.get("/", function(req, res) {
  //     res.render(`project`)
  // })

  app.get("/", async function (req, res) {
    try {
      const data = await db.collection("plans").find().toArray();
      console.log("Данных:", data.length);
      res.render("reja", { items: data });
    } catch (err) {
      console.log(err);
      res.end("Something went wrong");
    }
  });

  return app;
};
