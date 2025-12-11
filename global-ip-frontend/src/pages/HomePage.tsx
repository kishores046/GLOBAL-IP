import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { WorldMap } from "../components/WorldMap";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <Navbar />
      <Hero />
      <Features />
      <WorldMap />
    </div>
  );
}
