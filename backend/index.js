import cors from "cors";
import eventRouter from "./routes/callEvents.js";
import { config } from 'dotenv';
config({ path: './.env.local' });
import Clerk from '@clerk/clerk-sdk-node/esm/instance';
import express from "express";
import userRouter from "./routes/callUsers.js"

// init app
const port = process.env.PORT || 8080;
const app = express();

const secretKey = process.env.CLERK_SECRET_KEY;
console.log("Key: ", secretKey);

const clerk = new Clerk({ secretKey: secretKey });
console.log(clerk);

// middleware
app.use(cors());

// subrouters
// routers exported from files in /routes will be defined here
// eg. all routes beginning with /user will be handled by userRouter
// app.use("/user", userRouter);
// test route: GET request to http://localhost:8080/
app.get("/", async (req, res) => {
  res.send("Hello World!");
});


//clerk middleware to protect /events
app.get(
  '/events',
  clerk.expressRequireAuth({
    // ...options
  }),
  (req, res, next) => {
    next();
  }
);

//get
app.use("/events", eventRouter);

//post
app.use('/saveEvent', userRouter);

//get
app.use('/getSavedEvents', userRouter);

//delete
app.use('/deleteEvent', userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

// start server listening at port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});