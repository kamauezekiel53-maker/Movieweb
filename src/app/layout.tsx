import "./globals.css";
import { TRPCProvider } from "@/lib/trpc";
import Header from "@/components/Header";

export const metadata = {
  title: "Moviehub",
  description: "Movie streaming demo powered by GiftedTech API"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <Header />
          <main>{children}</main>
        </TRPCProvider>
      </body>
    </html>
  );
}