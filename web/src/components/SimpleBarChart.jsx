export default function SimpleBarChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bar-chart">
      {data.map((item, index) => (
        <div key={index} className="bar-chart-column">
          <div className="bar-chart-track">
            <div className="bar-chart-fill" style={{ height: `${Math.max(item.value, 4)}%` }} />
          </div>
          <span className="bar-chart-value">{item.value}%</span>
          <span className="bar-chart-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
