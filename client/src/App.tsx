import { useState } from "react";
import type { Preset, Message } from "./types";
import CreatePreset from "./components/CreatePreset";
import Chat from "./components/Chat";

export default function App() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [mode, setMode] = useState<"create" | "chat">("create");

  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const activePreset = presets.find(p => p.id === activePresetId) || null;

  const handleCreatePreset = (preset: Preset) => {
    setPresets(prev => [...prev, preset]);
    setActivePresetId(preset.id);
    setMode("chat"); // 👈 important
  };

  const sendMessage = async (text: string) => {
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: text
    } satisfies Message;

    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          preset: activePreset
        })
      });

      const data = await res.json();

      const aiMsg = {
        id: crypto.randomUUID(),
        role: "ai" as const,
        content: data.text
      } satisfies Message;

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      const errorMsg = {
        id: crypto.randomUUID(),
        role: "ai",
        content: "Error contacting AI server."
      } satisfies Message;

      setMessages(prev => [...prev, errorMsg]);
    }
  };

  // 🟣 No presets → force create screen
  if (mode === "create") {
    return (
      <CreatePreset
        onSave={handleCreatePreset}
        onCancel={() => setMode("chat")}
      />
    );
  }

  return (
    <Chat
      presets={presets}
      activePreset={activePreset}
      setActivePresetId={setActivePresetId}
      messages={messages}
      onSend={sendMessage}
      onCreatePreset={() => setMode("create")}
    />
  );
}