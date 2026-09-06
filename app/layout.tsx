import type { Metadata } from "next";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import "./globals.css";

export const metadata: Metadata = {
  title: "One Tap Checkout - No Gas, No Top-Up",
  description: "Seamless purchases powered by smart accounts on Base Sepolia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  if (!appId) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-600">Missing NEXT_PUBLIC_PRIVY_APP_ID</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <PrivyProvider
          appId={appId}
          config={{
            supportedChains: [baseSepolia],
            loginMethods: ["email", "google", "wallet"],
            embeddedWallets: {
              createOnLogin: "all-users",
              showWalletUIs: false,
            },
            appearance: {
              theme: "light",
              accentColor: "#2563eb",
            },
          }}
        >
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
