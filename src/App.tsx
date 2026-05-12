// @ts-expect-error  the timeline file is .jsx without explicit types
import AsiaViolenceTimeline from './asia_violence_timeline.jsx';

// The After Empire essay is the only top-level route. Inside Part I
// of the essay, the user can toggle between the Convergence view
// (default) and the Database view; both render against the same
// EVENTS catalogue.
export default function App() {
  return <AsiaViolenceTimeline />;
}
