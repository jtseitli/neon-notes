import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Neon Notes",
  description: "A neon-styled sticky notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
