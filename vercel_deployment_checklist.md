# Vercel Deployment Checklist

This checklist provides a step-by-step guide to systematically verify Vercel build log cleanliness and route hydration for QuickDischarge 2.0.

## 1. Pre-Deployment Preparation
- [ ] Ensure all code changes are committed and pushed to the deployment branch.
- [ ] Verify that the `pre-push` git hook successfully passed locally (i.e., `npm run lint` and `npm run build` in the `web/` directory completed without errors).

## 2. Vercel Build Log Verification
- [ ] Navigate to the project dashboard on Vercel.
- [ ] Go to the **Deployments** tab and click on the latest deployment.
- [ ] Open the **Build Logs**.
- [ ] Check for any warnings or errors during the `Install Command` phase (e.g., package resolution issues or deprecated dependencies).
- [ ] Check for any warnings or errors during the `Build Command` (`npm run build`).
- [ ] Ensure that no unexpected errors or hydration warnings were logged during static generation or server-side rendering phases.
- [ ] Confirm the deployment status says **Ready**.

## 3. Route Hydration and Functional Testing
- [ ] Open the deployed application URL in an incognito/private browsing window.
- [ ] Open the browser Developer Tools and switch to the **Console** tab.
- [ ] **Hydration Check:** Ensure there are no hydration mismatch warnings (e.g., "Text content does not match server-rendered HTML") in the console.
- [ ] **Route Navigation Check:** Click through the main navigation routes to verify client-side routing works smoothly without throwing console errors or causing full page reloads.
- [ ] **Functional Verification:** Test core app functionality to ensure API endpoints and serverless functions respond correctly without 500 errors.

## 4. Post-Deployment
- [ ] If any errors or hydration warnings are discovered, investigate locally, fix, and trigger a new deployment.
- [ ] If critical issues are found, consider reverting to a previous successful deployment until the fix is ready.
