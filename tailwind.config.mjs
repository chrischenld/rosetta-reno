/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				rosetta: {
					gray: {
						100: "#0e0e0e",
						200: "#454545",
						300: "#666666",
						400: "#767676",
						500: "#949494",
						600: "#b7b7b7",
						700: "#d3d3d3",
						800: "#e7e7e7",
						900: "#f2f2f2",
						950: "#f9f9f9",
						base: "#ffffff",
					},
				},
			},
		},
	},
	plugins: [],
};
