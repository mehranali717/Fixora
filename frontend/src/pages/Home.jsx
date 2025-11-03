import Hero from "../components/Hero";
import WhyJustLife from "../components/WhyJustLife";
import TopServices from "../components/TopServices";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <main className="flex-1">
        <Hero />
        <TopServices />
        <WhyJustLife />
      </main>
    </div>
  );
}
