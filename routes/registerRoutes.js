const express = require("express");
const router = express.Router();

//Home page
router.get("/", (req, res) => {
    res.render("index")
})

router.get("/register", (req, res) => {
    res.render("registration")
})

module.exports = router;