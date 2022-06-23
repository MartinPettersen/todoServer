import express, {Request, Response, Application} from 'express';
const cors = require('cors');
import { json } from 'body-parser';
import { listRouter } from './routes/route';
import mongoose from 'mongoose';
import 'dotenv/config'

const socketIO = require('socket.io')




const app:Application = express();

const PORT = process.env.PORT || 8000;

app.use(json());
app.use(cors());
app.use(listRouter)
const mongoUrl = `mongodb+srv://todoListUser:${process.env.PASSWORD}@cluster0.nbbge.mongodb.net/?retryWrites=true&w=majority`
const temp = 'mongodb://localhost:27017/todoList'
console.log(mongoUrl)
mongoose.connect(mongoUrl, {} , () => {
    console.log('connected to database');
})


app.listen(PORT, ():void => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});