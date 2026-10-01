import { Link } from "react-router-dom";

export default function AddEntityLink({entity, link}) {
	return (
		<Link
			to={link}
			className="rounded-sm bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
		>
			+ Add New {entity}
		</Link>
	);
}
