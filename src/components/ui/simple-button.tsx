import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const simpleButtonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95",
        secondary: "border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 active:scale-95",
        ghost:     "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:scale-95",
      },
      size: {
        sm: "h-8  px-3 text-xs  gap-1.5 rounded-md",
        md: "h-9  px-4 text-sm  gap-2   rounded-lg",
        lg: "h-11 px-5 text-base gap-2  rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const iconSizeClasses = { sm: "size-3", md: "size-4", lg: "size-5" } as const;

export interface SimpleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof simpleButtonVariants> {
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const SimpleButton = React.forwardRef<HTMLButtonElement, SimpleButtonProps>(
  ({ className, variant, size = "md", icon, isLoading, children, disabled, ...props }, ref) => {
    const iconClass = cn(iconSizeClasses[size ?? "md"], "shrink-0");

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(simpleButtonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={cn(iconClass, "animate-spin")} />
        ) : (
          icon && <span className={cn(iconClass, "[&>svg]:size-full")}>{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

SimpleButton.displayName = "SimpleButton";

export { SimpleButton, simpleButtonVariants };
