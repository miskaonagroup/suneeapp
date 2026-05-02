import type { Member, PointWallet } from "@/lib/models";

export function createDemoMember(): Member {
  return {
    id: "SM-KP-2024-00847",
    prefix: "คุณ",
    firstName: "KP ธวัลรัตน์",
    lastName: "ทองคำ",
    tier: "Gold Member"
  };
}

export function createDemoPointWallets(): PointWallet[] {
  return [
    {
      id: "point-app",
      name: "Point App",
      subtitle: "Sunee Grand Hotel",
      balance: 3716,
      color: "#B71C1C"
    },
    {
      id: "staff",
      name: "สวัสดิการพนักงาน",
      subtitle: "Sunee Tower",
      balance: 1000,
      color: "#7B0000"
    },
    {
      id: "gold",
      name: "แสตมป์โกลด์",
      subtitle: "หมดอายุ 31/08/2026",
      balance: 100,
      color: "#C9A84C"
    }
  ];
}

