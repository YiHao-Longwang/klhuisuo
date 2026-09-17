# vinext-starter

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Reservation Backend

The site has a reservation-only cart flow. Customers pick a package, date, time
and quantity, then submit their name and phone. No online payment is taken; the
reservation is saved with `payment_status = pay_after_treatment`.

Set these environment variables before using live reservations:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
ADMIN_TOKEN="choose-a-private-token"
BACKEND_PORT=4000
FRONTEND_ORIGIN="https://your-domain.com"
```

For local development, copy `.env.example` to `.env.local` and fill the values.
The API creates the `reservations` table automatically on first use. The same
schema is also available at `db/reservations.sql` if you prefer to run it manually.

Useful endpoints:

- `POST /api/reservations`: create a reservation from the cart
- `GET /api/reservations?token=ADMIN_TOKEN`: list the latest 50 reservations
- `PATCH /api/reservations`: update reservation status with `x-admin-token`

## Websocket Admin

Run the frontend and websocket backend in two terminals:

```bash
npm run dev
npm run backend
```

Open `/admin`, enter your `ADMIN_TOKEN`, and keep `API base` as
`http://localhost:4000` for local development. New reservations are broadcast by
Socket.IO as `reservation:created`; status changes are broadcast as
`reservation:updated`.

For production, host the Node backend somewhere that supports long-running
websocket connections. If the backend is on another domain, set the admin page's
API base to that backend URL and set `FRONTEND_ORIGIN` on the backend.

## Optional Telegram Notification

Telegram can send automatic staff notifications through a bot. Create a bot with
BotFather, add it to your staff chat, then set:

```bash
TELEGRAM_BOT_TOKEN="123456:bot-token"
TELEGRAM_CHAT_ID="-1001234567890"
```

When those variables are present, the backend sends a Telegram message whenever
a new reservation is created. Leave them empty to disable Telegram.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
# klhuisuo
