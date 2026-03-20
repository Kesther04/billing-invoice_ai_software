import express from "express";
import cors from "cors";
import { authRouter } from "./modules/users";
import  billRouter  from "./modules/billing";

// express configuration
const app = express();

const allowedOrigins = [
  "http://localhost:5173",                // local dev
  "https://traqbill.vercel.app",         // production frontend
  "https://traqbill.vercel.app/",         // production frontend
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,                     // needed if you send cookies/auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// JSON middleware
app.use(express.json());

app.get("/", (_, res) => {
  res.json({message: "Welcome to the TraqBill AI server!"});
});

// module routers mounted
app.use("/auth", authRouter); // Mount all auth routes under /auth
app.use("/billing", billRouter ); // Mount all invoice and AI routes under /billing

// error handling

// rate limiting

export default app;
