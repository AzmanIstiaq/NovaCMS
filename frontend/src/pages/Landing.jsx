import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Section from "../components/Section";
import InfoCard from "../components/InfoCard";
import RoleCard from "../components/RoleCard";
import Workflow from "../components/Workflow";
import FeatureList from "../components/FeatureList";
import PillButton from "../components/PillButton";
import { useAuth } from "../auth/AuthContex";
import { apiFetch } from "../api";
import {
  HomeIcon,
  Notification03Icon,
  SearchIcon,
  UserIcon,
  SunIcon,
} from "@hugeicons/core-free-icons";

const Landing = () => {
  const { user } = useAuth();
  const isAuthed = Boolean(user);
  const navigate = useNavigate();
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [postsError, setPostsError] = useState("");
  const latestPosts = publishedPosts.slice(0, 4);
  const hasMorePosts = publishedPosts.length > 4;

  // Keep card heights consistent by capping displayed words
  const truncateWords = (text = "", maxWords = 6) => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return text;
    return `${words.slice(0, maxWords).join(" ")}...`;
  };

  useEffect(() => {
    const loadPublishedPosts = async () => {
      try {
        const data = await apiFetch("/posts");
        setPublishedPosts(data.posts || data);
      } catch (err) {
        setPostsError(err.message || "Failed to load posts");
      }
    };
    loadPublishedPosts();
  }, []);

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
              {isAuthed ? (
                <PillButton to="/dashboard">Launch Dashboard</PillButton>
              ) : (
                <PillButton to="/login">Get Started</PillButton>
              )}
              <Button as={Link} to="/posts" variant="link" className="text-light">
                View Public Content
              </Button>
              <div className="cta-chip" aria-hidden />
            </div>
          </div>

        </div>
      </section>

      <main className="landing-main">
        <Section title="A CMS designed for real workflows" className="section-panel">
          <div className="info-grid mt-3">
            <InfoCard
              icon={HomeIcon}
              title="Structured Publishing"
              text="Create, edit, and manage content with enforced structure and clear ownership."
            />
            <InfoCard
              icon={Notification03Icon}
              title="Editorial Workflow"
              text="Draft -> Review -> Publish. Every piece moves through a controlled lifecycle."
            />
            <InfoCard
              icon={SearchIcon}
              title="SEO-Ready Delivery"
              text="Clean URLs, metadata-friendly structure, and public delivery optimized for search."
            />
          </div>
        </Section>

        <Section title="Built for teams, not just users" className="section-alt section-panel">
          <div className="role-grid mt-3">
            <RoleCard icon={UserIcon} title="Author" text="Write and edit drafts, submit content for review." />
            <RoleCard icon={Notification03Icon} title="Editor" text="Review submissions, publish content, maintain quality." />
            <RoleCard icon={SunIcon} title="Admin" text="Manage users, permissions, and system governance." />
          </div>
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

        <Section title="Latest Published Posts" className="section-panel">
          {postsError ? (
            <p style={{ color: "red" }}>{postsError}</p>
          ) : publishedPosts.length === 0 ? (
            <p className="muted">No published posts available.</p>
          ) : (
            <div className="cards-stack">
              {latestPosts.map((post) => (
                <div
                  key={post._id}
                  className="card-dark clickable"
                  onClick={() => navigate(`/post/${post.slug}`)}
                >
                  <div className="card-header">
                    <h3 className="card-title line-clamp-1">
                      {truncateWords(post.title || "Untitled", 6)}
                    </h3>
                    <span className={`status-badge status-${post.status}`}>
                      {post.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="card-subtitle">By {post.author?.name || 'Unknown'}</p>
                    <p className="card-text line-clamp-1">
                      {truncateWords(post.content || "", 20)}
                    </p>
                  </div>
                  <div className="card-footer">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post.slug}`);
                      }}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {hasMorePosts && (
            <div className="mt-3 text-center">
                            <Button
                as={Link}
                to="/posts"
                variant="link"
                className="text-light link-underline"
              >
                View all posts &rarr;
              </Button>
            </div>
          )}
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

