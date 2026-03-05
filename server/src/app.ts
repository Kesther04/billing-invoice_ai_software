import express from "express";
import cors from "cors";
import { authRouter } from "./modules/users";

// express configuration
const app = express();

app.use(cors());

// JSON middleware
app.use(express.json());

app.get("/", (_, res) => {
  res.json({message: "Welcome to the Billing / Invoice AI server!"});
});

// module routers mounted
app.use("/auth", authRouter); // Mount all auth routes under /auth

// error handling

// rate limiting

export default app;
