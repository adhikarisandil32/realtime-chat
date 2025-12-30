import { JSONFilePreset } from "lowdb/node";
import path from "path";

interface IChat {
  sender: string;
  message: string;
  createdAt: number;
}

interface IData {
  users: Set<string>;
  chats: IChat[];
}

const defaultData: IData = { users: new Set(), chats: [] };

export const db = await JSONFilePreset(
  path.join(import.meta.dirname, "../db/db.json"),
  defaultData,
);
