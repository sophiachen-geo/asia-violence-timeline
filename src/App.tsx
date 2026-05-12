// @ts-expect-error  the timeline file is .jsx without explicit types
import AsiaViolenceTimeline from './asia_violence_timeline.jsx';
// @ts-expect-error  Convergence is .jsx without explicit types
import Convergence from './Convergence.jsx';

// Side-by-side routing via the ?view= query parameter.
//   default          → After Empire essay + timeline
//   ?view=convergence → Convergence dashboard / map / grid
function getView(): 'essay' | 'convergence' {
  if (typeof window === 'undefined') return 'essay';
  const view = new URLSearchParams(window.location.search).get('view');
  return view === 'convergence' ? 'convergence' : 'essay';
}

export default function App() {
  const view = getView();
  return view === 'convergence' ? <Convergence /> : <AsiaViolenceTimeline />;
}
