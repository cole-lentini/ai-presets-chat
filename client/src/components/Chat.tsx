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
  onCreatePreset
}: {
  presets: Preset[];
  activePreset: Preset | null;
  setActivePresetId: (id: string) => void;
  messages: Message[];
  onSend: (text: string) => void;
  onCreatePreset: () => void;
}) {
  return (
    <div className="chat-page">
      <TopBar
        presets={presets}
        activePreset={activePreset}
        setActivePresetId={setActivePresetId}
        onCreatePreset={onCreatePreset}
      />

      <MessageList messages={messages} />

      <InputBar onSend={onSend} />
    </div>
  );
}