import {Users} from "lucide-react"

export default function NoEntityFound({ entity }) {
	return (
		<div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
			<Users className="mx-auto text-gray-300" size={32} />
            <p className="mt-3 text-sm text-gray-500">No {entity}s found.</p>
		</div>
	);
}
