const functions = require("firebase-functions");
const express =require("express")
const cors = require('cors')
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const AUTH = require('./authModel')
const bcrypt = require ('bcrypt');
//const { beforeSnapshotConstructor } = require("firebase-functions/lib/providers/firestore");
const jwt = require('jsonwebtoken')
const  user_check = require('./verify_user')
const admin_check = require('./verify_admin')
const AuthRouter = require('./authRouter')
const contactRouter = require('./contactRouter')
const CONTACTS = require ("./contactsModels")






const app = express()

mongoose.connect("mongodb+srv://koutaiba:koutaiba@cluster0.gxrkn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(() => console.log('DB Connection Successfull oh koutaiba'))
    .catch((err) => {
        console.error(err);
    });

app.use(cors({orgin:true}));
app.use(express.json())

app.use(bodyParser.json());



app.get('/contacts',user_check)
app.get('/contacts',async (request, response) => {
    const contacts = await CONTACTS.find()
        
          const data = contacts.map(res=>{
                return   {
                    id:res.id,
                    name:res.name,
                    phone:res.phone,
                }
            })
    
          //console.log("data",data)
    

        response.json({
            results:data
       })
 
})

 


app.use('/auth',AuthRouter)
app.post('/contacts',admin_check)
app.post("/contacts",async (request, response) => {
    const contacts = await new CONTACTS({
        name : request.headers.name,
        phone: request.headers.phone,

    }).save()

    response.json({
        message:"inserted Sucessfullt",
        id: contacts.id,
        name:contacts.name,
        phone:contacts.phone,
       

    })
})
//app.use('/contacts',contactRouter)
app.get("/users",async(request,response)=>{

    const auth = await AUTH.find()
            
              const data = auth.map(res=>{
                    return   {
                        id:res.id,
                        name:res.name,
                        email:res.email,
                        type:res.type,

                    }
                })
        
              //console.log("data",data)
        
    
            response.status(200).send({
                results:data
           })
     

})

////////////////////////////////////
app.get('/',(request,response)=>response.status(200).send("Hello world"))
 exports.api1 = functions.https.onRequest(app)
