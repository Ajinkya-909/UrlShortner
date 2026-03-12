import {z} from 'zod'

export const signupPostRequestBodySchema= z.object({
  firstname:z.string(),
  lastname:z.string().nullable().default(null),
  email:z.string().email(),
  password:z.string().min(6)
})