# Sunee Member Refactor Starter

This folder is a migration guide and starter code for splitting the current
prototype into reusable parts.

## Target Shape

1. `js/`
   - Pure domain models and services.
   - No DOM access.
   - Can be tested with Node and reused by React.

2. `react/`
   - UI components.
   - Receives data and callbacks from hooks/services.
   - Does not mutate raw global state directly.

3. `python/`
   - Backend/domain mirror.
   - Can become a FastAPI service later.
   - Keeps member, point, coupon, and history rules server-side.

## Migration Order

1. Move static data from `app.js` into API/fixture files.
2. Move business rules into `js/core.js`.
3. Convert one screen at a time to React components.
4. Add Python endpoints for member, point, coupon, history, and auth.
5. Replace mock data with API calls.

## Recommended Modules

```text
src/
  domain/
    Member.js
    PointWallet.js
    Coupon.js
    HistoryEntry.js
  services/
    AuthService.js
    PointService.js
    CouponService.js
    HistoryService.js
  ui/
    screens/
    components/
    layouts/
```

## Screen Mapping

| Current Screen | React Component | Service |
| --- | --- | --- |
| Login | `LoginScreen` | `AuthService` |
| Home | `HomeScreen` | `CouponService`, `EventService` |
| My Point | `PointListScreen` | `PointService` |
| History | `PointHistoryScreen` | `HistoryService` |
| Scanner/Transfer | `PointFlowScreen` | `PointService` |
| Coupon | `CouponScreen` | `CouponService` |
| Profile | `ProfileScreen` | `MemberService` |

