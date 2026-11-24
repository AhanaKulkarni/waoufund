import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WaoU Fund — AI-Powered Fundraising Intelligence for Founders',
  description:
    'WaoU Fund brings investor intelligence, fundraising preparation, financial modelling and institutional-grade due diligence into one intelligent platform. Build a stronger venture and approach investors with confidence.',
  keywords: [
    'fundraising platform',
    'AI pitch deck diagnostic',
    'startup valuation calculator',
    'due diligence data room',
    'venture capital intelligence',
    'seed round prep',
    'founder cfo model',
    'SAFE agreement templates',
    'pitch deck review',
  ],
  authors: [{ name: 'WaoU Fund Intelligence Inc.' }],
  metadataBase: new URL('https://waoufund.com'),
  alternates: {
    canonical: 'https://waoufund.com/',
  },
  openGraph: {
    title: 'WaoU Fund — AI-Powered Fundraising Intelligence for Founders',
    description:
      'Discover the right investors, diagnose pitch decks, stress-test financials, and navigate due diligence with institutional-grade AI.',
    url: 'https://waoufund.com/',
    siteName: 'WaoU Fund',
    images: [
      {
        url: '/app-icon.png',
        width: 1200,
        height: 630,
        alt: 'WaoU Fund AI Fundraising Intelligence Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WaoU Fund — AI-Powered Fundraising Intelligence',
    description:
      'Institutional-grade AI helping founders optimize fundability vectors, stress-test financials, and close seed to Series-A rounds.',
    images: ['/app-icon.png'],
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://waoufund.com/#organization',
                  name: 'WaouFund',
                  legalName: 'WaouFund Intelligence Inc.',
                  url: 'https://waoufund.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://waoufund.com/logo.png',
                    width: 512,
                    height: 512,
                  },
                  description:
                    'Enterprise-grade AI fundraising intelligence platform helping early-stage and high-growth ventures optimize fundability and close institutional rounds.',
                  foundingDate: '2026',
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'support@waoufund.com',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'WaouFund Founder Studio',
                  operatingSystem: 'Web, iOS, Android',
                  applicationCategory: 'BusinessApplication',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased bg-[#F8FAFF] text-[#171C2F] selection:bg-[#E0EDFF] selection:text-[#5268E8]">
        {children}
      </body>
    </html>
  );
}
