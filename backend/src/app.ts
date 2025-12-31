import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "@src/config/config.js";
import { db } from "./db";

const app = express();

app.use(cors({ origin: config.ALLOWED_CORS_ORIGINS ?? false }));
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ test: "success" });
});

app.get("/api/chats", async (req, res) => {
  try {
    const limit = isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
    const page = isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);

    const pagination = {
      total: db.data.chats.length,
      limit: limit < 10 ? 10 : limit,
      page: page < 1 ? 1 : page,
      get totalPage() {
        return Math.ceil(this.total / this.limit);
      },
      get nextPage() {
        return this.page >= this.totalPage ? null : this.page + 1;
      },
      get prevPage() {
        return this.page <= 1 ? null : this.page - 1;
      },
    };

    const end = pagination.total - (pagination.page - 1) * pagination.limit;
    const start = end - limit < 0 ? 0 : end - limit;

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "fetch success",
      data: db.data.chats
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(start, end),
      pagination,
    });
  } catch (error) {
    const e = error as Error;
    const statusCode = 400;
    res.status(statusCode).json({
      statusCode,
      success: false,
      message: e.message ?? "failed",
      data: null,
    });
  }
});

export { app };
