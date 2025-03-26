import { cn } from "@/lib/utils";

interface ButtonProps {
	label: string;
	variant?: "primary" | "text";
	size?: "small" | "medium" | "large";
}

export function Button({
	label,
	variant = "primary",
	size = "medium",
}: ButtonProps) {
	return (
		<button
			type="submit"
			className={cn(
				"w-full font-Clarkson font-medium text-[14px] rounded-[2px] hover:cursor-pointer",
				variant === "primary" &&
					"px-[11px] py-[6px] bg-[var(--rosetta-gray-100)] hover:bg-[var(--rosetta-gray-200)] text-[var(--rosetta-gray-base)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--rosetta-gray-100)]",
				variant === "text" &&
					"text-[var(--rosetta-gray-100)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--rosetta-gray-100)]",
				size === "small" && "h-auto",
				size === "medium" && "h-[36px]",
				size === "large" && "h-[44px]"
			)}
		>
			{label}
		</button>
	);
}
