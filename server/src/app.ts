import express from "express";
import cors from "cors";
import { authRouter } from "./modules/users";
import  billRouter  from "./modules/billing";

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
app.use("/billing", billRouter ); // Mount all invoice and AI routes under /billing

// error handling

// rate limiting

export default app;
