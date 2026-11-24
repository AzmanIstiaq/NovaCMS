# NovaCMS case study

## Business problem

Small content teams often outgrow shared documents before they need a large enterprise CMS. They need contributors to prepare content without being able to publish it, administrators to control access, and a public channel that never exposes unfinished work.

NovaCMS targets that gap. Its intended users are editors producing articles, administrators approving and publishing them, and public readers consuming approved content.

## Solution

NovaCMS separates the public reading experience from an authenticated management workspace. Editors own their drafts and submit them for review. Administrators see the complete queue, publish reviewed posts, and manage user roles and account status. Viewers can browse published content without receiving editorial access.

The application uses a React client, an Express REST API, and MongoDB through Mongoose. JWTs provide stateless authentication, while every protected request reloads the user record to enforce current roles and bans. Passwords are stored only as bcrypt hashes.

## Engineering decisions

- **Server-side authorisation:** route guards and post ownership checks are enforced by the API; client-side controls are usability aids only.
- **Explicit state transitions:** general content updates cannot change workflow status. Dedicated endpoints implement submit, publish, unpublish, archive, and restore actions.
- **Least privilege:** editors cannot read or modify another editor's private posts. Publishing and unpublishing are admin-only.
- **Operational configuration:** startup rejects a missing or weak JWT secret, JWTs expire by default, request bodies are size-limited, and CORS is configured by environment.
- **Dependency restraint:** workflow tests use Node's built-in test runner rather than adding a test framework.

## Technical challenges

The original content update endpoint accepted arbitrary status changes, which let normal editing bypass the review workflow. Editor checks also treated every editor as a manager of every post. The fix extracted ownership and transition rules into a small policy module, used it in controllers, and mirrored it in frontend action visibility. This made the permission matrix directly testable.

Authentication state also differed between a fresh login and a page refresh: the login path retained only the role, so ownership-aware UI could not identify the author. The client now stores the complete non-sensitive user response and uses HTTP status codes on API errors instead of parsing error text.

## Verified result

Repository verification confirms five backend policy tests pass, one database-backed API integration test passes against a disposable MongoDB instance, two frontend permission tests pass, and the optimized React production build compiles successfully. These results validate key workflows and buildability, not production scale or uptime. No commercial performance, customer, revenue, or usage metrics are claimed.

## Limitations and next steps

The strongest next testing investment would be browser-level end-to-end coverage and additional API cases for role changes, invalid payloads, and concurrent slug creation. Production hardening would also move tokens to secure HttpOnly cookies, replace instance-local login throttling, add an auditable admin bootstrap process, and introduce revision history and audit events. The Create React App toolchain should be migrated rather than force-patching its remaining transitive audit findings.

## Commercial relevance

NovaCMS demonstrates patterns shared by internal business systems: identity, role matrices, record ownership, approval gates, status transitions, administrative controls, validation, and deployment configuration. The same engineering approach applies to document approval, inventory operations, case management, onboarding, and other workflow-driven client applications.
