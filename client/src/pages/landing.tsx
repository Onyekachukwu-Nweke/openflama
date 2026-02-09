import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Code2,
  Database,
  GitBranch,
  LineChart,
  Layers,
  Menu,
  Shield,
  Terminal,
  X,
  Zap,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { SiGithub } from "react-icons/si";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center py-32"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="mb-4">
          <img
            src="/flama-logo.png"
            alt="OpenFlama logo"
            className="h-16 w-16 mx-auto"
            data-testid="img-hero-logo"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mb-6">
          <Badge variant="outline" className="px-4 py-1.5 text-xs font-mono tracking-wider border-primary/30 text-primary">
            OPEN SOURCE v0.1.0
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-foreground">Open</span>
          <span className="text-primary">Flama</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Agentic finance runtime & forecasting engine.
          <br className="hidden sm:block" />
          Build financial agents with reproducible, explainable predictions.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button size="lg" data-testid="button-get-started">
              Launch Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a
            href="https://github.com/openflama"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" data-testid="button-github">
              <SiGithub className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-16 p-4 rounded-md bg-card/60 border border-border/50 max-w-lg mx-auto font-mono text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-primary/80">quickstart</span>
          </div>
          <code className="text-foreground/80">
            curl -X POST /v1/predict {"{"}{" "}
            <span className="text-primary">"ticker"</span>: "AAPL",{" "}
            <span className="text-primary">"horizon"</span>: "5d" {"}"}
          </code>
        </motion.div>
      </motion.div>
    </section>
  );
}

const features = [
  {
    icon: LineChart,
    title: "Quant Forecasting",
    description:
      "Point forecasts, prediction intervals, and full trace of models and features used.",
  },
  {
    icon: Brain,
    title: "Agentic Runtime",
    description:
      "Pluggable LLM orchestrator for natural language queries routed to quantitative tools.",
  },
  {
    icon: BarChart3,
    title: "Walk-Forward Backtests",
    description:
      "Reproducible evaluation with no lookahead bias. Compare baselines and track metrics.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description:
      "Swap LLM backends, add new forecasting models, or plug in custom features with ease.",
  },
  {
    icon: Database,
    title: "Full Audit Trail",
    description:
      "Every prediction stored with inputs, outputs, model used, and timestamps for compliance.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "Local-first by default. Ollama bound to localhost. No external data leakage by design.",
  },
];

function FeaturesSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <motion.div
        className="relative max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-mono border-primary/30 text-primary">
            CORE CAPABILITIES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need for{" "}
            <span className="text-primary">financial AI</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A complete runtime for building, evaluating, and deploying
            quantitative forecasting agents.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}>
              <Card className="h-full hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ArchitectureSection() {
  const layers = [
    { label: "Web Dashboard", detail: "React + TypeScript", icon: Code2, color: "text-chart-3" },
    { label: "SDK Client", detail: "Typed API Client", icon: Zap, color: "text-chart-5" },
    { label: "FastAPI Backend", detail: "Predict / Backtest / Models", icon: Activity, color: "text-primary" },
    { label: "Forecasting Engine", detail: "Baselines + ML Models", icon: BarChart3, color: "text-chart-2" },
    { label: "Data Layer", detail: "PostgreSQL + Audit Trail", icon: Database, color: "text-chart-4" },
  ];

  return (
    <section className="relative py-32 px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-mono border-primary/30 text-primary">
            ARCHITECTURE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Clean, <span className="text-primary">modular</span> stack
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Each layer is independent and replaceable. Contribute a model,
            swap the LLM, or build a custom frontend.
          </p>
        </motion.div>

        <div className="space-y-3">
          {layers.map((layer, i) => (
            <motion.div key={layer.label} variants={fadeUp}>
              <Card className="hover-elevate">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-card text-sm font-mono text-muted-foreground border border-border/50">
                    {i + 1}
                  </div>
                  <layer.icon className={`h-5 w-5 ${layer.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{layer.label}</p>
                    <p className="text-xs text-muted-foreground">{layer.detail}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function BenchmarkSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <motion.div
        className="relative max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-mono border-primary/30 text-primary">
            BENCHMARKS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Reproducible <span className="text-primary">evaluation</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Walk-forward evaluation ensures no lookahead bias. Every result is
            reproducible and auditable.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "MAE", value: "Tracked", desc: "Mean Abs Error" },
                  { label: "MAPE", value: "Tracked", desc: "Mean Abs % Error" },
                  { label: "Dir. Acc", value: "Tracked", desc: "Directional Accuracy" },
                  { label: "Hit Rate", value: "Tracked", desc: "Interval Coverage" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="text-center p-3 rounded-md bg-background/50"
                  >
                    <p className="text-xs text-muted-foreground font-mono">{m.label}</p>
                    <p className="text-lg font-bold text-primary mt-1">{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-md bg-background/30 border border-border/30 font-mono text-xs text-muted-foreground">
                <p className="text-primary/80 mb-2">walk-forward methodology</p>
                <p>train_window = [t-252, t-1] &rarr; predict t+horizon</p>
                <p>roll forward 1 day, retrain, repeat</p>
                <p className="mt-2 text-foreground/60">No future data leaks. Period.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ContributeSection() {
  return (
    <section className="relative py-32 px-6">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-mono border-primary/30 text-primary">
            OPEN SOURCE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for the <span className="text-primary">community</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto mb-10">
            Add a forecasting model, improve the engine, or build integrations.
            Every contribution makes financial AI more accessible.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
          <a href="https://github.com/openflama" target="_blank" rel="noopener noreferrer">
            <Button size="lg" data-testid="button-contribute">
              <SiGithub className="mr-2 h-4 w-4" />
              Contribute on GitHub
            </Button>
          </a>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" data-testid="button-try-dashboard">
              Try the Dashboard
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary/60" />
            <span>MIT License</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary/60" />
            <span>TypeScript + Python</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary/60" />
            <span>PostgreSQL</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/flama-logo.png" alt="OpenFlama" className="h-5 w-5" />
          <span className="font-bold text-sm">
            Open<span className="text-primary">Flama</span>
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            Financial Large-Language Agentic Model Agora
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
          <a href="https://github.com/maquenflow/openflama" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
            <SiGithub className="h-3.5 w-3.5" />
            GitHub
          </a>
          <Link href="/docs" className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Docs
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/flama-logo.png" alt="OpenFlama" className="h-6 w-6" />
            <span className="font-bold text-base">
              Open<span className="text-primary">Flama</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-3">
            <a href="https://github.com/maquenflow/openflama" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" data-testid="button-nav-github">
                <SiGithub className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/docs">
              <Button variant="ghost" size="sm" data-testid="button-nav-docs">
                <BookOpen className="mr-1.5 h-4 w-4" />
                Documentation
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" data-testid="button-nav-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-nav-mobile-toggle"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl px-6 py-3 space-y-2">
            <a
              href="https://github.com/maquenflow/openflama"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover-elevate"
              data-testid="link-mobile-github"
            >
              <SiGithub className="h-4 w-4" />
              GitHub
            </a>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
              <span
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover-elevate cursor-pointer"
                data-testid="link-mobile-docs"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </span>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <span
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-primary font-medium hover-elevate cursor-pointer"
                data-testid="link-mobile-dashboard"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </span>
            </Link>
          </div>
        )}
      </nav>

      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <BenchmarkSection />
      <ContributeSection />
      <Footer />
    </div>
  );
}
