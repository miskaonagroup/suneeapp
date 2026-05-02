import { HomeScreen } from "@/components/screens/home-screen";
import { createDemoMember, createDemoPointWallets } from "@/lib/demo-data";

export default function Page() {
  const member = createDemoMember();
  const wallets = createDemoPointWallets();

  return <HomeScreen member={member} wallets={wallets} />;
}

