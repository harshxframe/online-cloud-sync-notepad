import "./globals.css";

export const metadata = {
  title: "Web Notepad - Online Text Editor",
  description: "A fast, multi-tab web notepad with PDF export, cloud sync, and classic notepad interface.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
