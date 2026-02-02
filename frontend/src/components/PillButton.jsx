import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PillButton = ({ to, children, variant = "primary", className = "" }) => (
  <Button
    as={Link}
    to={to}
    variant={variant}
    className={`pill-btn ${className}`.trim()}
  >
    {children}
  </Button>
);

export default PillButton;
