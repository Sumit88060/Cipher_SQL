export default function AssignmentPanel({ assignments, selected, onSelect }) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Assignments</h3>

      <div className="assignment-list">
        {assignments.map(a => (
          <div
            key={a.id}
            onClick={() => onSelect(a)}
            className={`assignment-card ${selected?.id === a.id ? "active" : ""}`}
          >
            <div className="assignment-title">{a.title}</div>
            <div className="assignment-difficulty">{a.difficulty}</div>
          </div>
        ))}
      </div>
    </div>
  );
}