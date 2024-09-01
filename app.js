import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import sequelize from "./db/sequelize.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

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

let server = null;

try {
  await sequelize.authenticate();
  console.log("Database connection successful");
  server = app.listen(3000, async () => {
    console.log("Server is running. Use our API on port: 3000");
  });
} catch (error) {
  console.log(error.message);
  process.exit(1);
}

export default server;

