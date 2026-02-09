import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"

export default function StoreNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Store className="h-16 w-16 text-muted-foreground/40" />
      <h1 className="mt-6 text-2xl font-bold text-foreground">
        Tienda no encontrada
      </h1>
      <p className="mt-2 text-center text-muted-foreground">
        La tienda que buscas no existe o fue eliminada.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Ir al inicio</Link>
      </Button>
    </div>
  )
}
