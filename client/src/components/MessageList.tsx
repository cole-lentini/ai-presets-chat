import type { Message } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageList({
  messages
}: {
  messages: Message[];
}) {
  return (
    <div className="chat-window">
      {messages.map((m) => (
        <div key={m.id} className={`message ${m.role}`}>
          
          {/* IMAGE PREVIEW */}
          {m.image && (
            <img
              src={m.image}
              alt="uploaded"
              style={{
                maxWidth: "220px",
                borderRadius: "10px",
                marginBottom: "8px",
                display: "block"
              }}
            />
          )}

          {/* MESSAGE CONTENT */}
          {m.role === "ai" ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {m.content}
            </ReactMarkdown>
          ) : (
            <div>{m.content}</div>
          )}

        </div>
      ))}
    </div>
  );
}