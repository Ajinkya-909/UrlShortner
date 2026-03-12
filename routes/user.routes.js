import express from 'express'
import {db} from '../db/index.js'
import {usersTable} from '../models/index.js'
import { eq } from 'drizzle-orm';
import { error } from 'console';
import { randomBytes, createHmac } from 'crypto';
import {signupPostRequestBodySchema} from '../validation/requests.validation.js'

const router = express.Router();

router.post('/signup',async (req,res)=>{
  const validationResult= await signupPostRequestBodySchema.safeParseAsync(req.body);

  if (validationResult.error){
    return res.status(400).json({error:validationResult.error.format()})
  }

  const {firstname, lastname, email, password} = validationResult.data;

  const [existingUser]= await db.select({
    id:usersTable.id
  }).from(usersTable).where(eq(usersTable.email,email))

  if(existingUser) return res.status(400).json({error:`User with ${email} already exists`})

    const salt=randomBytes(256).toString('hex');
    const newPassword=createHmac('sha256',salt).update(password).digest('hex')

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