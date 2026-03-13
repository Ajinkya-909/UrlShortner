import express from 'express';
import userRouter from './routes/user.routes.js'
import {authenticationMiddleware} from './middlewares/auth.middleware.js'

const app = express();

app.use(express.json())
app.use(authenticationMiddleware)

app.use('/user',userRouter)

const PORT=process.env.PORT ?? 3000;

app.get('/',(req,res)=>{
  return res.json({status:"Server is running"});
})

app.listen(PORT, ()=>console.log(`Server Running on port ${PORT}`))