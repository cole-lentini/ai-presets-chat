import type { Preset, Message } from "../types";
import TopBar from "./TopBar";
import MessageList from "./MessageList";
import InputBar from "./InputBar";

export default function Chat({
  presets,
  activePreset,
  setActivePresetId,
  messages,
  onSend,
  onCreatePreset,
  onLogout,
  onEditPreset
}: {
  presets: Preset[];
  activePreset: Preset | null;
  setActivePresetId: (id: string) => void;
  messages: Message[];
  onSend: (payload: {
    text: string;
    image?: File | null;
  }) => void;
  onCreatePreset: () => void;
  onLogout: () => void;
  onEditPreset: (preset: Preset) => void;
}) {
  return (
    <div className="chat-page">
      <TopBar
        presets={presets}
        activePreset={activePreset}
        setActivePresetId={setActivePresetId}
        onCreatePreset={onCreatePreset}
        onLogout={onLogout}
        onEditPreset={onEditPreset}
      />

      <MessageList messages={messages} />

      <InputBar onSend={onSend} />
    </div>
  );
}