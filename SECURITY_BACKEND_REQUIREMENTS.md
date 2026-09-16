# Backend security requirements

The backend is not part of this repository. The following controls must be implemented and tested in the API before cookie authentication is enabled in production.

## Session cookies

- Issue the access/session token in an `HttpOnly`, `Secure`, `SameSite=Lax` (or stricter) cookie.
- Rotate refresh tokens and revoke the token family on reuse or logout.
- Do not return reusable bearer tokens to browser JavaScript after cookie mode is enabled.
- Restrict credentialed CORS to the exact production frontend origin; never combine credentials with `Access-Control-Allow-Origin: *`.
- Require CSRF protection for state-changing cookie-authenticated requests. `SameSite` is defense in depth, not a complete replacement.
- Keep `/auth/login`, `/auth/refresh`, and `/auth/logout` rate-limited and return non-enumerating login errors.

The frontend Axios client now sends credentials (`withCredentials: true`) so it is ready to receive secure cookies without another client transport change.

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
