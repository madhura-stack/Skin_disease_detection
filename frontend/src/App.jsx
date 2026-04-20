
import { useState, useRef, useCallback } from "react";
import.meta.env.VITE_API_URL
const API_BASE = "https://skin-disease-detection-qb2j.onrender.com";

const RISK_CONFIG = {
  HIGH:   { bg: "#fff1f1", border: "#fca5a5", text: "#dc2626", dot: "#ef4444" },
  MEDIUM: { bg: "#fffbeb", border: "#fcd34d", text: "#d97706", dot: "#f59e0b" },
  LOW:    { bg: "#f0fdf4", border: "#86efac", text: "#16a34a", dot: "#22c55e" },
};

// ── Icons (inline SVG components) ────────────────────────────────────────────
const Icon = {
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Pill: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"/>
      <circle cx="18" cy="18" r="3"/><path d="m22 22-1.5-1.5"/>
    </svg>
  ),
  History: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive }) {
  const navItems = [
    { id: "upload",    label: "Upload Image",           icon: Icon.Upload  },
    { id: "disease",   label: "Disease Information",    icon: Icon.Info    },
    { id: "medical",   label: "Medical & Medication Advice", icon: Icon.Pill },
    { id: "history",   label: "History",                icon: Icon.History },
  ];

  return (
    <aside style={{
      width: 220, minHeight: "100vh", background: "#0f1b2d",
      display: "flex", flexDirection: "column", flexShrink: 0,
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", flexShrink: 0,
          }}>
            <Icon.Shield />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Skin Disease</div>
            <div style={{ color: "#64748b", fontSize: 10.5, marginTop: 1 }}>Detection System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 10px 0" }}>
        {navItems.map(({ id, label, icon: Ic }) => (
          <button key={id} onClick={() => setActive(id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8, marginBottom: 2,
            background: active === id ? "#1e40af" : "transparent",
            color: active === id ? "#fff" : "#94a3b8",
            border: "none", cursor: "pointer", textAlign: "left",
            fontSize: 13, fontWeight: active === id ? 600 : 400,
            transition: "all .15s",
          }}>
            <span style={{ width: 17, height: 17, flexShrink: 0 }}><Ic /></span>
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 10px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "9px 12px", borderRadius: 8,
          background: "transparent", color: "#64748b",
          border: "none", cursor: "pointer", fontSize: 13,
        }}>
          <span style={{ width: 17, height: 17 }}><Icon.Logout /></span>
          Logout
        </button>
      </div>
    </aside>
  );
}

// ── Upload Panel ──────────────────────────────────────────────────────────────
function UploadPanel({ onResult, loading, setLoading }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) { setError("Only JPG/PNG files accepted."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("File must be under 5MB."); return; }
    setError("");
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict`, { method: "POST", body: formData });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Server error"); }
      const data = await res.json();
      onResult(data);
    } catch (e) {
      setError(e.message || "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }, [onResult, setLoading]);

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Upload Skin Image</h2>
      <p style={{ color: "#64748b", fontSize: 13.5, marginBottom: 20 }}>
        Upload a clear image of the affected skin area to get AI-powered analysis.
      </p>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${dragOver ? "#2563eb" : "#cbd5e1"}`,
          borderRadius: 12, padding: "36px 20px", textAlign: "center",
          cursor: "pointer", background: dragOver ? "#eff6ff" : "#f8fafc",
          transition: "all .2s",
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ maxHeight: 160, borderRadius: 8, objectFit: "contain" }} />
        ) : (
          <>
            <div style={{ color: "#2563eb", width: 44, height: 44, margin: "0 auto 12px" }}><Icon.Upload /></div>
            <p style={{ color: "#475569", fontWeight: 500, marginBottom: 4 }}>Drag & Drop your image here</p>
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>or</p>
            <button style={{
              background: "#2563eb", color: "#fff", border: "none", borderRadius: 7,
              padding: "10px 28px", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>Choose File</button>
            <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 12 }}>Supported: JPG, PNG, JPEG (Max 5MB)</p>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])} />

      {error && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#fff1f1", borderRadius: 8, color: "#dc2626", fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 16, textAlign: "center", color: "#2563eb", fontWeight: 600 }}>
          <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>{" "}
          Analyzing image…
        </div>
      )}
    </div>
  );
}

