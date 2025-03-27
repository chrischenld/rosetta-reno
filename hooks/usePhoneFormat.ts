import { useEffect } from "react";

export const usePhoneFormat = (
	value: string,
	onChange: (value: string) => void
) => {
	useEffect(() => {
		// Remove all non-digits
		const digits = value.replace(/\D/g, "");

		// Format the number
		let formatted = "";
		if (digits.length > 0) {
			formatted += digits.slice(0, 3); // First 3 digits
			if (digits.length > 3) {
				formatted += "-" + digits.slice(3, 6); // Next 3 digits
				if (digits.length > 6) {
					formatted += "-" + digits.slice(6, 10); // Last 4 digits
				}
			}
		}

		// Only update if the formatted value is different
		if (formatted !== value) {
			onChange(formatted);
		}
	}, [value, onChange]);
};
