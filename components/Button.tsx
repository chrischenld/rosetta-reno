interface ButtonProps {
	label: string;
}

export function Button({ label }: ButtonProps) {
	return (
		<button
			type="submit"
			className="w-full font-Clarkson font-medium text-[14px] rounded-[2px] bg-[var(--rosetta-gray-100)] px-[11px] py-[6px] h-[44px] text-[var(--rosetta-gray-base)] hover:bg-[var(--rosetta-gray-200)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--rosetta-gray-100)]"
		>
			{label}
		</button>
	);
}
