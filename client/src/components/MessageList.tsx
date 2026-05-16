import type { Message } from "../types";

export default function MessageList({
  messages
}: {
  messages: Message[];
}) {
  return (
    <div className="chat-window">
      {messages.map((m) => (
        <div key={m.id} className={`message ${m.role}`}>
          {m.content}
        </div>
      ))}
    </div>
  );
}