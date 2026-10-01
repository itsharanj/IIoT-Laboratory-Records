import { FormEvent, useMemo, useRef, useState } from 'react';
import { Check, Eye, EyeOff, Mail, ArrowRight, LoaderCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const buttonAreaRef = useRef<HTMLDivElement>(null);

  const validEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const validPassword = password.length >= 8;
  const ready = validEmail && validPassword;

  const moveButton = () => {
    if (ready || loading) return;
    const area = buttonAreaRef.current;
    if (!area) return;
    const maxX = Math.max(0, Math.min(74, (area.clientWidth - 112) / 2));
    const maxY = 9;
    const x = Math.round((Math.random() * 2 - 1) * maxX);
    const y = Math.round((Math.random() * 2 - 1) * maxY);
    setButtonOffset({ x, y });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validEmail || !validPassword) {
      setMessage('Please enter a valid email and a password with at least 8 characters.');
      return;
    }
    if (!supabase) return;
    setLoading(true);
    setMessage('');
    const result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (result.error) setMessage(result.error.message);
  };

  return (
    <div className="runaway-auth-page">
      

      <div className="runaway-browser">
        <div className="traffic"><i className="r"/><i className="y"/><i className="g"/></div>
        <div className="runaway-browser-center">TETHER — <span className="pink">HTML</span> <span className="blue">CSS</span> <span className="yellow">JS</span></div>
        <div className="runaway-browser-right">localhost / login</div>
      </div>

      <main className="runaway-main">
        <div className="runaway-meta">IIOT LABORATORY · ADMIN LOGIN</div>
        <h1 className="runaway-title">ADMIN <span className="teal">LOGIN</span></h1>

        <section className="runaway-card">
          <div className="tether"><span className="tether-mark"/>TETHER</div>
          <h2 className="signin-heading">Administrator access</h2>
          <p className="signin-copy">Welcome back. Two fields stand between you and that button.</p>

          <form className="runaway-form" onSubmit={submit} noValidate>
            <div className="field">
              <div className="field-row"><label htmlFor="admin-email">Email</label></div>
              <div className={`input-wrap ${validEmail ? 'valid' : ''}`}>
                <Mail size={16}/>
                <input id="admin-email" type="email" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setMessage(''); }} placeholder="you@studio.com" />
                {validEmail && <span className="valid-check"><Check size={11}/></span>}
              </div>
            </div>

            <div className="field">
              <div className="field-row"><label htmlFor="admin-password">Password</label><a className="forgot" href="#" onClick={e => e.preventDefault()}>Forgot?</a></div>
              <div className={`input-wrap ${validPassword ? 'valid' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => { setPassword(e.target.value); setMessage(''); }} placeholder="At least 8 characters" />
                <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
              </div>
            </div>

            <div ref={buttonAreaRef} className="runaway-zone" onMouseMove={moveButton} onFocusCapture={e => { if (!ready && e.target === e.currentTarget) moveButton(); }}>
              <div className="target-ring"/>
              <button type="submit" disabled={loading} className={`runaway-button ${ready ? 'ready' : ''}`} style={{ transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)` }}>
                {loading ? <LoaderCircle size={14} className="animate-spin"/> : 'Log in'}
              </button>
            </div>

            <div className="helper">
              <span className="helper-dot">●</span>
              {!ready ? 'Two fields to fill before it lands still.' : <>One to go — it is slowing down. <span className="key">Tab</span> reaches it. <span className="key">Enter</span> submits.</>}
            </div>
            {message && <div className="error">{message}</div>}
          </form>

          <div className="card-divider"/>
          <p className="create">No account yet? <span>Create one</span></p>
        </section>
        <div className="runaway-bottom">FINE POINTER ONLY · TAB + ENTER ALWAYS WORK · ZERO DEPENDENCIES</div>
      </main>
    </div>
  );
}
