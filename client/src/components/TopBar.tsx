import { useMemo, useRef, useState, useEffect } from "react";
import type { Preset } from "../types";

export default function TopBar({
  presets,
  activePreset,
  setActivePresetId,
  onCreatePreset
}: {
  presets: Preset[];
  activePreset: Preset | null;
  setActivePresetId: (id: string) => void;
  onCreatePreset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredPresets = useMemo(() => {
    return presets.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [presets, search]);

  const handleSelect = (id: string) => {
    setActivePresetId(id);
    setOpen(false);
    setSearch("");
  };

  // ✅ CLICK OUTSIDE LOGIC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar">
      <div className="left">
        <span>Preset:</span>

        <div className="dropdown" ref={dropdownRef}>
          {/* Trigger */}
          <button
            className="dropdown-trigger"
            onClick={() => setOpen((v) => !v)}
          >
            {activePreset?.name || "Select preset"}
            <span className="chevron">▾</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="dropdown-menu">
              <div className="dropdown-inner">
                <input
                  className="dropdown-search"
                  placeholder="Search presets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="dropdown-list">
                  {filteredPresets.length === 0 ? (
                    <div className="dropdown-empty">
                      No presets found
                    </div>
                  ) : (
                    filteredPresets.map((p) => (
                      <div
                        key={p.id}
                        className={`dropdown-item ${
                          activePreset?.id === p.id ? "active" : ""
                        }`}
                        onClick={() => handleSelect(p.id)}
                      >
                        {p.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button onClick={onCreatePreset}>
        + Create New Preset
      </button>
    </div>
  );
}