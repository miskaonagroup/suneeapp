import Image from "next/image";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="desktop-sidebar" aria-label="Desktop navigation">
        <div className="desktop-brand">
          <span className="brand-logo">
            <Image src="/icon/icon-sunee.png" alt="" width={42} height={42} />
          </span>
          <strong>Sunee</strong>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <span className="brand-logo">
            <Image src="/icon/icon-sunee.png" alt="" width={42} height={42} />
          </span>
          SUNEE MEMBER
        </header>
        {children}
      </main>
    </div>
  );
}

