import { useRef, useState } from "react";

export default function InputBar({
  onSend
}: {
  onSend: (payload: { text: string; image?: File | null }) => void;
}) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const send = () => {
    if (!text.trim() && !image) return;

    onSend({
      text,
      image
    });

    setText("");
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFile = (file?: File | null) => {
    if (!file) return;
    setImage(file);
  };

  return (
    <div className="inputbar">
      {/* hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* attach button */}
      <button
        className="attach"
        onClick={() => fileInputRef.current?.click()}
      >
        📎
      </button>

      {/* preview (optional but useful) */}
      {image && (
        <span style={{ fontSize: "12px", opacity: 0.7 }}>
          {image.name}
        </span>
      )}

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