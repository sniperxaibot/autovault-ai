import type { Metadata } from "next";
import "./globals.css";
import { WalletAdapterProvider } from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "AutoVault AI",
  description: "Autonomous DeFi Agents on Solana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletAdapterProvider>
          {children}
        </WalletAdapterProvider>
      </body>
    </html>
  );
}