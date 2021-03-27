const CONTACTS = require ("./contactsModels")

module.exports = {
    getcontacts:async(request, response) => {
        const contacts = await CONTACTS.find()
            
              const data = contacts.map(res=>{
                    return   {
                        id:res.id,
                        name:res.name,
                        phone:res.phone,
                    }
                })
        
              //console.log("data",data)
        
    
            response.status(200).send({
                results:data
           })
     
    },
   
   addContacts: async (req, res) => {
    const contacts = await new CONTACTS({
        name : req.headers.name,
        phone: req.headers.phone,

    }).save()

    response.json({
        message:"inserted Sucessfullt",
        id: contacts.id,
        name:contacts.name,
        phone:contacts.phone,
       

    })
}
   }