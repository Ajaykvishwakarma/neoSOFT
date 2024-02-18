
import mongoose from "mongoose";
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();
dotenv.config({
    path: path.resolve(__dirname, ".env"),
});

const PORT = process.env.PORT || 7000;



const app = express();

// app.use(cors());
app.use(cors({ origin: '*' }));
app.use(express.json());



const postSchema = new mongoose.Schema({
        userId: {
            type: Number,
            required: false
        },
        id:{
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: false
        },
        body: {
            type: String,
            required: false
        },
        
});

const Post = mongoose.model("post", postSchema);

app.get('/ping', (_, res) => {
    res.send({ status: "ok" });
});



app.get("/posts", async function (req, res) {

    const { page = 1, offset = 10, searchTerm} = req.query;
    const skip = (page - 1) * offset;
    let query;
    let totalPages = 0;
    let totalDocs = 0;
    
    try {
        let resultData = await Post.find();
   
        
        if (!resultData.length) {
            try {
                const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
                for (const post of posts.data) {
                    const newPost = new Post({
                        userId: post.userId,
                        id: post.id,
                        title: post.title,
                        body: post.body
                    });
                    await newPost.save();
                }
                
            } catch (error) {
                console.error("Error fetching or saving posts:", error);
            }
        }
        
        if (searchTerm && searchTerm !== "") {
            query = await Post.find({title: { $regex: searchTerm, $options: "i" }}).skip(skip).limit(offset).lean().exec();
            totalDocs = await Post.find({title: { $regex: searchTerm, $options: "i" }}).countDocuments()
            totalPages = (Math.ceil(totalDocs / offset))
      
          } else {
            query = await Post.find().skip(skip).limit(offset).lean().exec();
            totalDocs = await Post.find().countDocuments()
            totalPages = (Math.ceil(totalDocs / offset))
        }
        return res.status(200).json({ status: 200, message: "Post lists", data: query, pages: totalPages, count: totalDocs })

    } catch (error) {
         return res.status(500).json({ status: 500, message: "Internal server error, try again after some time."})
    }

})

// For invalid routes
app.all('*', (_, res) => {
    return res.status(400).json({ status: 400, message: "No matching URL found"})
});


startServer();

async function startServer() {
  
    await mongoose.connect("mongodb://localhost:27017/neoSOFT");

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
        console.log(`Access it from http://localhost:${PORT}`);
    });


}

mongoose.connection.on("disconnected", startServer);

