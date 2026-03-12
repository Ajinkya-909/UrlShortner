import express from 'express';

const app = express();

app.use(express.json())

const PORT=process.env.PORT ?? 3000;

app.get('/',(req,res)=>{
  return res.json({status:"Server is running"});
})

app.listen(PORT, ()=>console.log(`Server Running on port ${PORT}`))