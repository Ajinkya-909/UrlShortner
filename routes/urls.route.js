import express from 'express'
import {shortenPostRequestBodySchema} from '../validation/requests.validation.js'
import { nanoid } from 'nanoid'
import {db} from '../db/index.js'
import {urlsTable} from '../models/index.js'
import {ensureAuthenticated} from '../middlewares/auth.middleware.js'
import { eq } from 'drizzle-orm'
import { log } from 'console'

const router = express.Router();

router.get('/codes',ensureAuthenticated,async function (req,res) {
  const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId,req.user.id))

  if(!codes) return res.status(200).json({message:"No Urls Created"})

  console.log(codes);

  return res.status(200).json({codes})

})

router.post('/shorten',ensureAuthenticated,async function(req,res){

  const validationResult = await shortenPostRequestBodySchema. safeParseAsync(req.body)

  if (validationResult.error) {
  return res.status(400).json({ error: validationResult.error.format() }) ;
  }

  const {url, code}=validationResult.data

  const shortCode=code ?? nanoid(6)

  const [result]=await db.insert(urlsTable).values({
    shortCode,
    targetURL:url,
    userId:req.user.id,
  }).returning({
    id: urlsTable.id,
    shortCode: urlsTable. shortCode,
    targetURL: urlsTable. targetURL,
  })

  return res.status(200).json({
    id:result.id,
    shortCode:result.shortCode,
    targetURL:result.targetURL
  })

})


router.get('/:shortCode', async function (req,res) {
  const code =req.params.shortCode;
  const [result]= await db.select({
    targetURL: urlsTable.targetURL
  }).from(urlsTable).where(eq(urlsTable.shortCode,code))

  if(!result) return res.status(400).json({error:`Url does not exist`})

  return res.redirect(result.targetURL)

})


export default router