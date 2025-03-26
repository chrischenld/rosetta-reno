"use client";

import React from "react";
import { FieldProvider } from "./field-context";

export interface FieldProps {
	/** The name attribute for the input */
	name?: string;
	/** Error message to display */
	error?: string;
	/** Whether the field is disabled */
	disabled?: boolean;
	/** Whether the field is required */
	required?: boolean;
	/** Description text for the field */
	description?: string;
	/** Child components */
	children: React.ReactNode;
	/** Optional custom ID (auto-generated if not provided) */
	id?: string;
	/** Additional CSS classes */
	className?: string;
}

export function Field({
	name,
	error,
	disabled = false,
	required = false,
	description,
	children,
	id: customId,
	className,
}: FieldProps) {
	// Generate a unique ID if not provided
	const generatedId = React.useId();
	const id = customId || generatedId;

	return (
		<FieldProvider
			value={{
				id,
				name,
				error,
				disabled,
				required,
				description,
			}}
		>
			<div className={`flex flex-col gap-[6px] ${className}`}>{children}</div>
		</FieldProvider>
	);
}
