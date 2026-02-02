import React from "react";
import { Container } from "react-bootstrap";

const Section = ({ title, className = "", children }) => (
  <section className={`section ${className}`.trim()}>
    <Container>
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </Container>
  </section>
);

export default Section;
