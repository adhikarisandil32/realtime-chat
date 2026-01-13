import { JSONFilePreset } from "lowdb/node";
import path from "path";

interface IChat {
  id: string;
  sender: string;
  message: string;
  createdAt: number;
  status: "sent" | "failed" | "pending";
}

interface IData {
  users: string[];
  chats: IChat[];
}

// avoid using set and map, use array and object ({}) instead
const defaultData: IData = { users: [], chats: [] };

export const db = await JSONFilePreset(
  path.join(import.meta.dirname, "../db/db.json"),
  defaultData,
);
