import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Spend Audit | Credex Intelligence",
  description: "Uncover shadow AI spend and optimize your organization's subscription efficiency with data-driven auditing.",
  openGraph: {
    title: "AI Spend Audit | Credex Intelligence",
    description: "Benchmark your AI tool spend and find immediate savings.",
    type: "website",
    siteName: "Credex AI Audit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit | Credex Intelligence",
    description: "Benchmark your AI tool spend and find immediate savings.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} font-sans selection:bg-[#086841] selection:text-white`}
    >
      <body className="min-h-screen bg-white">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#086841] rounded-sm" />
              <span className="font-bold tracking-tight text-gray-900">AI SPEND AUDIT</span>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono border border-gray-200">v2026.1</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-[#086841] transition-colors">Methodology</a>
              <a href="#" className="hover:text-[#086841] transition-colors">Pricing Data</a>
              <a href="#" className="text-[#086841]">Credex Labs</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-200 bg-gray-50 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-8">
            <div className="max-w-xs">
              <p className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">Credex AI Audit</p>
              <p>Institutional financial intelligence for the AI era. Built to help organizations ship faster and spend smarter.</p>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-gray-900">Platform</p>
                <a href="#" className="hover:underline">Pricing Registry</a>
                <a href="#" className="hover:underline">Audit Engine</a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-gray-900">Company</p>
                <a href="#" className="hover:underline">Credex Home</a>
                <a href="#" className="hover:underline">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
