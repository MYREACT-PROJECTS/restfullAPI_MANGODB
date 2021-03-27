const AUTH = require('./authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
 signup: async (req,res)=>{
     const user = AUTH.find({email:req.headers.email}) 
     if (user.length >= 1){
         return res.json({message: "this email is existed "})
     }
       else{
           bcrypt.hash(req.headers.password,10,async (hash,error)=>{
               if(error){
                   return res.json({messsage: " error in your password "})
               }
               else {
                   const auth = await new AUTH ({
                       name:req.headers.name,
                       email:req.headers.email,
                       password:hash,
                       type:req.headers.type

                   }).save()
                   res.json({
                       message:"creat user successfully",
                       email:auth.email,
                       password:auth.password,
                       type:auth.type

                   })
               }
           })
       }

 },

login:  async(req,res)=>{
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
                                type:user[0].type,
                                email:user[0].email,
                                token:token
                            })
                        }
                        else{
                            const token=jwt.sign({email:user[0].email,name:user[0].name},"admin")
                            return res.json({
                                message:"user has login successfully",
                                type:user[0].type,
                                email:user[0].email,
                                token:token
                            })
                        }
                    }
                })
            }
}

}