"use client";

import type React from "react";

import { useFieldContext } from "./field-context";
import { cn } from "@/lib/utils";

export interface DescriptionProps {
	/** Description text */
	children?: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

export function Description({ children, className }: DescriptionProps) {
	const { id, description } = useFieldContext();
	const content = children || description;

	if (!content) return null;

	return (
		<p
			id={`${id}-description`}
			className={cn(
				"text-[12px] line-height-[16px] text-[var(--rosetta-gray-300)]",
				className
			)}
		>
			{content}
		</p>
	);
}
