import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mes",
    description: "Ideal para empezar tu negocio online.",
    features: [
      "Hasta 25 productos",
      "1 catalogo personalizado",
      "Pedidos por WhatsApp",
      "3 disenos de catalogo",
      "Soporte por email",
    ],
    cta: "Empezar ahora",
    highlighted: false,
  },
  {
    name: "Medium",
    price: "$19.900",
    period: "/mes",
    description: "Para negocios en crecimiento.",
    features: [
      "Hasta 150 productos",
      "1 catalogo personalizado",
      "Pedidos por WhatsApp",
      "3 disenos de catalogo",
      "Logo personalizado",
      "Soporte prioritario",
    ],
    cta: "Empezar ahora",
    highlighted: true,
    badge: "Popular",
  },
  {
    name: "Super store",
    price: "$39.900",
    period: "/mes",
    description: "Para tiendas con gran inventario.",
    features: [
      "Hasta 300 productos",
      "1 catalogo personalizado",
      "Pedidos por WhatsApp",
      "3 disenos de catalogo",
      "Logo personalizado",
      "Colores personalizados",
      "Soporte prioritario 24/7",
    ],
    cta: "Empezar ahora",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Planes y precios
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Elige el plan que mejor se adapte a tu negocio. Sin contratos,
            cancela cuando quieras.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-8 bg-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="mb-8 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full"
              >
                <Link href="/auth/login">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Plan */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Plan Custom
              </h3>
              <p className="mt-1 text-muted-foreground">
                Necesitas mas productos o funcionalidades especiales? Hablemos.
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="shrink-0 gap-2 bg-transparent"
            >
              <a href="#contact">
                <MessageCircle className="h-4 w-4" />
                Contactanos
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
