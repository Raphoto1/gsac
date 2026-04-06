import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const isDevelopment = process.env.NODE_ENV === "development";
const scriptSrc = [
	"'self'",
	"'unsafe-inline'",
	...(isDevelopment ? ["'unsafe-eval'"] : []),
	"https://www.googletagmanager.com",
].join(" ");

const contentSecurityPolicy = `
	default-src 'self';
	base-uri 'self';
	form-action 'self';
	frame-ancestors 'none';
	object-src 'none';
	script-src ${scriptSrc};
	style-src 'self' 'unsafe-inline';
	img-src 'self' data: blob: https://images.pexels.com https://www.googletagmanager.com https://www.google-analytics.com;
	font-src 'self' data:;
	connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com;
	frame-src 'self';
	${isDevelopment ? "" : "upgrade-insecure-requests;"}
`
	.replace(/\s{2,}/g, " ")
	.trim();

const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value: contentSecurityPolicy,
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
];

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.pexels.com",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},
};

export default withNextIntl(nextConfig);
