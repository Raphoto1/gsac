This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Google Analytics

Create a local environment file and define your measurement ID:

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to your Google Analytics ID, for example `G-XXXXXXXXXX`.

The integration is loaded automatically from the root layout and tracks client-side route changes in the App Router.

## Security Headers

The application sends the following security headers globally from `next.config.ts`:

- `Content-Security-Policy`: Restricts the allowed sources for scripts, styles, images, connections, frames, and other resources to reduce XSS and unauthorized third-party resource loading risks.
- `Referrer-Policy: strict-origin-when-cross-origin`: Limits the referrer information shared with external sites.
- `X-Content-Type-Options: nosniff`: Prevents browsers from MIME-sniffing files as a different content type.
- `X-Frame-Options: DENY`: Blocks the site from being embedded in iframes to reduce clickjacking risk.
- `Permissions-Policy`: Disables access to camera, microphone, geolocation, and browsing topics because the site does not require them.
- `Strict-Transport-Security`: Forces HTTPS on subsequent visits and includes subdomains.
- `X-DNS-Prefetch-Control: on`: Explicitly enables DNS prefetch behavior.

Summary:
These headers are intended to harden the site against content injection, insecure transport, unauthorized embedding, and unnecessary browser capability exposure.

Notes:
- The Content Security Policy allows only the resources required by the site itself plus the configured analytics services.
- In development, the CSP also allows `unsafe-eval` for the local React and Turbopack workflow.
- In production, the CSP adds `upgrade-insecure-requests`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
