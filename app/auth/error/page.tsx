import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Error de autenticacion
        </h1>
        <p className="max-w-md text-muted-foreground">
          Ocurrio un error al iniciar sesion. Por favor, intenta de nuevo.
        </p>
      </div>
      <Button asChild>
        <Link href="/auth/login">Volver al inicio de sesion</Link>
      </Button>
    </main>
  )
}
