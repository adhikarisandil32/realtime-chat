import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loading({ className }: { className?: string }) {
  return (
    <div className="col-span-full">
      <LoaderCircle
        size={20}
        className={cn("animate-spin mx-auto", className)}
      />
    </div>
  );
}
