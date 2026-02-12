import Link from "next/link";
import { ArrowRight, Zap, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(226_71%_40%/0.15),transparent)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-20 text-center md:pb-32 md:pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-primary" />
          <span>Tu catalogo online en minutos</span>
        </div>

        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Vende mas por redes sociales con tu{" "}
          <span className="text-primary">catalogo digital</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Crea tu catalogo personalizado, comparte el enlace con tus clientes y
          recibe pedidos directamente en tu WhatsApp. Sin complicaciones.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2 text-base">
            <Link href="/auth/login">
              Crear mi catalogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-base bg-transparent"
          >
            <a href="#how-it-works">Ver como funciona</a>
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Tu propia URL
            </span>
            <span className="text-xs text-muted-foreground">
              tutienda.catalogoya.com
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
            <MessageCircle className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Pedidos por WhatsApp
            </span>
            <span className="text-xs text-muted-foreground">
              Directo a tu telefono
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Listo en minutos
            </span>
            <span className="text-xs text-muted-foreground">
              Sin conocimientos tecnicos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
