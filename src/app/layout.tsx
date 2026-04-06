import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import CartProvider from "@/components/cart-provider";
import MobileNav from "@/components/mobile-nav";
import ToastProvider from "@/components/toast-provider";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lunor Atelier | Premium Home",
  description:
    "Luxury home appliances and furniture with a gallery-grade shopping experience.",
  icons: {
    icon: [
      { url: "/company-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/company-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${playfair.variable} mobile-compact bg-[var(--paper)] text-[var(--ink)] antialiased`}
      >
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,var(--mist),transparent_60%)]">
              <Nav />
              {children}
              <Footer />
              <MobileNav />
            </div>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
