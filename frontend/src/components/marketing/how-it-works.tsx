import { Upload, Cpu, Rocket } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Model",
    description:
      "Upload your trained .pkl, .pt, or .h5 model file. We handle environment setup, dependency resolution, and containerization automatically.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Get Your Endpoint",
    description:
      "Receive a unique REST API endpoint instantly. Every model gets versioned, documented, and secured with API key authentication out of the box.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Start Inferring",
    description:
      "Call your endpoint from anywhere — web apps, mobile, IoT devices. Monitor performance in real-time with built-in latency tracking and logs.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 font-stylish">
            How It Works
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            From trained model to production API in three simple steps. No
            infrastructure expertise required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line (except last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-zinc-700 to-transparent" />
              )}
              <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-zinc-900 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                    Step {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
