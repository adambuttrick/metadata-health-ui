import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertTriangle, ChevronDown } from "lucide-react"
import { Text } from "@/components/typography/typography"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-red-600/50 bg-red-50 text-red-900 dark:border-red-500/50 dark:bg-red-950 dark:text-red-200 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <Text
    ref={ref}
    variant="h3"
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </Text>
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <Text
    ref={ref}
    variant="body"
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  >
    {children}
  </Text>
))
AlertDescription.displayName = "AlertDescription"

interface AlertErrorProps {
  title: string;
  description: string;
  details?: string[];
  className?: string;
}

function AlertError({ title, description, details, className }: AlertErrorProps) {
  return (
    <Alert 
      variant="destructive" 
      className={className}
      aria-live="polite"
      aria-atomic="true"
    >
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
      <AlertDescription className="space-y-2">
        <Text variant="body" className="text-base">{description}</Text>
        {details && details.length > 0 && (
          <details className="text-sm">
            <summary className="flex items-center gap-1 cursor-pointer font-medium hover:underline">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 [open]:rotate-180" />
              Details
            </summary>
            <ul className="mt-2 list-disc pl-4 space-y-1">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
}

export { Alert, AlertTitle, AlertDescription, AlertError }
