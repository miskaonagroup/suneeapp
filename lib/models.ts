export type Member = {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  tier: string;
};

export type PointWallet = {
  id: string;
  name: string;
  subtitle: string;
  balance: number;
  color: string;
};

export type Coupon = {
  id: string;
  title: string;
  condition: string;
  expiresAt: string;
  image: string;
  status: "collectable" | "active" | "used" | "expired";
};

