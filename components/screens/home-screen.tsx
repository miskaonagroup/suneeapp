import { AppShell } from "@/components/app-shell";
import type { Member, PointWallet } from "@/lib/models";
import { formatPoint } from "@/lib/utils";

export function HomeScreen({
  member,
  wallets
}: {
  member: Member;
  wallets: PointWallet[];
}) {
  return (
    <AppShell>
      <section className="home-content">
        <div className="profile-card">
          <strong>
            {member.prefix}
            {member.firstName} {member.lastName}
          </strong>
          <span>{member.id}</span>
        </div>

        <div className="wallet-grid">
          {wallets.map(wallet => (
            <article className="wallet-card" key={wallet.id}>
              <h2>{wallet.name}</h2>
              <p>{wallet.subtitle}</p>
              <strong style={{ color: wallet.color }}>{formatPoint(wallet.balance)}</strong>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

