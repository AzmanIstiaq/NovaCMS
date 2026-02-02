import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import InfoCard from "../components/InfoCard";
import RoleCard from "../components/RoleCard";
import Workflow from "../components/Workflow";
import FeatureList from "../components/FeatureList";
import PillButton from "../components/PillButton";
import {
  HomeIcon,
  Notification03Icon,
  SearchIcon,
  UserIcon,
  SunIcon,
} from "@hugeicons/core-free-icons";

const Landing = () => {
  return (
    <div className="landing">
      <section className="hero landing-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="glass-card" aria-hidden="true">
          <div className="glass-overlay"></div>
          <div className="arc-stack">
            <div className="arc arc-blue"></div>
            <div className="arc arc-purple"></div>
            <div className="arc arc-white"></div>
          </div>
        </div>

        <div className="hero-shell">
          <div className="hero-content">
            <span className="eyebrow eyebrow-pill">Role-based content platform</span>
            <h1 className="hero-title-xl">
              Content management, built for clarity and control.
            </h1>
            <p className="hero-sub">
              Nova CMS is a role-based publishing platform designed for structured workflows,
              editorial oversight, and SEO-ready delivery.
            </p>

            <div className="hero-actions">
              <PillButton to="/dashboard">Launch Dashboard</PillButton>
              <Button as={Link} to="/post/my-first-post" variant="link" className="text-light">
                View Public Content
              </Button>
              <div className="cta-chip" aria-hidden />
            </div>
          </div>

        </div>
      </section>

      <main className="landing-main">
        <Section title="A CMS designed for real workflows" className="section-panel">
          <Row className="g-4 mt-3">
            <Col md={4}>
              <InfoCard
                icon={HomeIcon}
                title="Structured Publishing"
                text="Create, edit, and manage content with enforced structure and clear ownership."
              />
            </Col>
            <Col md={4}>
              <InfoCard
                icon={Notification03Icon}
                title="Editorial Workflow"
                text="Draft -> Review -> Publish. Every piece moves through a controlled lifecycle."
              />
            </Col>
            <Col md={4}>
              <InfoCard
                icon={SearchIcon}
                title="SEO-Ready Delivery"
                text="Clean URLs, metadata-friendly structure, and public delivery optimized for search."
              />
            </Col>
          </Row>
        </Section>

        <Section title="Built for teams, not just users" className="section-alt section-panel">
          <Row className="g-4 mt-3">
            <Col md={4}>
              <RoleCard icon={UserIcon} title="Author" text="Write and edit drafts, submit content for review." />
            </Col>
            <Col md={4}>
              <RoleCard icon={Notification03Icon} title="Editor" text="Review submissions, publish content, maintain quality." />
            </Col>
            <Col md={4}>
              <RoleCard icon={SunIcon} title="Admin" text="Manage users, permissions, and system governance." />
            </Col>
          </Row>
        </Section>

        <Section title="A clear content lifecycle" className="section-panel section-compact">
          <Workflow stages={["Draft", "Review", "Published", "Archived"]} />
        </Section>

        <Section title="Feature highlights" className="section-alt section-panel">
          <Row className="g-4 mt-2 align-items-stretch">
            <Col md={6}>
              <FeatureList
                items={[
                  "Role-based dashboards",
                  "Secure authentication",
                  "Editorial moderation",
                  "Public content delivery",
                  "Clean API-driven architecture",
                  "SEO-friendly metadata model",
                  "Auditable publishing trail",
                  "Granular permissions",
                ]}
              />
            </Col>
            <Col md={6}>
              <InfoCard
                icon={Notification03Icon}
                title="Operational confidence"
                text="Tighten governance with access tiers, built-in review steps, and clear ownership before anything goes live."
              />
            </Col>
          </Row>
        </Section>

        <Section className="final-cta section-panel section-cta">
          <div className="d-flex flex-column align-items-center text-center gap-3 cta-stack">
            <div>
              <h2 className="section-title mb-2">Build and manage content with confidence.</h2>
              <p className="muted mb-0">Launch Nova CMS and keep your workflows clear, secure, and searchable.</p>
            </div>
            <div className="cta-right mt-1">
              <PillButton to="/login" className="cta-button large">Get Started</PillButton>
            </div>
          </div>
        </Section>
      </main>

      <footer className="footer">
        <Container className="d-flex justify-content-center">
          <span className="muted">{'\u00a9'} Nova CMS {new Date().getFullYear()}</span>
        </Container>
      </footer>
    </div>
  );
};

export default Landing;
