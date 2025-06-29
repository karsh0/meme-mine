import express from "express"
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/index.js"
import cors from "cors"
dotenv.config()
const app = express()
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors())

app.post('/image', async(req,res)=>{
    const {imageUrl, title} = req.body;

    if(!imageUrl || !title){
        res.json({
            message:"ImageUrl or title is missing!"
        })
    }

    const image = await prisma.image.create({
        data:{
            imageUrl,
            title
        }
    })

    res.json({
        message:"image created",
        image
    })

})

app.get('/images', async(req,res)=>{
    const images = await prisma.image.findMany();

    res.json({
        images
    })
})

app.listen(3000, ()=>{
    console.log("backend running on port 3000")
})