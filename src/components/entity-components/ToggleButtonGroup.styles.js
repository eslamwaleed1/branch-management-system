export const ToggleButtonGroupStyles = {
	backgroundColor: "white",
	border: "1px solid #e5e7eb",
	borderRadius: "8px",
	padding: "4px",
	"& .MuiToggleButton-root": {
		textTransform: "none",
		fontSize: "0.875rem",
		fontWeight: 500,
		padding: "8px 16px",
		color: "#6b7280",
		border: "none",
		"&:hover": {
			backgroundColor: "#f3f4f6",
		},
		"&.Mui-selected": {
			backgroundColor: "#3b82f6",
			color: "white",
			"&:hover": {
				backgroundColor: "#2563eb",
			},
		},
	},
};
