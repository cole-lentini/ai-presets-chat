import { useState } from "react";

export default function InputBar({
  onSend
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="inputbar">
      <button className="attach">📎</button>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === "Enter" && send()}
      />

      <button onClick={send}>Send</button>
    </div>
  );
}