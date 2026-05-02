from dataclasses import asdict

from domain import create_demo_point_service


points = create_demo_point_service()


def list_points():
    return [asdict(wallet) for wallet in points.list_wallets()]


def redeem_point(wallet_id: str, amount: float, note: str = ""):
    entry = points.redeem(wallet_id=wallet_id, amount=amount, note=note)
    return asdict(entry)


def transfer_point(wallet_id: str, amount: float, receiver_member_id: str, note: str = ""):
    entry = points.transfer(
        wallet_id=wallet_id,
        amount=amount,
        receiver_member_id=receiver_member_id,
        note=note,
    )
    return asdict(entry)


# FastAPI version later:
#
# from fastapi import FastAPI
# app = FastAPI()
#
# @app.get("/points")
# def api_list_points():
#     return list_points()
#
# @app.post("/points/{wallet_id}/redeem")
# def api_redeem(wallet_id: str, amount: float, note: str = ""):
#     return redeem_point(wallet_id, amount, note)

