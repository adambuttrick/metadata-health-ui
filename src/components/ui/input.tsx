"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  description?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, description, id, "aria-describedby": ariaDescribedby, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const descriptionId = `${inputId}-description`
    
    const describedBy = [
      ariaDescribedby,
      error ? errorId : null,
      description ? descriptionId : null,
    ].filter(Boolean).join(" ") || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500 focus-visible:ring-red-500" : "border-input",
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={describedBy}
            ref={ref}
            {...props}
          />
        </div>
        {description && (
          <p
            id={descriptionId}
            className="mt-1 text-sm text-gray-500"
          >
            {description}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }