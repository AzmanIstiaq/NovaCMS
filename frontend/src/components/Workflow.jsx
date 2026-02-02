const Workflow = ({ stages }) => (
  <div className="workflow mt-3">
    {stages.map((stage, idx) => (
      <div key={stage} className="workflow-step">
        <span className="workflow-node">{stage}</span>
        {idx < stages.length - 1 && <span className="workflow-line" aria-hidden />}
      </div>
    ))}
  </div>
);

export default Workflow;
