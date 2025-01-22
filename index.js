import express from 'express';
import mongoose from "mongoose";
import dishesRouter from "./routes/dishesRouter.js";

const app = express();

await mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    const acceptHeader = req.headers['accept'];

    if (acceptHeader.includes('application/json') || req.method === 'OPTIONS' ) {
        next();
    } else {
        res.status(406).send('Not Acceptable');
    }
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
    next();
});

app.use('/dishes', dishesRouter);

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});