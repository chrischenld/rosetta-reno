"use client";

import type React from "react";

import { useFieldContext } from "./field-context";
import { cn } from "@/lib/utils";

export interface ErrorMessageProps {
	/** Error message (overrides the one from context) */
	children?: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

export function ErrorMessage({ children, className }: ErrorMessageProps) {
	const { id, error } = useFieldContext();
	const content = children || error;

	if (!content) return null;

	return (
		<p
			id={`${id}-error`}
			className={cn(
				"text-[12px] line-height-[16px] text-[var(--rosetta-red-300)]",
				className
			)}
			aria-live="polite"
		>
			{content}
		</p>
	);
}