// ── Prediction Result Panel ───────────────────────────────────────────────────
function PredictionPanel({ result }) {
  if (!result) return (
    <div style={{
      border: "1px solid #e2e8f0", borderRadius: 14, padding: 24,
      background: "#fff", minHeight: 320, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      color: "#94a3b8", gap: 10,
    }}>
      <div style={{ width: 48, height: 48, color: "#cbd5e1" }}><Icon.Info /></div>
      <p style={{ fontSize: 14 }}>Upload an image to see prediction results</p>
    </div>
  );

  const risk = RISK_CONFIG[result.risk] || RISK_CONFIG.LOW;

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 22, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Prediction Result</h3>
        <span style={{
          background: "#f0fdf4", color: "#16a34a", fontSize: 11.5,
          fontWeight: 600, padding: "4px 10px", borderRadius: 20, border: "1px solid #86efac",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}/>
          Analysis Complete
        </span>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {result.image_b64 && (
          <img
            src={`data:image/jpeg;base64,${result.image_b64}`}
            alt="analyzed"
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <p style={{ color: "#475569", fontSize: 12.5, marginBottom: 2 }}>Detected Disease:</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#dc2626", marginBottom: 6 }}>{result.disease}</p>
          <p style={{ fontSize: 13.5, color: "#0f172a", marginBottom: 12 }}>
            Confidence Score:{" "}
            <span style={{ color: "#16a34a", fontWeight: 700 }}>{result.confidence}%</span>
          </p>

          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: risk.bg, border: `1px solid ${risk.border}`,
            borderRadius: 8, padding: "8px 12px", marginBottom: 10,
          }}>
            <span style={{ width: 16, height: 16, color: risk.text }}><Icon.Alert /></span>
            <span style={{ fontWeight: 600, fontSize: 13, color: risk.text }}>Risk Level: {result.risk}</span>
          </div>

          <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>{result.description}</p>
        </div>
      </div>
    </div>
  );
}

