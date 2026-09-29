import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export default function Maintenance404() {
  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.reload();
  };

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
            <strong>IIoT</strong><span> — </span><b>LAB</b><i> · RECORD</i>
          </div>
          <div className="maintenance-address">iiot-laboratory / soon</div>
        </header>

        <main className="maintenance-content">
          <section className="maintenance-art" aria-label="404 illustration">
            <div className="wind wind-one" />
            <div className="wind wind-two" />
            <div className="four four-left">4</div>
            <div className="four four-right">4</div>
            <div className="paper-person">
              <div className="paper-head">
                <span className="paper-eye left" /><span className="paper-eye right" />
                <span className="paper-mouth" />
              </div>
              <div className="paper-body">
                <div className="paper-inner" />
              </div>
              <span className="paper-arm arm-left" />
              <span className="paper-arm arm-right" />
            </div>
            <div className="rope rope-one" />
            <div className="rope rope-two" />
            <div className="ground-line" />
            <div className="ground-mark mark-one" />
            <div className="ground-mark mark-two" />
            <div className="ground-mark mark-three" />
          </section>

          <section className="maintenance-copy">
            <div className="error-label"><span /> ERROR 404 <span /></div>
            <h1>Page not found</h1>
            <p>Nothing at this address but the wind.</p>
            <div className="back-soon">WE WILL BE BACK SOON</div>
            <div className="maintenance-actions">
              <button onClick={() => window.location.href = '/'} className="take-home">
                Take me home <ArrowRight size={17} strokeWidth={2.2} />
              </button>
              <button onClick={goBack} className="go-back">
                <ArrowLeft size={15} /> Go back
              </button>
            </div>
          </section>
        </main>

        <section className="maintenance-code-row" aria-hidden="true">
          <CodeCard color="pink" title="index.html">
            <span className="code-comment">&lt;!-- the drawing, then words --&gt;</span>
            <span><em>&lt;figure</em> className="art"<em>&gt;</em></span>
            <span className="indent"><em>&lt;div</em> className="error_art"<em>&gt;</em></span>
            <span className="indent-two">404</span>
            <span className="indent"><em>&lt;/div&gt;</em></span>
            <span><em>&lt;/figure&gt;</em></span>
          </CodeCard>
          <CodeCard color="blue" title="style.css">
            <span className="code-comment">/* words carry the entrance, */</span>
            <span className="code-comment">/* letters carry the wind */</span>
            <span><em>.copy_title</em> &#123;</span>
            <span className="indent">display: inline-block;</span>
            <span className="indent">letter-spacing: .02em;</span>
            <span>&#125;</span>
          </CodeCard>
          <CodeCard color="yellow" title="app.js">
            <span className="code-comment">// the drawing's own gusts,</span>
            <span className="code-comment">// read off the frame</span>
            <span><em>const</em> gust = getWind();</span>
            <span><em>for</em> (const letter of title) &#123;</span>
            <span className="indent">letter.style.transform = gust;</span>
            <span>&#125;</span>
          </CodeCard>
        </section>
      </div>
      <div className="maintenance-footer"><RotateCcw size={12} /> Laboratory systems are taking a short break.</div>
    </div>
  );
}

function CodeCard({ color, title, children }: { color: 'pink' | 'blue' | 'yellow'; title: string; children: ReactNode }) {
  return (
    <div className="code-card">
      <div className="code-card-title"><span className={`code-dot ${color}`} />{title}</div>
      <div className="code-lines">{children}</div>
    </div>
  );
}
