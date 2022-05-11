const async = require("hbs/lib/async");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

//make connection to database, save to db variable using mysql module
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE,
});

exports.register = (req, res) => {
    // console.log(req.body);
    // res.send("Form submitted");

    //save variables body, eg. first name. req.body
    // const firstName = req.body.first_name
    // const lastName = req.body.last_name
    // const email = req.body.email
    // const password = req.body.password
    // const confirmPassword = req.body.confirm_password

    //Destructure object
    const {first_name, last_name, email, password, confirm_password} = req.body;
    
    const image = req.files.image[0]
    const imagepath = req.protocol + "://" + req.get("host") + "/public/images/" + image.filename

    console.log(imagepath)

    // Validations
    db.query(
        "SELECT * From registered_users Where email = ?",
        email,
        async (err, result) => {

            if(err){
                return console.log(err.message);
            }

            if(result.length > 0){
                return res.render("registration",{message: "Email is already in use"})
            }

            if(password != confirm_password){
                return res.render("registration",{message: "Password and confirm password does not match"})
            }

            const hashPassword = await bcrypt.hash(password, 8) //8x encryption

            db.query(
                "INSERT INTO registered_users SET ?  ",
                {
                    first_name: first_name, 
                    last_name: last_name, 
                    email: email, 
                    password: hashPassword
                },
                (err) => {
                    if(err){
                        return console.log(err.message)
                    }
                    return res.render("registration", {message: "You have registered successfully"})
                }
            )
        }
    )
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).render("index",{message: "Provide email and password"}) //400 means bad request
        }

        db.query(
            "Select * From registered_users Where email = ?",
            email,
            async (err, result) => {
                if(!result.length || !(await bcrypt.compare(password, result[0].password))){
                    console.log(result);
                    return res.status(401).render("index",{message: "Email or Password is Incorrect"}) //401 means unauthorized
                }
                db.query(
                    "Select * From registered_users", 
                    (err,result) => {
                        if(err){
                            return console.log(err.message);
                        }
                        return res.status(200).render("list", {users: result}) //200 means okay
                    }
                )
            }     
        )
    }
    catch(err){
        console.log(error.message)
    }
}

//Update form
exports.updateForm = (req, res) => {
    const email = req.params.email;
    console.log(req.params.email);
    db.query(
        "Select * from registered_users Where email = ?",
        email,
        (err, result) => {
            if(err){
                return console.log(err.message)
            }
            return res.render("updateForm", {user: result[0], title: "edituser"})
        }
    )
}

exports.updateUser = (req, res) => {
    // update first name, last name, identifier email
    //destructure
    const {first_name, last_name, email} = req.body;
    db.query(
        "UPDATE registered_users SET first_name = ?, last_name = ? WHERE email = ?",
        [first_name, last_name, email],
        (err, result) => {
            if(err){
                return console.log(err.message)
            }
            db.query(
                "SELECT * from registered_users",
                (err, result) => {
                    return res.status(200).render("list",{users: result, message: "Record has been updated"})
                }
            )
        }
    )
}

exports.deleteUser = (req, res) => {
    const user_id = req.params.user_id
    db.query(
        "DELETE FROM registered_users WHERE user_id = ?",
        user_id,
        (err) => {
            if(err){
                return console.log(err.message)
            }
            db.query(
                "SELECT * from registered_users",
                (err, result) => {
                    return res.status(200).render("list",{users: result, message: "User has been deleted"})
                }
            )
        }
    )
}

