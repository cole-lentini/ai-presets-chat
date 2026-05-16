import { useState } from "react";
import type { Preset } from "../types";

export default function CreatePreset({
  onSave,
  onCancel
}: {
  onSave: (preset: Preset) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      id: crypto.randomUUID(),
      name,
      instructions
    });

    // optional cleanup after save
    setName("");
    setInstructions("");
  };

  const handleCancel = () => {
    // reset form so next open is clean
    setName("");
    setInstructions("");

    onCancel();
  };

  return (
    <div className="center-page">
      <div className="card">
        <h1>Create AI Preset</h1>

        <label>Preset Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Code Assistant"
        />

        <label>Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Act like a senior engineer..."
        />

        <div className="row">
          <button className="secondary" onClick={handleCancel}>
            Cancel
          </button>

          <button onClick={handleSave}>
            Save Preset
          </button>
        </div>
      </div>
    </div>
  );
}