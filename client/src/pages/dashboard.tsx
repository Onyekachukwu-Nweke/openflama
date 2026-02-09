import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  ChevronDown,
  Loader2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  Layers,
  AlertTriangle,
  X,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import type { Prediction } from "@shared/schema";

const predictFormSchema = z.object({
  ticker: z.string().min(1, "Ticker is required").max(10),
  horizon: z.enum(["1d", "5d", "20d"]),
  target: z.enum(["return", "price"]),
});

type PredictForm = z.infer<typeof predictFormSchema>;

function PredictFormCard() {
  const { toast } = useToast();
  const [result, setResult] = useState<Prediction | null>(null);

  const form = useForm<PredictForm>({
    resolver: zodResolver(predictFormSchema),
    defaultValues: {
      ticker: "",
      horizon: "5d",
      target: "return",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PredictForm) => {
      const res = await apiRequest("POST", "/api/v1/predict", data);
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/v1/predictions"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Prediction failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PredictForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <Activity className="h-4 w-4 text-primary" />
            New Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Ticker</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="AAPL"
                        className="font-mono uppercase"
                        data-testid="input-ticker"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="horizon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Horizon</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-horizon">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1d">1 Day</SelectItem>
                          <SelectItem value="5d">5 Days</SelectItem>
                          <SelectItem value="20d">20 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Target</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-target">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="return">Return %</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="button-predict"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PredictionResultCard prediction={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PredictionResultCard({ prediction }: { prediction: Prediction }) {
  const isPositive = prediction.forecast >= 0;
  const targetLabel = prediction.target === "return" ? "%" : "";

  return (
    <Card data-testid="card-prediction-result">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">{prediction.ticker}</span>
            <Badge variant="outline" className="text-xs font-mono">
              {prediction.horizon}
            </Badge>
          </div>
          <Badge
            variant="secondary"
            className={isPositive ? "text-emerald-400" : "text-red-400"}
          >
            {isPositive ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {prediction.forecast.toFixed(4)}{targetLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-2.5 rounded-md bg-background/50 text-center">
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="font-mono text-sm mt-0.5 text-red-400">
              {prediction.intervalLow.toFixed(4)}
            </p>
          </div>
          <div className="p-2.5 rounded-md bg-primary/10 text-center">
            <p className="text-xs text-muted-foreground">Forecast</p>
            <p className="font-mono text-sm font-bold mt-0.5">
              {prediction.forecast.toFixed(4)}
            </p>
          </div>
          <div className="p-2.5 rounded-md bg-background/50 text-center">
            <p className="text-xs text-muted-foreground">High</p>
            <p className="font-mono text-sm mt-0.5 text-emerald-400">
              {prediction.intervalHigh.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-muted-foreground">Model</span>
            <span className="font-mono">{prediction.modelUsed}</span>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-muted-foreground">Data Window</span>
            <span className="font-mono">{prediction.dataWindow}</span>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-muted-foreground">Trace</span>
            <span className="font-mono text-primary/80 truncate max-w-[180px]">
              {prediction.traceId}
            </span>
          </div>
        </div>

        {prediction.explanation && (
          <div className="p-3 rounded-md bg-background/30 border border-border/30">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {prediction.explanation}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {prediction.featuresUsed.map((f) => (
            <Badge key={f} variant="outline" className="text-xs font-mono">
              {f}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentPredictions() {
  const { data: predictions, isLoading } = useQuery<Prediction[]>({
    queryKey: ["/api/v1/predictions"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No predictions yet. Generate your first forecast above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Predictions
          </CardTitle>
          <Badge variant="outline" className="text-xs font-mono">
            {predictions.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Ticker</TableHead>
                <TableHead className="text-xs">Horizon</TableHead>
                <TableHead className="text-xs">Forecast</TableHead>
                <TableHead className="text-xs">Interval</TableHead>
                <TableHead className="text-xs">Model</TableHead>
                <TableHead className="text-xs">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((p) => (
                <TableRow key={p.id} data-testid={`row-prediction-${p.id}`}>
                  <TableCell className="font-mono font-medium text-sm">
                    {p.ticker}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-mono">
                      {p.horizon}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`font-mono text-sm ${
                      p.forecast >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {p.forecast >= 0 ? "+" : ""}
                    {p.forecast.toFixed(4)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    [{p.intervalLow.toFixed(3)}, {p.intervalHigh.toFixed(3)}]
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.modelUsed}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ModelsCard() {
  const { data: models, isLoading } = useQuery<
    Array<{ id: string; name: string; type: string; description: string }>
  >({
    queryKey: ["/api/v1/models"],
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2 flex-wrap">
          <Layers className="h-4 w-4 text-muted-foreground" />
          Available Models
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : models && models.length > 0 ? (
          <div className="space-y-2">
            {models.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-2.5 rounded-md bg-background/50"
                data-testid={`model-${m.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono shrink-0">
                  {m.type}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No models available
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function HealthStatus() {
  const { data, isLoading, error } = useQuery<{
    status: string;
    version: string;
    models_available: number;
  }>({
    queryKey: ["/api/v1/health"],
    refetchInterval: 30000,
  });

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
      ) : error ? (
        <div className="h-2 w-2 rounded-full bg-red-500" />
      ) : (
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
      )}
      <span className="text-xs text-muted-foreground font-mono">
        {data?.version || "v0.1.0"}
      </span>
    </div>
  );
}

const DISMISS_KEY = "openflama_dashboard_overlay_dismissed";

function PreviewOverlay() {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem(DISMISS_KEY) === "true";
  });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "true");
  }, []);

  useEffect(() => {
    if (dismissed) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleDismiss();
    }
    document.addEventListener("keydown", onKeyDown);

    cardRef.current?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismissed, handleDismiss]);

  if (dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-overlay-title"
    >
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      <Card
        ref={cardRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md outline-none"
        data-testid="card-preview-overlay"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3"
          onClick={handleDismiss}
          aria-label="Close"
          data-testid="button-close-overlay"
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="pt-8 pb-6 px-6 text-center space-y-5">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-2">
            <h2
              id="preview-overlay-title"
              className="text-xl font-bold tracking-tight"
              data-testid="text-preview-title"
            >
              Preview not available
            </h2>
            <p
              className="text-sm text-muted-foreground"
              data-testid="text-preview-subtitle"
            >
              Currently under development.
            </p>
          </div>

          <p className="text-sm text-muted-foreground/80">
            Want to help finish it?
          </p>

          <div className="space-y-2">
            <a
              href="https://github.com/maquenflow/openflama"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full" data-testid="button-contribute-github">
                <SiGithub className="mr-2 h-4 w-4" />
                Contribute on GitHub
              </Button>
            </a>
            <p className="text-xs text-muted-foreground/60">PRs welcome.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewOverlay />

      <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">
                Open<span className="text-primary">Flama</span>
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                / Dashboard
              </span>
            </div>
          </div>
          <HealthStatus />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          <div className="space-y-4">
            <PredictFormCard />
            <ModelsCard />
          </div>
          <div>
            <RecentPredictions />
          </div>
        </div>
      </main>
    </div>
  );
}
