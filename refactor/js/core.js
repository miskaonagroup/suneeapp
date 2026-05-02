export class Member {
  constructor({ id, name, tier = "Member", phone = "", email = "", lineId = "" }) {
    this.id = id;
    this.name = name;
    this.tier = tier;
    this.phone = phone;
    this.email = email;
    this.lineId = lineId;
  }
}

export class PointWallet {
  constructor({ id, name, subtitle, balance = 0, color = "#B71C1C", expiresAt = null }) {
    this.id = id;
    this.name = name;
    this.subtitle = subtitle;
    this.balance = Number(balance);
    this.color = color;
    this.expiresAt = expiresAt;
  }

  canDebit(amount) {
    return Number(amount) > 0 && Number(amount) <= this.balance;
  }

  debit(amount) {
    const value = Number(amount);
    if (!this.canDebit(value)) {
      throw new Error("Amount exceeds wallet balance");
    }
    this.balance -= value;
    return this.balance;
  }
}

export class Coupon {
  constructor({ id, title, condition, expiresAt, image = "", status = "collectable" }) {
    this.id = id;
    this.title = title;
    this.condition = condition;
    this.expiresAt = expiresAt;
    this.image = image;
    this.status = status;
  }

  collect() {
    if (this.status === "expired" || this.status === "used") return this;
    this.status = "active";
    return this;
  }

  use() {
    if (this.status !== "active") {
      throw new Error("Coupon is not active");
    }
    this.status = "used";
    return this;
  }
}

export class HistoryEntry {
  constructor({ id, type, walletId, amount, balanceAfter, note = "", createdAt = new Date() }) {
    this.id = id;
    this.type = type;
    this.walletId = walletId;
    this.amount = Number(amount);
    this.balanceAfter = Number(balanceAfter);
    this.note = note;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }
}

export class PointService {
  constructor({ wallets = [], history = [] } = {}) {
    this.wallets = new Map(wallets.map(wallet => [wallet.id, wallet]));
    this.history = history;
  }

  listWallets() {
    return [...this.wallets.values()];
  }

  getWallet(walletId) {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error(`Wallet not found: ${walletId}`);
    return wallet;
  }

  redeem({ walletId, amount, note = "" }) {
    const wallet = this.getWallet(walletId);
    const balanceAfter = wallet.debit(amount);
    return this.record({
      type: "redeem",
      walletId,
      amount: -Math.abs(Number(amount)),
      balanceAfter,
      note
    });
  }

  transfer({ walletId, amount, receiverMemberId, note = "" }) {
    const wallet = this.getWallet(walletId);
    const balanceAfter = wallet.debit(amount);
    return this.record({
      type: "transfer",
      walletId,
      amount: -Math.abs(Number(amount)),
      balanceAfter,
      note: note || `Transfer to ${receiverMemberId}`
    });
  }

  record(input) {
    const entry = new HistoryEntry({
      id: `TXN-${Date.now()}`,
      createdAt: new Date(),
      ...input
    });
    this.history.unshift(entry);
    return entry;
  }

  historyByWallet(walletId) {
    return this.history.filter(item => item.walletId === walletId);
  }
}

export class CouponService {
  constructor(coupons = []) {
    this.coupons = new Map(coupons.map(coupon => [coupon.id, coupon]));
  }

  list(status = null) {
    const coupons = [...this.coupons.values()];
    return status ? coupons.filter(coupon => coupon.status === status) : coupons;
  }

  collect(couponId) {
    return this.get(couponId).collect();
  }

  use(couponId) {
    return this.get(couponId).use();
  }

  get(couponId) {
    const coupon = this.coupons.get(couponId);
    if (!coupon) throw new Error(`Coupon not found: ${couponId}`);
    return coupon;
  }
}

export function createDemoServices() {
  const wallets = [
    new PointWallet({ id: "point-app", name: "Point App", subtitle: "Sunee Grand Hotel", balance: 3716 }),
    new PointWallet({ id: "staff", name: "Staff Welfare", subtitle: "Sunee Tower", balance: 1000, color: "#7B0000" }),
    new PointWallet({ id: "gold", name: "Gold Stamp", subtitle: "Expires 31/08/2026", balance: 100, color: "#C9A84C" })
  ];

  const coupons = [
    new Coupon({
      id: "drink-20",
      title: "Drink discount 20%",
      condition: "Minimum purchase 100 THB",
      expiresAt: "2026-04-30",
      image: "images/coupon/1777642646632.jpg",
      status: "active"
    }),
    new Coupon({
      id: "free-shipping",
      title: "Free shipping",
      condition: "Minimum purchase 500 THB",
      expiresAt: "2025-12-31",
      image: "images/coupon/1777642708925.jpg",
      status: "collectable"
    })
  ];

  return {
    points: new PointService({ wallets }),
    coupons: new CouponService(coupons)
  };
}

