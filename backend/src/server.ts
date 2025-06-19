import express , {Response, Request} from "express";
import cors from "cors";
import prisma from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/notes", async(_, res)=>{
    const notes = await prisma.note.findMany({})
    res.status(200).json(notes)
})

app.post("/notes", async(req, res)=>{
    const body = await req.body

    try {
        const data = await prisma.note.create({
            data : {
                title : body.title,
                tags : body.tags,
                content : body.content
            }
        })
        
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json("db error")  
    }
    
})

app.delete("/notes/:id", async(req, res)=>{
    const id = req.params.id

    try {
        await prisma.note.delete({
            where : {
                id
            }
        })
        res.status(200).json("note deleted")
    } catch (error) {
        res.status(500).json("db error")  
    }
})

app.get("/",(req : Request, res : Response)=>{
    res.json("hello from eduShare http sever ")
})

app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});
