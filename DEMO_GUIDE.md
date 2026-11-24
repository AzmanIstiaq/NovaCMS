# NovaCMS 60–90 second demo

## Preparation

Use a disposable local or demo database—never production data. Prepare three accounts: one admin, one editor, and one viewer. Create a short editor draft named **Quarterly Product Update** with at least ten characters of body content. Keep browser password managers and developer secrets out of the recording.

## Recording sequence

**0–10 seconds — Position the product:** Open the public home page and say: “NovaCMS is a role-based publishing workflow for teams that separate writing, review, and publishing.” Show that only published posts appear publicly.

**10–25 seconds — Authenticate as editor:** Log in as the editor. Open the dashboard, create or open the prepared draft, make a visible content change, and submit it for review. Point out that the editor can manage their own content but has no publish or user-management control.

**25–50 seconds — Approve as admin:** Log out, log in as admin, and open the dashboard. Show the post in the Review group and publish it. Briefly open Users to show role and ban controls, without changing the current admin's own account.

**50–65 seconds — Verify public lifecycle:** Log out or open the public Posts page. Open the newly published article by its slug. State that draft and review content is excluded from public queries.

**65–80 seconds — Demonstrate permission boundary:** Log in as viewer. Show that the viewer lands on public posts and cannot access content creation, the editorial dashboard, or user management. Close with: “The API rechecks database roles and bans on every protected request.”

## Screenshot checklist

- Public landing page with published content
- Editor dashboard with Draft and Review groups
- Admin review queue with Publish action
- Admin Users page with roles and account status
- Published article detail page
- Optional: viewer navigation showing read-only access

Capture all images at the same viewport, hide personal bookmarks and tokens, use fictional content, and avoid showing `.env`, database connection strings, browser storage, or real email addresses.

## Recording checklist

- Reset the demo post to draft before each take
- Confirm `CORS_ORIGIN` and `REACT_APP_API_BASE_URL` target the demo environment
- Verify all three accounts before recording
- Keep browser zoom and viewport consistent
- Remove loading pauses from the final cut, but do not fake results
- Replace the README screenshots with the final current-state set
