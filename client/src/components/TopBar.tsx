import {
  useMemo,
  useRef,
  useState,
  useEffect
} from "react";

import type { Preset } from "../types";

export default function TopBar({
  presets,
  activePreset,
  setActivePresetId,
  onCreatePreset,
  onLogout,
  onEditPreset
}: {
  presets: Preset[];
  activePreset: Preset | null;
  setActivePresetId: (id: string) => void;
  onCreatePreset: () => void;
  onLogout: () => void;
  onEditPreset: (preset: Preset) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  const filteredPresets = useMemo(() => {
    return presets.filter((p) =>
      p.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [presets, search]);

  const handleSelect = (id: string) => {
    setActivePresetId(id);
    setOpen(false);
    setSearch("");
  };

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="topbar">
      <div className="left">
        <span>Preset:</span>

        <div
          className="dropdown"
          ref={dropdownRef}
        >
          <button
            className="dropdown-trigger"
            onClick={() =>
              setOpen((v) => !v)
            }
          >
            {activePreset?.name ||
              "Select preset"}

            <span className="chevron">
              ▾
            </span>
          </button>

          {open && (
            <div className="dropdown-menu">
              <div className="dropdown-inner">
                <input
                  className="dropdown-search"
                  placeholder="Search presets..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                <div className="dropdown-list">
                  {filteredPresets.length ===
                  0 ? (
                    <div className="dropdown-empty">
                      No presets found
                    </div>
                  ) : (
                    filteredPresets.map((p) => (
                      <div
                        key={p.id}
                        className={`dropdown-item ${
                          activePreset?.id ===
                          p.id
                            ? "active"
                            : ""
                        }`}
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap: "8px"
                        }}
                      >
                        <span
                          onClick={() =>
                            handleSelect(
                              p.id
                            )
                          }
                          style={{
                            flex: 1,
                            cursor:
                              "pointer"
                          }}
                        >
                          {p.name}
                        </span>

                        <button
                          onClick={() =>
                            onEditPreset(p)
                          }
                          style={{
                            padding:
                              "4px 8px",
                            fontSize:
                              "12px"
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <button onClick={onCreatePreset}>
          + Create New Preset
        </button>
      </div>

      <div className="right">
        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}