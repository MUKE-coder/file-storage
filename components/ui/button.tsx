import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.2)] rounded-lg",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-lg",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",

        // New gradient variant (Variant One)
        gradient:
          "rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/40 hover:from-indigo-600 hover:to-fuchsia-500",

        // New outline-pill variant (Variant Two)
        "outline-pill":
          "rounded-full border border-slate-200 bg-white px-5 py-2.5 text-slate-800 shadow-sm shadow-slate-200 hover:border-slate-300 hover:shadow-md",

        // New dark variant (Variant Three)
        dark: "rounded bg-slate-900 px-5 py-2 font-medium text-white shadow-lg shadow-slate-900/40 hover:bg-purple-800",

        // New light-pill variant (Variant Four)
        "light-pill":
          "rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-800 shadow-sm shadow-slate-200/60 hover:border-slate-300 hover:shadow-md",

        // Themed gradient variants
        ocean:
          "rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/40 hover:from-cyan-600 hover:to-blue-600",

        sunset:
          "rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-orange-500/40 hover:from-orange-600 hover:to-pink-600",

        forest:
          "rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-600 hover:to-green-600",
      },
      size: {
        default: "h-11 px-4 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
