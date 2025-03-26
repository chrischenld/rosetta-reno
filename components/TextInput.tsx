"use client";

import React from "react";
import {
	forwardRef,
	createContext,
	useState,
	useEffect,
	useContext,
} from "react";
import { useFieldContext } from "./field-context";
import { cn } from "@/lib/utils";

interface TextInputContextValue {
	id?: string;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	error?: string;
	focusedElement?: "control" | "slot" | null;
	handleFocus?: (element: "control" | "slot") => void;
	handleBlur?: () => void;
}

export const TextInputContext = createContext<
	TextInputContextValue | undefined
>(undefined);

export interface TextInputProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

export interface TextInputControlProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Additional CSS classes */
	className?: string;
}

export interface TextInputSlotProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

const useFocusState = () => {
	const [focusedElement, setFocusedElement] = useState<
		"control" | "slot" | null
	>(null);

	const handleFocus = (element: "control" | "slot") => {
		setFocusedElement(element);
	};

	const handleBlur = () => {
		setFocusedElement(null);
	};

	return {
		focusedElement,
		handleFocus,
		handleBlur,
	};
};

const TextInputControl = forwardRef<HTMLInputElement, TextInputControlProps>(
	({ className, type = "text", disabled, ...props }, ref) => {
		const { id, name, required, error } = useFieldContext();
		const context = useContext(TextInputContext);

		return (
			<input
				id={id}
				name={name}
				ref={ref}
				type={type}
				disabled={disabled}
				required={required}
				aria-invalid={!!error}
				onFocus={() => context?.handleFocus?.("control")}
				onBlur={() => context?.handleBlur?.()}
				className={cn(
					"h-[44px] w-full bg-transparent text-sm ring-offset-0 placeholder:text-[var(--rosetta-gray-400)] focus-visible:outline-none disabled:cursor-not-allowed",
					disabled && "placeholder:text-[var(--rosetta-gray-600)]",
					className
				)}
				{...props}
			/>
		);
	}
);

TextInputControl.displayName = "TextInput.Control";

const TextInputSlot = ({ children, className }: TextInputSlotProps) => {
	const context = useContext(TextInputContext);

	// Clone children to add focus handlers
	const childrenWithFocus = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(
				child as React.ReactElement<{
					onFocus?: () => void;
					onBlur?: () => void;
				}>,
				{
					onFocus: () => context?.handleFocus?.("slot"),
					onBlur: () => context?.handleBlur?.(),
				}
			);
		}
		return child;
	});

	return (
		<div
			className={cn(
				"flex items-center text-[var(--rosetta-gray-400)] text-[14px]",
				className
			)}
		>
			{childrenWithFocus}
		</div>
	);
};

TextInputSlot.displayName = "TextInput.Slot";

export const TextInput = ({ children, className }: TextInputProps) => {
	const fieldContext = useFieldContext();
	const { focusedElement, handleFocus, handleBlur } = useFocusState();
	const [contextValue, setContextValue] = useState(fieldContext);

	// Update context when field context changes, but preserve disabled state
	useEffect(() => {
		setContextValue((prev) => ({
			...fieldContext,
			disabled: prev.disabled,
		}));
	}, [fieldContext]);

	// Find the Control component and get its disabled state
	const controlDisabled = React.Children.toArray(children).find(
		(child): child is React.ReactElement<TextInputControlProps> =>
			React.isValidElement(child) && child.type === TextInputControl
	)?.props?.disabled;

	// Update context when Control's disabled state changes
	useEffect(() => {
		if (controlDisabled !== undefined) {
			setContextValue((prev) => ({ ...prev, disabled: controlDisabled }));
		}
	}, [controlDisabled]);

	return (
		<TextInputContext.Provider
			value={{
				...contextValue,
				focusedElement,
				handleFocus,
				handleBlur,
			}}
		>
			<div
				className={cn(
					"flex gap-[6px] h-[44px] w-full items-center rounded-[2px] px-[11px] py-[6px] ring-offset-0",
					// Only show focus ring when Control is focused
					focusedElement === "control" &&
						"focus-within:ring-2 focus-within:ring-[var(--rosetta-gray-100)]",
					!contextValue.disabled && "bg-[var(--rosetta-gray-900)]",
					contextValue.disabled && [
						"bg-[var(--rosetta-gray-800)] cursor-not-allowed",
						// Make all children show not-allowed cursor
						"[&_*]:cursor-not-allowed",
					],
					contextValue.error &&
						"border border-[var(--rosetta-red-400)] focus-within:ring-[var(--rosetta-red-400)]",
					className
				)}
			>
				{children}
			</div>
		</TextInputContext.Provider>
	);
};

TextInput.displayName = "TextInput";

TextInput.Control = TextInputControl;
TextInput.Slot = TextInputSlot;
