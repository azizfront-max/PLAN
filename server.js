console.log("Web server boshlash")
const express = require("express")
const app = express()
const http = require("http")
const fs = require("fs")
let user

fs.readFile("database/user.json",  "utf8", (err , data) => {
    if(err) {
        console.log("ERROR:", err)
    } else {
        user = JSON.parse(data)
    }
})

//1 - Kirish kodlar
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//2: Session


//3 - Views kodlar
app.set("views", "views")
app.set("view engine", "ejs")

//4 - Routing kodlar
app.post("/create-item", (req , res) => {
    console.log(req.body)
    res.json({test: "success"})
})

app.get("/author" , (req, res) => {
    res.render("author", {user: user})
})

app.get("/hello", function(req, res) {
    res.end(`<h1 style = "background: green" >Hello World</h1>`)
})
app.get("/gift", function(req, res) {
    res.end(`<h1 style = "background: green" >Siz sovg'alar bolimidasiz</h1>`)
})

app.get("/", function(req, res) {
    res.render(`project`)
})

app.get('/harid', function(req,res) {
    res.render('hariq')
})

const server = http.createServer(app)
let PORT = 3000;
server.listen(PORT, function(){
    console.log(`The server is running secessfully on port: ${PORT}`)
})