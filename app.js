const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine","ejs");

let items = [];

app.get("/", function(req,res){
    var today = new Date();
    var currentDay = today.toLocaleDateString('en-US', { weekday: 'long' , day: 'numeric', month: 'long'});
    var day = "";

    if(currentDay === 6 || currentDay === 0){
        day  = currentDay;

    }else{
        day = currentDay;
    }

    res.render("list",{day: day,newItem : items});
});

app.post("/", function(req,res){
    let item = req.body.add;

    items.push(item);
    res.redirect("/");
    
})

app.listen(3000 , function(){
    console.log("Server is running on 3000");
})