export type Preset = {
  id: string;
  name: string;
  instructions: string;
  user_id?: string;
};

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  image?: string | null;
};

export type User = {
  id: string;
  username: string;
  created_at?: string; // optional (only if your table has it)
};