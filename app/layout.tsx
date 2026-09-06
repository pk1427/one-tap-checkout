import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

const ClientOnlyPrivy = dynamic(
  () =>
    import("./ClientLayout").then((mod) => {
      const Component = mod.default;
      const NamedComponent = (props: { appId: string; children: React.ReactNode }) => (
        <Component appId={props.appId}>{props.children}</Component>
      );
      NamedComponent.displayName = "ClientOnlyPrivy";
      return NamedComponent;
    }),
  { ssr: false }
);

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

  return (
    <html lang="en">
      <body>
        <ClientOnlyPrivy appId={appId}>{children}</ClientOnlyPrivy>
      </body>
    </html>
  );
}
