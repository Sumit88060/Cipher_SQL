import { useState, useEffect } from "react";
import AssignmentPanel from "./AssignmentPanel";
import Editor from '@monaco-editor/react';
import "./App.css";

const API = "http://localhost:4000";

export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sampleData, setSampleData] = useState([]);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);

  // load assignments
  useEffect(() => {
    fetch(`${API}/assignments`)
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(() => setError("Failed to load assignments"));
  }, []);

  // select assignment
  const handleSelect = (a) => {
    setSelected(a);
    setQuery("");
    setResult([]);
    setError("");
    setHint("");

    fetch(`${API}/sample-data`)
      .then(res => res.json())
      .then(data => setSampleData(data));
  };

  // run query
  const runQuery = async () => {
    setError("");
    setResult([]);
    setHint("");

    try {
      const res = await fetch(`${API}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.rows);
      } else {
        setError(data.error);
      }

    } catch {
      setError("Server error");
    }
  };

  // get hint
  const getHint = async () => {
    setHint("");
    setHintLoading(true);

    try {
      const res = await fetch(`${API}/hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selected.description,
          query,
          error
        })
      });

      const data = await res.json();
      setHint(data.hint);

    } catch {
      setHint("Could not load hint.");
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <div className="app">

      {/* Left */}
      <AssignmentPanel
        assignments={assignments}
        selected={selected}
        onSelect={handleSelect}
      />

      {/* Right */}
      <div className="main">

        {!selected && <p>Select an assignment</p>}

        {selected && (
          <>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>

            <h3>Sample Data</h3>
            {sampleData.length > 0 && (
              <table>
                <thead>
                  <tr>
                    {Object.keys(sampleData[0]).map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
{/* Write Qurey */}
            <h3>Write Query</h3>
           <Editor
              height="200px"
              language="sql"
              value={query}
               onChange={(value) => setQuery(value || '')}
            />
            <button onClick={runQuery}>Run</button>

            {error && <p className="error">{error}</p>}

            {/* Hint */}
            {error && (
              <>
                <button onClick={getHint} disabled={hintLoading}>
                  {hintLoading ? "Thinking..." : "💡 Get Hint"}
                </button>

                {hint && <div className="hint">💡 {hint}</div>}
              </>
            )}

            <h3>Result</h3>
            {result.length > 0 && (
              <table>
                <thead>
                  <tr>
                    {Object.keys(result[0]).map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

      </div>
    </div>
  );
}
