const FeatureList = ({ items }) => (
  <div className="feature-list">
    {items.map((item) => (
      <div key={item} className="feature-item">
        <span className="feature-dot" aria-hidden />
        <span className="feature-text">{item}</span>
      </div>
    ))}
  </div>
);

export default FeatureList;
