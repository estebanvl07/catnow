import { UserPlus, Package, Share2, ShoppingCart } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "1. Registrate",
    description:
      "Crea tu cuenta con Google en segundos. Elige un nombre y slug para tu tienda.",
  },
  {
    icon: Package,
    title: "2. Agrega productos",
    description:
      "Sube tus productos con fotos, precios y categorias. Organiza todo a tu gusto.",
  },
  {
    icon: Share2,
    title: "3. Personaliza y comparte",
    description:
      "Elige un diseno para tu catalogo, configura tus colores y comparte tu enlace unico.",
  },
  {
    icon: ShoppingCart,
    title: "4. Recibe pedidos",
    description:
      "Tus clientes navegan tu catalogo y te envian su pedido directo a WhatsApp.",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border bg-muted/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            En 4 simples pasos tendras tu catalogo online listo para vender.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
