import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./modules/users";
import  billRouter  from "./modules/billing";

// express configuration
const app = express();

const normalizeOrigin = (value: string) => value.replace(/\/+$/, "");

const allowedOrigins = Array.from(new Set([
  "http://localhost:5173",
  normalizeOrigin(env.FRONTEND_URL),
]));

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));       // handles all requests
app.options("/{*path}", cors(corsOptions)); // handles preflight


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
