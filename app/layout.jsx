import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "@/components/includes/HeaderFooterWrapper";
import { CartProvider } from "@/components/context/CartContext";
import { WishlistProvider } from "@/components/context/WishlistContext";
import { AuthProvider } from "@/components/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "BabyDays | Premium Baby Products",
    template: "%s | BabyDays",
  },
  description:
    "Shop premium baby products — head pillows, swaddle wraps, sherpa sleepers & more.",
  keywords:
    "baby products, baby pillow, swaddle wrap, baby blanket, sherpa sleeper",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com",
  ),
  openGraph: { type: "website", locale: "en_IN", siteName: "BabyDays" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId="1065094393006-4b9tr4v35nf2l52ohi158evfmgbkge80.apps.googleusercontent.com">
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Wrapper>{children}</Wrapper>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
