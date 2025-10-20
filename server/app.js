import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.js';
import morgan from 'morgan';
import DBConect from './confing/conectDB.js';
import errorMiddleware from './maidlewhere/errorMaidlewhere.js';
import courseRouter from './routes/course.router.js';
import contactRoute from './routes/countactUs.router.js';
import evintRouter from './routes/Evint.js';

DBConect()
const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use("/api/v1/evint", evintRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use('/api/v1/contect',contactRoute)
app.get('/', (req, res) => {
  console.log("hello");
  res.send('hello');
});

// 404 Handler

app.use(errorMiddleware)

export default app;
