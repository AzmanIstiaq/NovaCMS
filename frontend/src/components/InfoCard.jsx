import { HugeiconsIcon } from "@hugeicons/react";

const InfoCard = ({ title, text, icon }) => (
  <div className="info-card">
    {icon && (
      <div className="card-icon" aria-hidden="true">
        <HugeiconsIcon icon={icon} size={36} color="#dce7ff" strokeWidth={1.8} />
      </div>
    )}
    <div className="card-body-text">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  </div>
);

export default InfoCard;
