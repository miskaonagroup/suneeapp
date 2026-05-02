from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional


class CouponStatus(str, Enum):
    COLLECTABLE = "collectable"
    ACTIVE = "active"
    USED = "used"
    EXPIRED = "expired"


@dataclass
class Member:
    id: str
    name: str
    tier: str = "Member"
    phone: str = ""
    email: str = ""
    line_id: str = ""


@dataclass
class PointWallet:
    id: str
    name: str
    subtitle: str
    balance: float = 0
    color: str = "#B71C1C"
    expires_at: Optional[str] = None

    def debit(self, amount: float) -> float:
        amount = float(amount)
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")
        if amount > self.balance:
            raise ValueError("Amount exceeds wallet balance")
        self.balance -= amount
        return self.balance


@dataclass
class Coupon:
    id: str
    title: str
    condition: str
    expires_at: str
    image: str = ""
    status: CouponStatus = CouponStatus.COLLECTABLE

    def collect(self) -> "Coupon":
        if self.status not in (CouponStatus.USED, CouponStatus.EXPIRED):
            self.status = CouponStatus.ACTIVE
        return self

    def use(self) -> "Coupon":
        if self.status != CouponStatus.ACTIVE:
            raise ValueError("Coupon is not active")
        self.status = CouponStatus.USED
        return self


@dataclass
class HistoryEntry:
    id: str
    type: str
    wallet_id: str
    amount: float
    balance_after: float
    note: str = ""
    created_at: datetime = field(default_factory=datetime.utcnow)


class PointService:
    def __init__(self, wallets: List[PointWallet]):
        self.wallets: Dict[str, PointWallet] = {wallet.id: wallet for wallet in wallets}
        self.history: List[HistoryEntry] = []

    def list_wallets(self) -> List[PointWallet]:
        return list(self.wallets.values())

    def redeem(self, wallet_id: str, amount: float, note: str = "") -> HistoryEntry:
        wallet = self._wallet(wallet_id)
        balance_after = wallet.debit(amount)
        return self._record("redeem", wallet_id, -abs(float(amount)), balance_after, note)

    def transfer(self, wallet_id: str, amount: float, receiver_member_id: str, note: str = "") -> HistoryEntry:
        wallet = self._wallet(wallet_id)
        balance_after = wallet.debit(amount)
        return self._record(
            "transfer",
            wallet_id,
            -abs(float(amount)),
            balance_after,
            note or f"Transfer to {receiver_member_id}",
        )

    def _wallet(self, wallet_id: str) -> PointWallet:
        if wallet_id not in self.wallets:
            raise KeyError(f"Wallet not found: {wallet_id}")
        return self.wallets[wallet_id]

    def _record(self, type_: str, wallet_id: str, amount: float, balance_after: float, note: str) -> HistoryEntry:
        entry = HistoryEntry(
            id=f"TXN-{int(datetime.utcnow().timestamp())}",
            type=type_,
            wallet_id=wallet_id,
            amount=amount,
            balance_after=balance_after,
            note=note,
        )
        self.history.insert(0, entry)
        return entry


def create_demo_point_service() -> PointService:
    return PointService(
        [
            PointWallet(id="point-app", name="Point App", subtitle="Sunee Grand Hotel", balance=3716),
            PointWallet(id="staff", name="Staff Welfare", subtitle="Sunee Tower", balance=1000, color="#7B0000"),
            PointWallet(id="gold", name="Gold Stamp", subtitle="Expires 31/08/2026", balance=100, color="#C9A84C"),
        ]
    )

