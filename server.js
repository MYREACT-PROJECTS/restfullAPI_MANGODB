const express = require('express');
const bodyParser = require('body-parser');
const { initDB } = require('./db');
const mongoose= require('mongoose');
const CONTACTS = require ("./contactsModels")
const AuthRouter = require('./authRouter')
const AUTH = require('./authModel')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt');
const  user_check = require('./verify_user')
const admin_check = require('./verify_admin')
const router= express.Router()


const app = express();
mongoose.connect("mongodb+srv://koutaiba:koutaiba@cluster0.gxrkn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(() => console.log('DB Connection Successfull'))
    .catch((err) => {
        console.error(err);
    });

app.use(bodyParser.json());

const db = initDB();

app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({"error": err.message});
        } else {
            res.json({users: rows})
        }
    });
});

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    db.all("SELECT * FROM users where id is (?)", [id], (err, rows) => {
        if (err) {
            res.status(500).json({"error": err.message});
        } else if (rows.length === 0) {
            res.json({user: {}})
        } else {
            res.json({user: rows[0]})
        }
    })
});

app.post("/users", (req, res) => {
    const { user: { username, password} } = req.body;
    const insertStmt = "INSERT INTO users(username,password) VALUES (?,?)";
    db.run(insertStmt, [username, password], function(err, result) {
        if (err) {
            res.status(500).json({ "error": err.message });
        } else {
            res.json({
                id: this.lastID,
                username,
                password
            })
        }
    })
});
app.post('/login',async(req,res)=>{
    const user = await AUTH.find({"email": req.headers.email})
    if(user < 1) {
        return res.json({message: "email not found"})
            }
            else{
                bcrypt.compare(req.headers.password,user[0].password, async(err,result)=>{
                    if (err){
                        res.json({
                            password:"you entred wrong password please try again "
                        })
                    }
                    if (result){
                        if(user[0].type==0){
                            const token=jwt.sign({email:user[0].email,name:user[0].name},"user")
                            return res.json({
                                message:"user has login successfully",
                                password:user[0].password,
                                type:user[0].type,
                                email:user[0].email,
                                token:token,
                                
                            })
                        }
                        else{
                            const token=jwt.sign({email:user[0].email,name:user[0].name},"admin")
                            return res.json({
                                message:"admin has login successfully",
                                type:user[0].type,
                                email:user[0].email,
                                token:token,
                                password:user[0].password,

                            })
                        }
                    }
                })
            }
})


app.post('/signup',async (req,res)=>{
    const user =  await AUTH.find({email:req.headers.email}) 
    if (user.length >= 1){
        return res.json({message: "this email is existed "})
    }
     
              else {
                  bcrypt.hash(req.headers.password,15,async(err,hash)=>{
                   if (err){
                       return res.json({message: error in password})
                   } else {
                    const auth = await new AUTH ({
                    name:req.headers.name,
                    email:req.headers.email,
                    password:hash,
                    type:req.headers.type

                }).save();

                res.json({
                    message:"create user successfully",
                    email:auth.email,
                    password:auth.password,
                    type:auth.type

                })
            }
         })
    }  

 })
                  
app.post("/contacts",admin_check)         
app.post("/contacts",async (req, res) => {
    const contacts = await new CONTACTS({
        name : req.headers.name,
        phone: req.headers.phone,

    }).save()

    res.json({
        message:"inserted Sucessfullt",
        id: contacts.id,
        name:contacts.name,
        phone:contacts.phone,
       

    })
});
app.get("/contacts",user_check)
app.get("/contacts",async (req, res) => {
     
    const contacts = await CONTACTS.find()
    res.json({
        result: contacts.map(res=>{
            return {
                id:res.id,
                name:res.name,
                phone:res.phone,
            }
        })
    })
   //res.send("hello world")

    //const contacts = await CONTACTS.find()
        
});

app.listen(30000, () => console.log("Simple server running on http://localhost:4000"))
