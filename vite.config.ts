import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ============================================================
// GITHUB PAGES BASE PATH
//
// For a project page at https://<user>.github.io/<repo>/
//   set BASE to '/<repo>/'   (note the leading and trailing slash)
//
// For a user/org site at https://<user>.github.io/
//   set BASE to '/'
//
// Change this string to your actual repository name before
// pushing. The default below assumes a repo named
// 'asia-violence-timeline'.
// ============================================================
const BASE = '/asia-violence-timeline/';

export default defineConfig({
  plugins: [react()],
  base: BASE,
});
