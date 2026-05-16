import { useEffect, useState } from "react";

import type {
  Preset,
  Message,
  User
} from "./types";

import CreatePreset from "./components/CreatePreset";
import Chat from "./components/Chat";
import Login from "./components/Login";

import { supabase } from "./lib/supabase";

// -----------------------------
// LOCAL STORAGE AUTH HELPERS
// -----------------------------
const STORAGE_KEY = "app_user";

function loadStoredUser(): User | null {
  const raw =
    localStorage.getItem(STORAGE_KEY);

  return raw ? JSON.parse(raw) : null;
}

function saveStoredUser(user: User) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(user)
  );
}

function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
}

// -----------------------------
// FILE → BASE64 HELPER
// -----------------------------
const fileToBase64 = (
  file: File
): Promise<string> => {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(
          reader.result as string
        );
      };

      reader.onerror = reject;
    }
  );
};

export default function App() {
  const [user, setUser] =
    useState<User | null>(
      loadStoredUser()
    );

  const [presets, setPresets] =
    useState<Preset[]>([]);

  const [
    editingPreset,
    setEditingPreset
  ] = useState<Preset | null>(null);

  const [mode, setMode] = useState<
    "create" | "chat"
  >("create");

  const [
    activePresetId,
    setActivePresetId
  ] = useState<string | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const activePreset =
    presets.find(
      (p) => p.id === activePresetId
    ) || null;

  // -----------------------------
  // LOAD USER PRESETS
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const loadPresets = async () => {
      const { data, error } =
        await supabase
          .from("presets")
          .select("*")
          .eq("user_id", user.id);

      if (error) {
        console.error(
          "Supabase load error:",
          error
        );

        return;
      }

      const loaded = data || [];

      setPresets(loaded);

      if (loaded.length > 0) {
        setMode("chat");
        setActivePresetId(
          loaded[0].id
        );
      } else {
        setMode("create");
      }
    };

    loadPresets();
  }, [user]);

  // -----------------------------
  // RESET CHAT ON PRESET CHANGE
  // -----------------------------
  useEffect(() => {
    setMessages([]);
  }, [activePresetId]);

  // -----------------------------
  // LOGIN GATE
  // -----------------------------
  if (!user) {
    return (
      <Login
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);

          saveStoredUser(
            loggedInUser
          );

          setMessages([]);

          setActivePresetId(
            null
          );
        }}
      />
    );
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    clearStoredUser();

    setUser(null);

    setPresets([]);

    setMessages([]);

    setActivePresetId(null);

    setEditingPreset(null);

    setMode("create");
  };

  // -----------------------------
  // CREATE PRESET
  // -----------------------------
  const handleCreatePreset =
    async (preset: Preset) => {
      const {
        data: inserted,
        error
      } = await supabase
        .from("presets")
        .insert({
          name: preset.name,
          instructions:
            preset.instructions,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error(
          "Preset insert error:",
          error
        );

        return;
      }

      if (inserted) {
        setPresets((prev) => [
          ...prev,
          inserted
        ]);

        setActivePresetId(
          inserted.id
        );

        setMode("chat");

        setMessages([]);
      }
    };

  // -----------------------------
  // UPDATE PRESET
  // -----------------------------
  const handleUpdatePreset =
    async (
      updatedPreset: Preset
    ) => {
      const { data, error } =
        await supabase
          .from("presets")
          .update({
            name:
              updatedPreset.name,
            instructions:
              updatedPreset.instructions
          })
          .eq(
            "id",
            updatedPreset.id
          )
          .select()
          .single();

      if (error) {
        console.error(
          "Preset update error:",
          error
        );

        return;
      }

      setPresets((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? data
            : p
        )
      );

      setEditingPreset(null);

      setMode("chat");
    };

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const sendMessage = async (
    payload: {
      text: string;
      image?: File | null;
    }
  ) => {
    let imageBase64:
      | string
      | null = null;

    if (payload.image) {
      imageBase64 =
        await fileToBase64(
          payload.image
        );
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: payload.text,
      image: imageBase64
    };

    setMessages((prev) => [
      ...prev,
      userMsg
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: payload.text,
          image: imageBase64,
          preset: activePreset,
          userId: user.id
        })
      });

      if (!res.ok) {
        const text = await res.text(); // 👈 important fallback
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data = await res.json();

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        content: data.text
      };

      setMessages((prev) => [
        ...prev,
        aiMsg
      ]);
    } catch (err) {
      console.error(
        "AI ERROR:",
        err
      );

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content:
            "Error contacting AI server."
        }
      ]);
    }
  };

  // -----------------------------
  // CREATE / EDIT MODE
  // -----------------------------
  if (mode === "create") {
    return (
      <CreatePreset
        preset={editingPreset}
        onSave={
          editingPreset
            ? handleUpdatePreset
            : handleCreatePreset
        }
        onDelete={async (id: string) => {
          const { error } = await supabase
            .from("presets")
            .delete()
            .eq("id", id);

          if (error) {
            console.error("Preset delete error:", error);
            return;
          }

          const updatedPresets = presets.filter(
            (p) => p.id !== id
          );

          setPresets(updatedPresets);

          setEditingPreset(null);
          setMessages([]);

          if (activePresetId === id) {
            if (updatedPresets.length > 0) {
              setActivePresetId(updatedPresets[0].id);
              setMode("chat");
            } else {
              setActivePresetId(null);
              setMode("create");
            }
          } else {
            setMode("chat");
          }
        }}
        onCancel={() => {
          setEditingPreset(null);

          setMode("chat");
        }}
      />
    );
  }

  // -----------------------------
  // MAIN CHAT UI
  // -----------------------------
  return (
    <Chat
      presets={presets}
      activePreset={activePreset}
      setActivePresetId={
        setActivePresetId
      }
      messages={messages}
      onSend={sendMessage}
      onCreatePreset={() => {
        setEditingPreset(null);

        setMode("create");
      }}
      onLogout={logout}
      onEditPreset={(preset) => {
        setEditingPreset(preset);

        setMode("create");
      }}
    />
  );
}