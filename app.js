import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import sequelize from "./db/sequelize.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { PORT = 3000 } = process.env;
const port = parseInt(PORT);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    app.listen(port, () => {
      console.log(`Server is running. Use API on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
};

startServer();
