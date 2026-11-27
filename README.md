# BloodBridge

A community platform that connects blood donors, patients and hospitals, and helps families raise funds for medical treatment. Every blood request and fundraising campaign is reviewed by an administrator before it goes public.

> Replace `BloodBridge`, the links and the screenshots with your own.


**Live demo:** https://blood-bridge-two-mauve.vercel.app

---

## Table of contents

- [Features](#features)
- [Roles](#roles)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Authentication and route protection](#authentication-and-route-protection)
- [Payments](#payments)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Public site
- Animated home page with hero banner, blood compatibility explorer, FAQ and call to action
- About and Contact pages with a validated contact form
- Browse active fundraising campaigns with search, sorting and pagination
- Secure campaign contributions through Stripe Checkout

### Blood requests
- Patients and hospitals create blood requests with blood group, units, urgency and location
- Admin verification before requests reach donors
- Donors see requests that match their blood group

### Fundraising campaigns
- Admins and hospitals create campaigns with a target amount
- Admin approval flow: activate or cancel pending campaigns
- Funding progress bars and per-campaign contribution history

### Dashboards
- Role based dashboards with charts (area, bar, donut) and activity lists
- Admin user management: search, ban or activate, delete and restore users
- Contribution history: admins see everyone's, other users see their own

### Quality
- Light and dark mode through theme tokens
- Responsive layouts with no horizontal scrolling in tables
- Loading skeletons and empty states
- Server side role checks in the proxy and in server components

---

## Roles

| Role | What they can do |
|---|---|
| **Donor** | Register a blood group, view matching requests, track donations and contributions |
| **Patient** | Create blood requests, track their status, contribute to campaigns |
| **Hospital** | Everything a patient can do, plus create and manage fundraising campaigns |
| **Admin** | Verify requests and campaigns, manage users, view all contributions and platform stats |

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) |
| Icons | lucide-react |
| Forms | react-hook-form |
| Charts | Recharts |
| Auth | JWT in cookies, verified with `jose` in the proxy |
| Payments | Stripe Checkout |
| Alerts | SweetAlert2 and toast helpers |
| Package manager | pnpm |

The frontend talks to a separate REST API. See the backend repository for setup: `https://github.com/GMRedoan/blood_donation_backend.git`.

---

## Project structure

```
src/
├── app/
│   ├── (public)/            # home, about, contact, campaign pages
│   └── dashboard/
│       ├── admin/           # admin pages
│       ├── donor/           # donor pages
│       ├── hospital/        # hospital pages
│       └── patient/         # patient pages
├── components/
│   ├── modules/             # feature components (tables, dashboards, dialogs)
│   ├── Reusable/            # Animate, Pagination, Toast, FormatDate
│   └── ui/                  # shadcn/ui components
├── hooks/                   # usePagination and other hooks
├── server/                  # server actions grouped by feature
├── types/                   # shared TypeScript types
└── proxy.ts                 # route protection (Next.js 16)
```

Adjust this tree to match your real folders.

---

## Getting started

### Prerequisites
- Node.js 20 or newer
- pnpm (`npm i -g pnpm`)
- The backend API running locally or deployed
- A Stripe account (test mode is fine)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/GMRedoan/blood-bridge.git
cd your-repo

# 2. Install dependencies
pnpm install

# 3. Create your environment file
cp .env.example .env.local

# 4. Start the dev server
pnpm dev
```

Open http://localhost:3000.

---

## Environment variables

Create `.env.local` in the project root:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://blood-donation-eight-ivory.vercel.app/api/v1

# Must match the secret your backend uses to sign access tokens
JWT_ACCESS_SECRET=your_access_token_secret
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the backend API. Use your real variable name |
| `JWT_ACCESS_SECRET` | Yes | Secret used by the proxy to verify access tokens. Server only, never prefix with `NEXT_PUBLIC_` |

Restart the dev server after changing any variable. Never commit `.env.local`.

---

## Authentication and route protection

- Login and registration open in a dialog, controlled by `useAuth()` (`openLogin`).
- The access token is stored in an `accessToken` cookie.
- `proxy.ts` verifies the token signature and expiry with `jose`, then applies these rules:
  - Guests visiting `/dashboard/*` are sent home with `?login=1`, which opens the login dialog.
  - Users opening another role's dashboard are redirected to their own.
- Role checks are repeated in server components and on the backend. The proxy only controls navigation, so the API must enforce permissions too.

---

## Payments

Campaign contributions use Stripe Checkout:

1. The user picks an amount in the contribute dialog.
2. The server action `createContribution({ campaignId, amount })` calls the backend.
3. The backend creates a Checkout Session and returns `checkoutUrl`.
4. The browser is redirected to Stripe, then back to your success or cancel page.

Card details never reach this app. For local testing, use Stripe test cards such as `4242 4242 4242 4242`.

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |

---

## Deployment

The easiest option is [Vercel](https://vercel.com):

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Add the environment variables from above in the project settings.
4. Deploy.

Make sure the backend allows requests from your production domain (CORS) and that its Stripe success and cancel URLs point to your deployed site.

---

## Roadmap

- [ ] Donor search by blood group and district
- [ ] Email and SMS notifications for matching requests
- [ ] Featured campaigns on the home page
- [ ] Single `/admin/stats` endpoint for faster dashboards
- [ ] Multi-language support (English and Bangla)

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

Distributed under the MIT License. See `LICENSE` for details.

---
