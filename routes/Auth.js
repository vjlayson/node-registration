const express = require("express");
const router = express.Router();
const regController = require("../controllers/authAccount");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req,file,callback) => {
        callback(null,path.join(__dirname,"../public/images"))
    },
    filename: (req,file,callback) => {
        callback(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage});
const imageUpload = upload.fields([{name: "image"}])

router.post("/register", imageUpload, regController.register);
router.post("/login", regController.login);
router.get("/updateform/:email", regController.updateForm);
router.post("/updateuser", regController.updateUser);
router.get("/deleteUser/:user_id", regController.deleteUser);



module.exports = router;