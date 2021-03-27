const jwt = require('jsonwebtoken')

module.exports = async(req,res,next)=>{
   try{
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token,"user");
    req.userData = decode;
    next();
   } catch(e){
       return res.json({message : "auth for user is error"})
   }
}