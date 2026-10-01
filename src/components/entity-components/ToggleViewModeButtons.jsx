import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ToggleButtonGroupStyles } from "./ToggleButtonGroup.styles.js"
import {
	LayoutGrid,
	List,
	Trello,
} from "lucide-react";

export default function ToggleViewModeButtons({viewMode, setViewMode}) {
	return (
		<div className="mb-6">
			<ToggleButtonGroup
				value={viewMode}
				exclusive
				onChange={(event, newViewMode) => {
					if (newViewMode !== null) setViewMode(newViewMode);
				}}
				sx={ToggleButtonGroupStyles}
			>
				<ToggleButton value="cards" aria-label="cards view">
					<LayoutGrid size={18} style={{ marginRight: "8px" }} />
					Cards
				</ToggleButton>
				<ToggleButton value="table" aria-label="table view">
					<List size={18} style={{ marginRight: "8px" }} />
					Table
				</ToggleButton>
				<ToggleButton value="kanban" aria-label="kanban view">
					<Trello size={18} style={{ marginRight: "8px" }} />
					Groups
				</ToggleButton>
			</ToggleButtonGroup>
		</div>
	);
}
