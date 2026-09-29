import { ArrowRight, RotateCcw } from 'lucide-react';

export default function Maintenance404() {
  return (
    <div className="maintenance-page">
      <div className="maintenance-window">
        <header className="maintenance-browserbar">
          <div className="maintenance-dots" aria-hidden="true">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="maintenance-browser-title">
            <strong>IIoT LABORATORY</strong><span> — </span><b>RECORDS</b>
          </div>
          <div className="maintenance-address">iiot-laboratory / 404</div>
        </header>

        <main className="maintenance-content">
          <section className="maintenance-art" aria-label="404 illustration">
            <div className="wind wind-one" />
            <div className="wind wind-two" />
            <div className="four four-left">4</div>
            <div className="four four-right">4</div>

            <div className="paper-person">
              <div className="paper-head">
                <span className="paper-eye left" />
                <span className="paper-eye right" />
                <span className="paper-mouth" />
              </div>
              <div className="paper-body">
                <div className="paper-inner" />
              </div>
              <span className="paper-arm arm-left" />
              <span className="paper-arm arm-right" />
            </div>

            <div className="ground-line" />
            <div className="ground-mark mark-one" />
            <div className="ground-mark mark-two" />
            <div className="ground-mark mark-three" />
          </section>

          <section className="maintenance-copy">
            <div className="error-label"><span /> ERROR 404 <span /></div>
            <h1>Page not found</h1>
            <p>Our laboratory is taking a short break while we update the records.</p>
            <div className="back-soon">WE WILL BE BACK SOON</div>

            <div className="maintenance-actions">
              <button onClick={() => { window.location.href = '/'; }} className="take-home">
                Return to laboratory <ArrowRight size={17} strokeWidth={2.2} />
              </button>
            </div>
          </section>
        </main>
      </div>

      <div className="maintenance-footer">
        <RotateCcw size={12} /> Laboratory systems are temporarily offline for updates.
      </div>
    </div>
  );
}
