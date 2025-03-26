"use client";

import type React from "react";

import { useFieldContext } from "./field-context";
import { cn } from "@/lib/utils";

export interface LabelProps {
	/** Label text */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
	/** Whether to hide the required indicator */
	hideRequiredIndicator?: boolean;
}

export function Label({
	children,
	className,
	hideRequiredIndicator = true,
}: LabelProps) {
	const { id, required } = useFieldContext();

	return (
		<label
			htmlFor={id}
			className={cn(
				"text-[12px] font-medium line-height-[16px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
				className
			)}
		>
			{children}
			{required && !hideRequiredIndicator && (
				<span className="ml-1 text-destructive">*</span>
			)}
		</label>
	);
}
