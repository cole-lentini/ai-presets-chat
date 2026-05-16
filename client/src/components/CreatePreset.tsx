import { useState } from "react";
import type { Preset } from "../types";

export default function CreatePreset({
  preset,
  onSave,
  onCancel,
  onDelete
}: {
  preset?: Preset | null;
  onSave: (preset: Preset) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void; // ✅ FIXED HERE
}) {
  const isEditing = !!preset;

  const [name, setName] = useState(preset?.name || "");
  const [instructions, setInstructions] = useState(
    preset?.instructions || ""
  );

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      id: preset?.id || crypto.randomUUID(),
      name,
      instructions
    });

    setName("");
    setInstructions("");
  };

  const handleCancel = () => {
    setName("");
    setInstructions("");
    onCancel();
  };

  const handleDelete = () => {
    if (!preset || !onDelete) return;

    const confirmed = window.confirm(
      `Delete "${preset.name}"?`
    );

    if (!confirmed) return;

    onDelete(preset.id); // ✅ now correctly passes string id
  };

  return (
    <div className="center-page">
      <div className="card">
        <h1>
          {isEditing ? "Edit AI Preset" : "Create AI Preset"}
        </h1>

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
            {preset ? "Save Changes" : "Save Preset"}
          </button>

          {preset && onDelete && (
            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}