import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import FloatingButtons from "./FloatingButtons.jsx";

export default function Layout() {
  return (
    <div className="relative bg-accent text-text-primary flex flex-col">
      <Navbar />
      <main className="flex-1 relative min-h-screen mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
