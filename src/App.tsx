// @ts-expect-error  the timeline file is .jsx without explicit types
import AsiaViolenceTimeline from './asia_violence_timeline.jsx';
// @ts-expect-error  Convergence is .jsx without explicit types
import Convergence from './Convergence.jsx';

// Side-by-side routing via the ?view= query parameter.
//   default            → Convergence dashboard / map / grid (the default view)
//   ?view=database     → After Empire essay + timeline
//   ?view=convergence  → kept as an alias of the default for backward compat
function getView(): 'database' | 'convergence' {
  if (typeof window === 'undefined') return 'convergence';
  const view = new URLSearchParams(window.location.search).get('view');
  return view === 'database' ? 'database' : 'convergence';
}

export default function App() {
  const view = getView();
  return view === 'database' ? <AsiaViolenceTimeline /> : <Convergence />;
}
