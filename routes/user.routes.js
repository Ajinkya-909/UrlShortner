import express from 'express'
import {db} from '../db/index.js'
import {usersTable} from '../models/index.js'
import {signupPostRequestBodySchema,loginPostRequestBodySchema} from '../validation/requests.validation.js'
import {hashPassword} from '../utils/hash.js'
import {getUserByEmail,getUserByEmailAndPass} from '../services/user.service.js'
import {createUserToken} from '../utils/token.js'

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

router.post('/login',async(req,res)=>{
  const validationResult= await loginPostRequestBodySchema.safeParseAsync(req.body);

  if (validationResult.error){
    return res.status(400).json({error:validationResult.error.format()})
  }

  const {email, password} = validationResult.data;

  const existingUser=await getUserByEmailAndPass(email)

  if(!existingUser) return res.status(400).json({error:`User with email: ${email} not found!`})

  const {password:newPassword} = await hashPassword(password,existingUser.salt)

  if(existingUser.password!==newPassword) return res.status(400).json({message:`Invalid Password`})
  
  const token = await createUserToken({id:existingUser.id})

  return res.json({token})

})

router.get('/trial', (req,res)=>{
  res.json({message:'All Good'})
})

export default router