const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoDB");

const listSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", listSchema);

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
  Item.find({}).then((foundItem) => {
    if (foundItem.length === 0) {
      //   Item.insertMany(defaultItems);
      //   res.redirect("/");
      res.render("list", { ListTitle: "Today", newItem: [] });
    } else {
      res.render("list", { ListTitle: "Today", newItem: foundItem });
    }
  });
});

app.post("/", function (req, res) {
  let itemName = req.body.add;

  const item = new Item({
    name: itemName,
  });

  item.save();

  res.redirect("/");
});

// for deleting the item from list

app.post("/delete", function (req, res) {
  // let itemName = req.body.add;

  const itemId = req.body.checkbox;

  Item.findByIdAndDelete(itemId).then(() => {
    console.log("Item deleted");
  });

  res.redirect("/");

  // const item = new Item({
  //   name: itemName,
  // });

  // item.deleteOne();
});

app.get("/work", function (req, res) {
  res.render("list", { ListTitle: "Work List", newItem: workItems });
});

app.listen(3000, function () {
  console.log("Server is running on 3000");
});
