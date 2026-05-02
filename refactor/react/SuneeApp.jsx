import React, { useMemo, useState } from "react";
import { createDemoServices } from "../js/core.js";

export function SuneeApp() {
  const services = useMemo(() => createDemoServices(), []);
  const [screen, setScreen] = useState("home");
  const [wallets, setWallets] = useState(services.points.listWallets());
  const [coupons, setCoupons] = useState(services.coupons.list());

  function refresh() {
    setWallets([...services.points.listWallets()]);
    setCoupons([...services.coupons.list()]);
  }

  return (
    <AppShell screen={screen} onNavigate={setScreen}>
      {screen === "home" && (
        <HomeScreen
          wallets={wallets}
          coupons={coupons}
          onCollect={(id) => {
            services.coupons.collect(id);
            refresh();
          }}
        />
      )}

      {screen === "points" && (
        <PointListScreen
          wallets={wallets}
          onRedeem={(walletId) => {
            services.points.redeem({ walletId, amount: 100, note: "Demo redeem" });
            refresh();
          }}
        />
      )}
    </AppShell>
  );
}

function AppShell({ screen, onNavigate, children }) {
  const nav = [
    ["home", "Home"],
    ["points", "My Point"],
    ["scanner", "Scanner"],
    ["coupons", "Coupons"],
    ["profile", "Profile"]
  ];

  return (
    <div className="sunee-app">
      <aside className="desktop-sidebar">
        <strong>Sunee</strong>
        {nav.map(([key, label]) => (
          <button
            key={key}
            className={screen === key ? "active" : ""}
            onClick={() => onNavigate(key)}
          >
            {label}
          </button>
        ))}
      </aside>

      <main className="app-body">
        <header className="app-header">SUNEE MEMBER</header>
        {children}
      </main>
    </div>
  );
}

function HomeScreen({ wallets, coupons, onCollect }) {
  return (
    <section>
      <h1>Welcome back</h1>
      <PointSummary wallets={wallets} />
      <CouponStrip coupons={coupons} onCollect={onCollect} />
    </section>
  );
}

function PointSummary({ wallets }) {
  return (
    <div className="point-summary">
      {wallets.map(wallet => (
        <article key={wallet.id}>
          <small>{wallet.subtitle}</small>
          <h3>{wallet.name}</h3>
          <strong>{wallet.balance.toLocaleString()}</strong>
        </article>
      ))}
    </div>
  );
}

function CouponStrip({ coupons, onCollect }) {
  return (
    <div className="coupon-strip">
      {coupons.map(coupon => (
        <article key={coupon.id}>
          {coupon.image && <img src={coupon.image} alt="" />}
          <h3>{coupon.title}</h3>
          <p>{coupon.condition}</p>
          <button onClick={() => onCollect(coupon.id)}>
            {coupon.status === "active" ? "Use" : "Collect"}
          </button>
        </article>
      ))}
    </div>
  );
}

function PointListScreen({ wallets, onRedeem }) {
  return (
    <section>
      <h1>My Point</h1>
      {wallets.map(wallet => (
        <article key={wallet.id} className="wallet-card">
          <h3>{wallet.name}</h3>
          <p>{wallet.subtitle}</p>
          <strong>{wallet.balance.toLocaleString()}</strong>
          <button onClick={() => onRedeem(wallet.id)}>Redeem demo</button>
        </article>
      ))}
    </section>
  );
}

