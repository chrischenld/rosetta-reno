import { cn } from "@/lib/utils";
import React, {
	createContext,
	useState,
	forwardRef,
	useContext,
	useRef,
	useEffect,
} from "react";

interface DropdownContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	value: string | undefined;
	setValue: (value: string) => void;
	focusedElement?: "control" | "slot" | null;
	handleFocus?: (element: "control" | "slot") => void;
	handleBlur?: () => void;
}

export const DropdownContext = createContext<DropdownContextValue | undefined>(
	undefined
);

export interface DropdownProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

export interface DropdownControlProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
	/** Default value */
	value?: string;
	/** onChange handler */
	onChange?: (value: string) => void;
}

export interface DropdownSlotProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
}

export interface DropdownOptionProps {
	/** Child components */
	children: React.ReactNode;
	/** Additional CSS classes */
	className?: string;
	/** Option value */
	value?: string;
	/** Click handler */
	onClick?: () => void;
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

const DropdownControl = forwardRef<HTMLDivElement, DropdownControlProps>(
	({ className, children, value: initialValue, onChange, ...props }, ref) => {
		const context = useContext(DropdownContext);
		const controlRef = useRef<HTMLDivElement>(null);
		const [selectedText, setSelectedText] = useState<string>("");
		const [position, setPosition] = useState({
			isFirst: false,
			isLast: false,
		});

		// Initialize the value if provided
		useEffect(() => {
			if (initialValue && context) {
				context.setValue(initialValue);
			} else if (
				context &&
				(!context.value || context.value === "") &&
				React.Children.count(children) > 0
			) {
				// Initialize with first option's value if no value is provided
				const firstChild = React.Children.toArray(children)[0];
				if (React.isValidElement<DropdownOptionProps>(firstChild)) {
					const defaultValue =
						firstChild.props.value ||
						firstChild.props.children?.toString() ||
						"";
					context.setValue(defaultValue);
				}
			}
		}, [initialValue, context, children]);

		// Update selected text when context value changes
		useEffect(() => {
			if (!context) return;

			// Find the option with the matching value and get its text
			React.Children.forEach(children, (child) => {
				if (
					React.isValidElement<DropdownOptionProps>(child) &&
					child.props.value === context.value
				) {
					setSelectedText(child.props.children?.toString() || "");
				}
			});

			// If no value is selected, use the first option's text
			if (!context.value && React.Children.count(children) > 0) {
				const firstChild = React.Children.toArray(children)[0];
				if (React.isValidElement<DropdownOptionProps>(firstChild)) {
					setSelectedText(firstChild.props.children?.toString() || "");
				}
			}
		}, [context?.value, children]);

		// Detect position based on DOM structure when mounted
		useEffect(() => {
			const node = controlRef.current;
			if (!node || !node.parentElement) return;

			// Check if we're the first child
			const isFirst = node === node.parentElement.firstElementChild;

			// Check if we're the last child
			const isLast = node === node.parentElement.lastElementChild;

			setPosition({ isFirst, isLast });
		}, []);

		const handleClick = () => {
			if (context) {
				context.setOpen(!context.open);
			}
		};

		// Handle option selection
		const handleSelect = (value: string) => {
			if (context) {
				context.setValue(value);
				context.setOpen(false);
				if (onChange) {
					onChange(value);
				}
			}
		};

		// Clone children to add selection handlers and ensure they have values
		const optionsWithHandlers = React.Children.map(children, (child) => {
			if (React.isValidElement<DropdownOptionProps>(child)) {
				// Generate a value if none is provided
				const optionValue =
					child.props.value || child.props.children?.toString() || "";
				return React.cloneElement(child, {
					value: optionValue, // Ensure the value is set on the option
					onClick: () => handleSelect(optionValue),
				});
			}
			return child;
		});

		return (
			<DropdownContext.Provider
				value={{
					open: context?.open || false,
					setOpen: context?.setOpen || (() => {}),
					value: context?.value || "",
					setValue: context?.setValue || (() => {}),
					focusedElement: context?.focusedElement,
					handleFocus: context?.handleFocus,
					handleBlur: context?.handleBlur,
				}}
			>
				<div ref={controlRef} className={cn("relative flex-1 h-full")}>
					<div
						ref={ref}
						onClick={handleClick}
						onFocus={() => context?.handleFocus?.("control")}
						onBlur={() => context?.handleBlur?.()}
						className={cn(
							"h-full w-full flex items-center cursor-pointer",
							className
						)}
						tabIndex={0}
						{...props}
					>
						<div
							className={cn(
								"flex flex-row justify-between w-full h-full items-center",
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
								className={cn(
									"ml-1 flex-shrink-0 text-[var(--rosetta-gray-400)] transition-transform",
									context?.open ? "transform rotate-180" : ""
								)}
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

					{/* Custom dropdown menu */}
					{context?.open && (
						<div className="absolute z-50 w-full mt-1 bg-[var(--rosetta-gray-base)] rounded-[2px] shadow-lg py-1 max-h-[200px] overflow-y-auto">
							{optionsWithHandlers}
						</div>
					)}
				</div>
			</DropdownContext.Provider>
		);
	}
);

DropdownControl.displayName = "Dropdown.Control";

const DropdownSlot = ({ children, className }: DropdownSlotProps) => {
	const context = useContext(DropdownContext);
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

DropdownSlot.displayName = "Dropdown.Slot";

const Option = ({
	children,
	className,
	value,
	onClick,
	...props
}: DropdownOptionProps) => {
	const context = useContext(DropdownContext);
	const isSelected = value !== undefined && context?.value === value;

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onClick) onClick();
	};

	return (
		<div
			className={cn(
				"px-[11px] py-2 hover:bg-[var(--rosetta-gray-700)] cursor-pointer text-[var(--rosetta-gray-100)] text-[14px]",
				isSelected && "bg-[var(--rosetta-gray-900)]",
				className
			)}
			onClick={handleClick}
			{...props}
		>
			<div className="flex items-center justify-between w-full">
				<span>{children}</span>
				{isSelected && (
					<svg
						className="ml-2 text-[var(--rosetta-gray-100)]"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M20 6L9 17L4 12"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</div>
		</div>
	);
};

Option.displayName = "Dropdown.Option";

export const Dropdown = ({ children, className }: DropdownProps) => {
	const { focusedElement, handleFocus, handleBlur } = useFocusState();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string>();
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<DropdownContext.Provider
			value={{
				open,
				setOpen,
				value: value || "",
				setValue,
				focusedElement: focusedElement,
				handleFocus: handleFocus,
				handleBlur: handleBlur,
			}}
		>
			<div
				ref={dropdownRef}
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
		</DropdownContext.Provider>
	);
};

Dropdown.displayName = "Dropdown";

Dropdown.Control = DropdownControl;
Dropdown.Slot = DropdownSlot;
Dropdown.Option = Option;
