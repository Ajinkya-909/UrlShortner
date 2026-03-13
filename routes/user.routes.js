import express from 'express'
import {db} from '../db/index.js'
import {usersTable} from '../models/index.js'
import {signupPostRequestBodySchema} from '../validation/requests.validation.js'
import {hashPassword} from '../utils/hash.js'
import {getUserByEmail} from '../services/user.service.js'

const router = express.Router();

router.post('/signup',async (req,res)=>{
  const validationResult= await signupPostRequestBodySchema.safeParseAsync(req.body);

  if (validationResult.error){
    return res.status(400).json({error:validationResult.error.format()})
  }

  const {firstname, lastname, email, password} = validationResult.data;

  const existingUser=await getUserByEmail(email)
  if(existingUser) return res.status(400).json({error:`User with ${email} already exists`})

  const {salt, password:newPassword}= hashPassword(password)

  const [user] =await db.insert(usersTable).values({
    lastname: lastname || null,
    firstname,
    email,
    salt,
    password:newPassword,
}).returning({id: usersTable.id})

  return res.status(201).json({data:{userid:user.id}})

})

router.get('/trial', (req,res)=>{
  res.json({message:'All Good'})
})

export default router