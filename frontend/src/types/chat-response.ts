export interface IChatResponse {
  id: string;
  message: string;
  sender: string;
  createdAt: number;
  status: "sent" | "failed" | "pending";
}

export interface IClientChat extends Omit<IChatResponse, "id"> {
  identifier: string;
}
