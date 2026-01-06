import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ onClick, className, ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border border-foreground rounded-sm px-3 cursor-pointer",
        className
      )}
      {...props}
    />
  );
}
