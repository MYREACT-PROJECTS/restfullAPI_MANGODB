const jwt = require('jsonwebtoken')

module.exports = async(req,res,next)=>{
   try{
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token,"admin")
    req.userData = decode
    next()
   } catch(e){
       return res.json({message : "auth for admin is error"})
   }
}