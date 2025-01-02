import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  message?: string
}

export function LoadingOverlay({
  isLoading,
  children,
  className,
  message = "Loading..."
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className="relative">
      {children}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center",
          "bg-white/80 backdrop-blur-sm transition-all duration-200",
          className
        )}
      >
        <Spinner size="lg" />
        {message && (
          <p className="mt-2 text-sm text-datacite-dark-blue">{message}</p>
        )}
      </div>
    </div>
  )
}
