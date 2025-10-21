import { useState } from "react";
import { Send } from "lucide-react";

export default function SendAnnouncementCard() {
	const [message, setMessage] = useState("");
	const [announcements, setAnnouncements] = useState([]);
	const [sending, setSending] = useState(false);

	const handleSend = async () => {
		if (!message.trim()) return;

		setSending(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setAnnouncements((prev) => [
			{ id: Date.now(), content: message, time: new Date().toLocaleTimeString() },
			...prev,
		]);

		// Reset
		setMessage("");
		setSending(false);

		// Later, replace with something like:
		// await fetch("/api/announcements", {
		//   method: "POST",
		//   headers: { "Content-Type": "application/json" },
		//   body: JSON.stringify({ message }),
		// });
	};

	return (
		<div className="bg-white rounded-2xl shadow-md p-5 w-full max-w-[60%]">
			<h2 className="text-lg font-semibold text-gray-700 mb-3">
				Send Announcement
			</h2>

			<textarea
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type your message..."
				className="w-full h-24 border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 mb-3"
			/>

			<button
				onClick={handleSend}
				disabled={sending || !message.trim()}
				className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full font-medium text-white transition-all ${
					sending || !message.trim()
						? "bg-gray-300 cursor-not-allowed"
						: "bg-green-500 hover:bg-green-600"
				}`}
			>
				{sending ? "Sending..." : "Send"}
				{!sending && <Send size={16} />}
			</button>

            {/*Recent announcements */}
			{/* {announcements.length > 0 && (
				<div className="mt-5">
					<h3 className="text-sm text-gray-500 mb-2">Recent Announcements</h3>
					<ul className="space-y-2 max-h-40 overflow-y-auto">
						{announcements.map((a) => (
							<li
								key={a.id}
								className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 flex justify-between items-center"
							>
								<span>{a.content}</span>
								<span className="text-xs text-gray-400">{a.time}</span>
							</li>
						))}
					</ul>
				</div>
			)} */}
		</div>
	);
}
