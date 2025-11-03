import features from "../data/whyJustLife.json";
import Card from "../ui/Card";

export default function WhyJustLife() {
  return (
    <section className="bg-gradient-to-b from-white to-emerald-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Heading */}
        <h3 className="text-3xl font-bold text-emerald-600">Why JustLife?</h3>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Fast booking, verified providers, and customer support in Arabic & English —
          built for UAE neighborhoods.
        </p>

        {/* Features Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
