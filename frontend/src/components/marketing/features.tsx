import { Shield, Zap, Code, BarChart3, Cpu, Globe } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Instant Deployment",
    description:
      "Upload your .pkl, .pt, or .h5 files and get a high-performance API endpoint in seconds.",
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description:
      "Sub-10ms inference overhead with automatic GPU acceleration when your models need it.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Private model isolation, automatic vulnerability scanning, and robust JWT/API Key auth.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Deep insights into your model's health, latency, and throughput with built-in monitoring.",
  },
  {
    icon: Code,
    title: "Developer First API",
    description:
      "RESTful endpoints designed for developers. Seamless integration with your existing CI/CD pipelines.",
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description:
      "Deploy your models closer to your users with our globally distributed edge infrastructure.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-zinc-900/30 relative overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 font-stylish">
            Built for Production
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Everything you need to deploy, monitor, and scale your machine
            learning models at the speed of thought.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-zinc-900 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
