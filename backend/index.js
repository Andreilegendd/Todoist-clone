import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import dbPromise from './models/index.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", routes);

const PORT = process.env.PORT || 8080;

dbPromise
  .then(() => {
    console.log("Models loaded successfully");
    return dbPromise.then(db => db.sequelize.authenticate());
  })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
