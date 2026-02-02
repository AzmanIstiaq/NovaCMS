import { Card as BsCard } from "react-bootstrap";

const Card = ({
  title,
  subtitle,
  headerRight,
  footer,
  children,
  className = "",
  onTitleClick,
}) => {
  return (
    <BsCard className={`mb-3 rounded-3 shadow-sm ${className}`}>
      {(title || headerRight) && (
        <BsCard.Header className="d-flex align-items-center justify-content-between bg-transparent border-0 pb-0">
          <div>
            {title && (
              <BsCard.Title
                as="div"
                className={`fw-semibold mb-1 ${onTitleClick ? "clickable" : ""}`}
                onClick={onTitleClick}
              >
                {title}
              </BsCard.Title>
            )}
            {subtitle && (
              <BsCard.Subtitle className="text-muted" as="div">
                {subtitle}
              </BsCard.Subtitle>
            )}
          </div>
          {headerRight}
        </BsCard.Header>
      )}

      <BsCard.Body className="pt-3">{children}</BsCard.Body>

      {footer && (
        <BsCard.Footer className="bg-transparent border-0 pt-0 d-flex gap-2 flex-wrap">
          {footer}
        </BsCard.Footer>
      )}
    </BsCard>
  );
};

export default Card;
