export type Preset = {
  id: string;
  name: string;
  instructions: string;
};

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};