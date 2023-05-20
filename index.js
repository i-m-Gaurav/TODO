const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-gaurav:gaurav123@cluster0.hozaezv.mongodb.net/todoDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

const itemSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Buy Food",
});
const item2 = new Item({
  name: "Cook Food",
});
const item3 = new Item({
  name: "Eat Food",
});

const defaultItems = [item1];

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  Item.find({})
    .then((foundItem) => {
      if (foundItem.length === 0) {
        res.render("list", { ListTitle: "Today", newItem: [] });
      } else {
        res.render("list", { ListTitle: "Today", newItem: foundItem });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        console.log("Doesn't exist");
        const list1 = new List({
          name: customListName,
          items: []
        });

        return list1.save().then(() => {
          res.redirect("/" + customListName);
        });
      } else {
        console.log("Exists");
        res.render("list", {
          ListTitle: foundList.name,
          newItem: foundList.items
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});



app.post("/", function (req, res) {
  let itemName = req.body.add;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save()
      .then(() => {
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    List.findOne({ name: listName })
      .then((foundList) => {
        foundList.items.push(item);
        foundList.save()
          .then(() => {
            res.redirect("/" + listName);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

// for deleting the item from list

app.post("/delete", function (req, res) {
  const itemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(itemId)
      .then(() => {
        console.log("Item deleted");
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      }
      )}

      else {
        List.findOne({ name: listName })
          .then((foundList) => {
            foundList.items.pull({ _id: itemId });
            foundList.save()
              .then(() => {
                res.redirect("/" + listName);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
    
    app.listen(3000, function () {
      console.log("Server is running on 3000");
    });
    
  
     
      