import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbPromise from './models/index.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

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
