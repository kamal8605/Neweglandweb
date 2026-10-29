# Backend security requirements

The backend is not part of this repository. The following controls must be implemented and tested in the API before cookie authentication is enabled in production.

## Session cookies

- Issue the access/session token in an `HttpOnly`, `Secure`, `SameSite=Lax` (or stricter) cookie.
- Rotate refresh tokens and revoke the token family on reuse or logout.
- Do not return reusable bearer tokens to browser JavaScript after cookie mode is enabled.
- Restrict credentialed CORS to the exact production frontend origin; never combine credentials with `Access-Control-Allow-Origin: *`.
- Require CSRF protection for state-changing cookie-authenticated requests. `SameSite` is defense in depth, not a complete replacement.
- Keep `/auth/login`, `/auth/refresh`, and `/auth/logout` rate-limited and return non-enumerating login errors.

Frontend behavior (`lib/axios.ts`, `lib/authToken.ts`):

- Default (bearer mode): the access token is kept in `localStorage` and sent as `Authorization: Bearer …`; requests are sent without credentials (`withCredentials: false`).
- `NEXT_PUBLIC_COOKIE_AUTH=true` (cookie mode): requests, including `/auth/refresh`, are sent with credentials (`withCredentials: true`). No token is written to or read from `localStorage` (a leftover one is removed), no `Authorization` header is sent, and any `access_token` the API still returns from login, refresh or password change is ignored.
- The frontend does not implement CSRF tokens. If the API's CSRF scheme needs a request header (for example `X-XSRF-TOKEN`), the frontend must be extended for it before cookie mode is enabled.

Setting the flag alone does not make cookie authentication secure: every control in this section must be implemented and tested in the API first.

## Authorization and IDOR prevention

Every endpoint must authorize the authenticated user on the server, independent of frontend route guards.

- `/users/{id}`: a user may update only their own record unless explicitly authorized as an administrator.
- `/addresses` and `/addresses/{id}`: scope reads, updates, and deletes to the authenticated account.
- `/wishlist` and `/wishlist/{productId}`: scope all operations to the authenticated account.
- `/orders` and `/orders/{id}`: return only orders owned by the authenticated account; do not trust an ID alone.
- Order creation: require an approved account and recalculate product price, discounts, availability, taxes, and totals on the server.
- Reject non-integer, zero, negative, or excessive quantities and enforce a server-side maximum.
- Verify that selected billing/shipping addresses belong to the authenticated account.

Add automated tests that attempt cross-account reads and mutations for every resource above and assert `403` or `404`.

## Open backend follow-ups (reviewed 24 Oct 2026, API repository at `5f89f20`)

- **Email change without re-authentication:** `PATCH /users/{id}` accepts a new `email` without `current_password`. Require the current password (as `PATCH /users/me/password` already does) and notify the old address, so a stolen token cannot be turned into an account takeover through the password-reset flow.
- **Cookie authentication is not supported:** the API's CORS configuration has `supports_credentials => false` and login/refresh return bearer tokens. Keep `NEXT_PUBLIC_COOKIE_AUTH` unset or `false` until every control in "Session cookies" is implemented.
- **Refresh-token lifetime:** `JWT_REFRESH_TTL` defaults to 14 days (from the original login, not sliding). Confirm the production value is as short as the business allows.
- Already in place: named rate limits on login, refresh, registration, password reset and password change (observed live: `X-RateLimit-Limit` on `/api/auth/refresh`), and per-user scoping of cart, wishlist, address and order queries (code review; add the cross-account tests above).
