"use client";

import type React from "react";

import { forwardRef } from "react";
import { useFieldContext } from "./field-context";
import { cn } from "@/lib/utils";

export interface TextInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Additional CSS classes */
	className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ className, type = "text", ...props }, ref) => {
		const { id, name, disabled, required, error } = useFieldContext();

		return (
			<input
				id={id}
				name={name}
				ref={ref}
				type={type}
				disabled={disabled}
				required={required}
				aria-invalid={!!error}
				className={cn(
					"flex h-[44px] w-full rounded-[2px] bg-[var(--rosetta-gray-900)] px-[11px] py-[6px] text-sm ring-offset-0 placeholder:text-[var(--rosetta-gray-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rosetta-gray-100)] disabled:cursor-not-allowed disabled:bg-[var(--rosetta-gray-800)]",
					error &&
						"border border-[var(--rosetta-red-400)] focus-visible:ring-[var(--rosetta-red-400)]",
					className
				)}
				{...props}
			/>
		);
	}
);

TextInput.displayName = "TextInput";
