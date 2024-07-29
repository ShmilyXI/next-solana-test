"use client";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import AppWalletProvider from "./AppWalletProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