// ── Disease Info Panel ────────────────────────────────────────────────────────
function DiseaseInfoPanel({ result }) {
  if (!result) return <EmptyState label="No disease analysis yet. Upload an image first." />;

  return (
    <section style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 22, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ color: "#2563eb", width: 18, height: 18 }}><Icon.Info /></span>
        <h3 style={{ fontWeight: 700, fontSize: 15.5 }}>Disease Information</h3>
      </div>
      <p style={{ color: "#475569", fontSize: 13.5, lineHeight: 1.6, marginBottom: 18 }}>{result.description}</p>

      <div style={{ display: "flex", gap: 12 }}>
        {[
          { icon: "👥", label: "Common In",  value: result.common_in },
          { icon: "💊", label: "Symptoms",   value: result.symptoms  },
          { icon: "✅", label: "Treatable",  value: result.treatable },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{
            flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0",
            borderRadius: 10, padding: "14px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div style={{ color: "#2563eb", fontWeight: 700, fontSize: 12.5, marginBottom: 5 }}>{label}</div>
            <div style={{ color: "#475569", fontSize: 12 }}>{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Medical & Medication Panel ────────────────────────────────────────────────
function MedicalPanel({ result }) {
  if (!result) return <EmptyState label="No analysis available. Upload an image first." />;

  return (
    <section style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 22, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ color: "#2563eb", width: 18, height: 18 }}><Icon.Pill /></span>
        <h3 style={{ fontWeight: 700, fontSize: 15.5 }}>Medical & Medication Advice</h3>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* What to do */}
        <div style={{ flex: 1, background: "#eff6ff", borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>🩺</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1e40af" }}>What You Should Do</span>
          </div>
          {result.what_to_do.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#16a34a", width: 15, height: 15, marginTop: 1, flexShrink: 0 }}><Icon.Check /></span>
              <span style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Medications */}
        <div style={{ flex: 1, background: "#faf5ff", borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 14 }}>💊</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#7c3aed" }}>Medication Advice*</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 10 }}>(To be taken only under doctor's guidance)</p>
          {result.medications.map((med, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 7, alignItems: "flex-start" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: 5 }}/>
              <span style={{ fontSize: 12.5, color: "#334155" }}>
                <strong>{med.type}:</strong> {med.name}
              </span>
            </div>
          ))}
          <p style={{ color: "#dc2626", fontSize: 11, marginTop: 10, fontStyle: "italic" }}>
            * Never self-medicate. Always consult a doctor.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Prevention Tips ───────────────────────────────────────────────────────────
function PreventionTips({ result }) {
  if (!result) return null;
  return (
    <section style={{
      border: "1px solid #bbf7d0", borderRadius: 14, padding: "16px 22px",
      background: "#f0fdf4",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ color: "#16a34a", width: 18, height: 18 }}><Icon.Shield /></span>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: "#15803d" }}>Prevention Tips</h3>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {result.prevention.map((tip, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ color: "#16a34a", width: 16, height: 16 }}><Icon.Check /></span>
            <span style={{ fontSize: 13, color: "#166534" }}>{tip}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── History Panel ─────────────────────────────────────────────────────────────
function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      setHistory(data);
    } catch {
      setHistory([]);
    } finally { setLoading(false); }
  }, []);

  useState(() => { fetchHistory(); }, []);

  const deleteRecord = async (id) => {
    await fetch(`${API_BASE}/history/${id}`, { method: "DELETE" });
    setHistory(h => h.filter(r => r.id !== id));
  };

  if (loading) return <div style={{ padding: 30, textAlign: "center", color: "#64748b" }}>Loading history…</div>;

  if (history.length === 0) return (
    <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
      <div style={{ width: 40, height: 40, margin: "0 auto 10px", color: "#cbd5e1" }}><Icon.History /></div>
      <p>No analysis history yet.</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Analysis History</h2>
        <button onClick={fetchHistory} style={{
          background: "#eff6ff", color: "#2563eb", border: "none",
          borderRadius: 7, padding: "6px 14px", fontSize: 12.5, cursor: "pointer", fontWeight: 600,
        }}>Refresh</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {history.map((rec) => {
          const risk = RISK_CONFIG[rec.risk] || RISK_CONFIG.LOW;
          return (
            <div key={rec.id} style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
              padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: "#eff6ff", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#2563eb", flexShrink: 0,
              }}><Icon.Info /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{rec.disease}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Confidence: <strong style={{ color: "#16a34a" }}>{rec.confidence}%</strong>
                  {" · "}
                  {new Date(rec.timestamp).toLocaleString()}
                </div>
              </div>
              <span style={{
                background: risk.bg, color: risk.text,
                border: `1px solid ${risk.border}`,
                borderRadius: 6, fontSize: 11.5, fontWeight: 700,
                padding: "3px 10px",
              }}>{rec.risk}</span>
              <button onClick={() => deleteRecord(rec.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#94a3b8", width: 18, height: 18, padding: 0,
              }}><Icon.Trash /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ label }) {
  return (
    <div style={{
      border: "1px solid #e2e8f0", borderRadius: 14, padding: 30,
      background: "#fff", textAlign: "center", color: "#94a3b8", fontSize: 13.5,
    }}>
      {label}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("upload");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResult = (data) => {
    setResult(data);
    // Auto-switch back to upload tab to see the full result
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active={active} setActive={setActive} />

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {/* Top bar */}
          <header style={{
            background: "#fff", borderBottom: "1px solid #e2e8f0",
            padding: "0 28px", height: 56, display: "flex",
            alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 20, height: 20, color: "#475569" }}><Icon.Menu /></span>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Skin Disease Detection System</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 13.5, fontWeight: 500 }}>
              <span style={{ width: 18, height: 18 }}><Icon.User /></span>
              User ▾
            </div>
          </header>

          {/* Page content */}
          <main style={{ padding: 28, flex: 1 }}>

            {/* Upload & Result view */}
            {active === "upload" && (
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                {/* Left column */}
                <div style={{ flex: "1 1 380px", minWidth: 300 }}>
                  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 24, marginBottom: 24 }}>
                    <UploadPanel onResult={handleResult} loading={loading} setLoading={setLoading} />
                  </div>

                  <DiseaseInfoPanel result={result} />
                </div>

                {/* Right column */}
                <div style={{ flex: "1 1 340px", minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
                  <PredictionPanel result={result} />
                  <MedicalPanel result={result} />
                </div>
              </div>
            )}

            {/* Standalone tabs */}
            {active === "disease" && (
              <div style={{ maxWidth: 820 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Disease Information</h2>
                <DiseaseInfoPanel result={result} />
                {result && <div style={{ marginTop: 20 }}><PreventionTips result={result} /></div>}
              </div>
            )}

            {active === "medical" && (
              <div style={{ maxWidth: 820 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Medical & Medication Advice</h2>
                <MedicalPanel result={result} />
              </div>
            )}

            {active === "history" && (
              <div style={{ maxWidth: 820 }}><HistoryPanel /></div>
            )}

            {/* Prevention + Disclaimer (upload tab) */}
            {active === "upload" && result && (
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <PreventionTips result={result} />
                <div style={{
                  border: "1px solid #bfdbfe", borderRadius: 12,
                  background: "#eff6ff", padding: "14px 20px", fontSize: 12.5, color: "#1e40af",
                }}>
                  <strong style={{ color: "#1e3a8a" }}>ℹ Disclaimer: </strong>
                  This AI prediction is for informational purposes only and not a substitute for professional medical
                  diagnosis. Please consult a qualified dermatologist.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}