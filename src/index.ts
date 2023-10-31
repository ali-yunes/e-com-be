import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import path from "path";

const app = express();

app.use(cors({
    credentials:true,
}));

app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'e-com-fe')));

app.use('/api', router());
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/e-com-fe/index.html'));
});

const MONGO_URL = process.env["MONGO_URL"] || "mongodb://localhost:27017";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (err: Error) => {
    console.error(err);
    console.log("MongoDB connection error. Please make sure MongoDB is running.");
});


const server = http.createServer(app);

server.listen(process.env["PORT"] || 8080, () => {
    console.log("Server is running on port",process.env["PORT"]);
})
