import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PillButton from "./PillButton";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const isAuthed = Boolean(user);

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout?.();
    navigate("/");
  };

  return (
    <Navbar
      bg="transparent"
      variant="dark"
      expand="md"
      className="px-3"
      style={{ boxShadow: "none", backdropFilter: "blur(4px)" }}
    >
      <Container fluid className="px-2">
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-3 text-light"
          style={{ letterSpacing: "0.02em" }}
        >
          Nova CMS
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" className="navbar-toggle-clean d-md-none">
          <HugeiconsIcon icon={Menu01Icon} size={28} color="#e5e7eb" strokeWidth={2} />
        </Navbar.Toggle>
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/" className="text-light">
              Home
            </Nav.Link>
            {isAuthed && (
              <Nav.Link as={Link} to="/dashboard" className="text-light">
                Dashboard
              </Nav.Link>
            )}
            {!isAuthed && (
              <PillButton to="/login">Login</PillButton>
            )}
            {isAuthed && (
              <Nav.Link as={Link} to="/login" className="text-light" onClick={handleLogout}>
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
