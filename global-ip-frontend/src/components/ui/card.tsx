import * as React from "react";

import { cn } from "./utils";

interface CardProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
  hoverable?: boolean;
}

function Card({ 
  className, 
  variant = 'default',
  interactive = false,
  hoverable = true,
  ...props 
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Base styles
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border transition-all duration-300",
        // Variant styles
        variant === 'elevated' && 'shadow-md hover:shadow-lg border-border/50',
        variant === 'outlined' && 'border-2 shadow-sm hover:shadow-md border-border/70',
        variant === 'default' && 'shadow-sm hover:shadow-md border-border/50',
        // Interactive states
        interactive && 'cursor-pointer hover:border-primary/50',
        hoverable && 'hover:border-border/100',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
