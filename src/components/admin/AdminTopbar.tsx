import { PanelLeft, Search, ShieldCheck } from "lucide-react";

type Props = { query: string; onQuery: (value: string) => void; onSearchFocus?: () => void; onDashboard: () => void };

export function AdminTopbar({ query, onQuery, onSearchFocus, onDashboard }: Props) {
  return (
    <header className="av7-topbar">
      <div className="av7-brand">
        <div className="av7-logo"><ShieldCheck size={19} /></div>
        <div className="av7-brand-text"><p>IIoT Laboratory</p><h1>Command Center</h1></div>
      </div>
      <label className="av7-search">
        <Search size={16} />
        <input value={query} onChange={(e) => onQuery(e.target.value)} onFocus={onSearchFocus} placeholder="Search experiments, students, actions…" />
        <kbd>⌘ K</kbd>
      </label>
      <div className="av7-topbar-right">
        <span className="av7-live"><i /> <b>System live</b></span>
        <button type="button" onClick={onDashboard} className="av7-ghost-btn"><PanelLeft size={15} /> <span>Dashboard</span></button>
      </div>
    </header>
  );
}
