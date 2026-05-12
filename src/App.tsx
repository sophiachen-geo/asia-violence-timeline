// This branch (main) intentionally contains only a placeholder page.
// The full project lives on the `icrc-alignment` branch, which is not
// auto-deployed. When the project is republished, the deployment will
// move back to main.

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0e1118',
        color: '#f1ead9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Cormorant Garamond, Georgia, serif',
      }}
    >
      <main
        style={{
          maxWidth: '520px',
          textAlign: 'center',
          lineHeight: 1.55,
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#b8956a',
            marginBottom: '2rem',
            textTransform: 'uppercase',
          }}
        >
          ✦ &nbsp; A QUIET PAUSE &nbsp; ✦
        </div>

        <h1
          style={{
            fontSize: 'clamp(34px, 6vw, 52px)',
            fontWeight: 500,
            margin: '0 0 1.25rem',
            lineHeight: 1.05,
          }}
        >
          Hello.
        </h1>

        <p
          style={{
            fontSize: 'clamp(17px, 2.4vw, 21px)',
            fontStyle: 'italic',
            color: 'rgba(241, 234, 217, 0.85)',
            margin: '0 0 1rem',
          }}
        >
          This little project is being thoughtfully reworked behind the scenes.
        </p>

        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: 'rgba(241, 234, 217, 0.7)',
            margin: 0,
          }}
        >
          Please come back soon &mdash; there will be more to read then.
        </p>

        <div
          style={{
            marginTop: '3rem',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'rgba(241, 234, 217, 0.35)',
          }}
        >
          ✦
        </div>
      </main>
    </div>
  );
}
