import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import "./admin-v7.css";

type Props = {
  topbar: ReactNode;
  sidebar: ReactNode;
  inspector: ReactNode;
  overlay?: ReactNode;
  children: ReactNode;
};

/** Three-column shell: [rail] [flexible workspace] [fixed-width inspector]. */
export function AdminLayout({ topbar, sidebar, inspector, overlay, children }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="av7 admin-workspace">
        <div className="av7-topbar-slot">{topbar}</div>
        <div className="av7-grid">
          <div className="av7-sidebar-slot">{sidebar}</div>
          <main className="av7-main">{children}</main>
          <div className="av7-inspector-slot">{inspector}</div>
        </div>
        {overlay}
      </section>
    </MotionConfig>
  );
}
