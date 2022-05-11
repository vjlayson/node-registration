//import modules express, sql, dotenv
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

// port 3000, host name: localhost
const port = 3000;
const hostName = "localhost";

//create instance, save to variable app
const app = express();

//make connection to database, save to db variable using mysql module
dotenv.config({path: "./.env"})
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE,
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/public",express.static(path.join(__dirname, "/public")))
app.set("view engine", "hbs");
app.use("/", require("./routes/registerRoutes"));
app.use("/auth", require("./routes/Auth"));
app.listen(port, hostName, () => {
    console.log("Server started");
    db.connect((err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("db connected");
        }
    });
});