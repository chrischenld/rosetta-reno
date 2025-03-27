import { cn } from "@/lib/utils";
import React, { createContext, useState, forwardRef, useContext } from "react";

interface SelectContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	focusedElement?: "control" | "slot" | null;
	handleFocus?: (element: "control" | "slot") => void;
	handleBlur?: () => void;
}

export const SelectContext = createContext<SelectContextValue | undefined>(
	undefined
);

export interface SelectProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

export interface SelectControlProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	/** Additional CSS classes */
	className?: string;
}

export interface SelectSlotProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

export interface SelectOptionProps {
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

const SelectControl = forwardRef<HTMLSelectElement, SelectControlProps>(
	({ className, children, ...props }, ref) => {
		const [open, setOpen] = useState(false);
		const context = useContext(SelectContext);

		return (
			<SelectContext.Provider value={{ open, setOpen }}>
				<select
					ref={ref}
					onFocus={() => context?.handleFocus?.("control")}
					onBlur={() => context?.handleBlur?.()}
					className={cn(
						"h-[44px] min-w-fit bg-transparent text-[var(--rosetta-gray-100)] text-[14px] ring-offset-0 disabled:cursor-not-allowed disabled:bg-[var(--rosetta-gray-800)] focus-visible:outline-none appearance-none moz-appearance-none webkit-appearance-none",
						className
					)}
					{...props}
				>
					{children}
				</select>
			</SelectContext.Provider>
		);
	}
);

SelectControl.displayName = "Select.Control";

const SelectSlot = ({ children, className }: SelectSlotProps) => {
	const context = useContext(SelectContext);

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

SelectSlot.displayName = "Select.Slot";

const Option = ({ children, className, ...props }: SelectOptionProps) => {
	return (
		<option className={className} {...props}>
			{children}
		</option>
	);
};

Option.displayName = "Select.Option";

export const Select = ({ children, className }: SelectProps) => {
	const { focusedElement, handleFocus, handleBlur } = useFocusState();

	return (
		<SelectContext.Provider
			value={{
				open: false,
				setOpen: () => {},
				focusedElement,
				handleFocus,
				handleBlur,
			}}
		>
			<div
				className={cn(
					"flex h-[44px] min-w-fit items-center rounded-[2px] px-[11px] py-[6px] ring-offset-0 bg-[var(--rosetta-gray-900)]",
					// Only show focus ring when Control is focused
					focusedElement === "control" &&
						"focus-within:ring-2 focus-within:ring-[var(--rosetta-gray-100)]",
					className
				)}
			>
				<div className="flex min-w-fit gap-[6px]">{children}</div>
			</div>
		</SelectContext.Provider>
	);
};

Select.displayName = "Select";

Select.Control = SelectControl;
Select.Slot = SelectSlot;
Select.Option = Option;
