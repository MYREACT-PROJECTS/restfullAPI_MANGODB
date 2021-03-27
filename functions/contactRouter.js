const express= require('express')
const router = express.Router()
const {getcontacts,addContacts} = require('./contactLogic')



router.get('/contacts',getcontacts)
router.post('/contacts',addContacts)

module.exports=router