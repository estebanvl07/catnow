import React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaStoreToStore } from "@/lib/db"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const storeRow = await prisma.store.findFirst({
    where: { userId: session.user.id },
  })

  if (!storeRow) {
    redirect("/onboarding")
  }

  const store = mapPrismaStoreToStore(storeRow)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar store={store} userEmail={session.user.email ?? ""} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
