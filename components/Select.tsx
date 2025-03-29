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
	({ className, children, value, ...props }, ref) => {
		const [open, setOpen] = useState(false);
		const context = useContext(SelectContext);
		const controlRef = React.useRef<HTMLDivElement>(null);
		const selectRef = React.useRef<HTMLSelectElement>(null);
		const [selectedText, setSelectedText] = React.useState<string>("");
		const [position, setPosition] = React.useState({
			isFirst: false,
			isLast: false,
		});

		// Update selected text when select value changes
		React.useEffect(() => {
			// Use the DOM to get the selected option text
			if (selectRef.current) {
				const select = selectRef.current;
				const selectedOption = select.options[select.selectedIndex];
				if (selectedOption) {
					setSelectedText(selectedOption.textContent || "");
				}
			}
		}, [value]);

		// Detect position based on DOM structure when mounted
		React.useEffect(() => {
			const controlNode = controlRef.current;
			if (!controlNode || !controlNode.parentElement) return;

			// Check if we're the first child
			const isFirst =
				controlNode === controlNode.parentElement.firstElementChild;

			// Check if we're the last child
			const isLast = controlNode === controlNode.parentElement.lastElementChild;

			setPosition({ isFirst, isLast });
		}, []);

		return (
			<SelectContext.Provider value={{ open, setOpen }}>
				<div ref={controlRef} className={cn("relative flex-1 h-full")}>
					<select
						ref={(node) => {
							// Handle both refs - the forwarded one and our internal one
							if (typeof ref === "function") {
								ref(node);
							} else if (ref) {
								ref.current = node;
							}
							selectRef.current = node;
						}}
						value={value}
						onFocus={() => context?.handleFocus?.("control")}
						onBlur={() => context?.handleBlur?.()}
						onChange={(e) => {
							// Update the selected text when the select changes
							setSelectedText(
								e.target.options[e.target.selectedIndex].textContent || ""
							);
							// Call the original onChange if provided
							if (props.onChange) {
								props.onChange(e);
							}
						}}
						className={cn(
							"absolute opacity-0 inset-0 h-full w-full bg-transparent text-[var(--rosetta-gray-100)] text-[14px] ring-offset-0 disabled:cursor-not-allowed disabled:bg-[var(--rosetta-gray-800)] focus-visible:outline-none appearance-none moz-appearance-none webkit-appearance-none cursor-pointer",
							className
						)}
						{...props}
					>
						{children}
					</select>
					<div
						className={cn(
							"flex flex-row space-between w-full h-full items-center pointer-events-none",
							// Add left padding if it's first control
							position.isFirst ? "pl-[11px]" : "pl-[11px]",
							// Add right padding if it's last control
							position.isLast ? "pr-[11px]" : "pr-[11px]"
						)}
					>
						<span className="w-full whitespace-nowrap text-[var(--rosetta-gray-100)] text-[14px]">
							{selectedText}
						</span>
						<svg
							className="ml-1 flex-shrink-0 text-[var(--rosetta-gray-400)]"
							width="10"
							height="6"
							viewBox="0 0 10 6"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1 1L5 5L9 1"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</SelectContext.Provider>
		);
	}
);

SelectControl.displayName = "Select.Control";

const SelectSlot = ({ children, className }: SelectSlotProps) => {
	const context = useContext(SelectContext);
	const slotRef = React.useRef<HTMLDivElement>(null);
	const [position, setPosition] = React.useState({
		isFirst: false,
		isLast: false,
	});

	// Detect position based on DOM structure when mounted
	React.useEffect(() => {
		const slotNode = slotRef.current;
		if (!slotNode || !slotNode.parentElement) return;

		// Check if we're the first child
		const isFirst = slotNode === slotNode.parentElement.firstElementChild;

		// Check if we're the last child
		const isLast = slotNode === slotNode.parentElement.lastElementChild;

		setPosition({ isFirst, isLast });
	}, []);

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
			ref={slotRef}
			className={cn(
				"flex items-center text-[var(--rosetta-gray-400)] text-[14px]",
				// Add left padding if it's first or the only slot
				position.isFirst ? "pl-[11px]" : "",
				// Add right padding if it's last or the only slot
				position.isLast ? "pr-[11px]" : "",
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
					"flex h-[44px] min-w-fit items-center rounded-[2px] ring-offset-0 bg-[var(--rosetta-gray-900)]",
					// Only show focus ring when Control is focused
					focusedElement === "control" &&
						"focus-within:ring-2 focus-within:ring-[var(--rosetta-gray-100)]",
					className
				)}
			>
				<div className="flex w-full min-w-fit h-full">{children}</div>
			</div>
		</SelectContext.Provider>
	);
};

Select.displayName = "Select";

Select.Control = SelectControl;
Select.Slot = SelectSlot;
Select.Option = Option;
