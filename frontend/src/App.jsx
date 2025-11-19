import "./App.css";
import {useEffect, useState} from "react"

const FILTER_OPTIONS = [
	{label: "Last week", days: 7},
	{label: "Last month", days: 30},
	{label: "Last year", days: 365},
	{label: "All time", days: 0}
];

//separate component for each quote
function Quote({name, message, time}){
	const formattedDate = time ? new Date(time).toLocaleString(): "";

	return(
		<div className="quote">
			<p className="quote-message">“{message}”</p>
			<div className="quote-meta">
				<span className="quote-name">— {name}</span>
				{formattedDate && <span className="quote-date">{formattedDate}</span>}
			</div>
		</div>
	);
}

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAgeDays, setMaxAgeDays] = useState(0);
	const [loading, setLoading] = useState(false);

	//fetch quotes from backend
	const fetchQuotes = async (ageDays = maxAgeDays) => {
		try {
		setLoading(true);
		const days = Number(ageDays);
		const params = days > 0 ? `?max_age_days=${days}` : "";
		const res = await fetch(`/api/quotes${params}`);

		if (!res.ok) {
			console.error("Failed to load quotes");
			return;
		}

		const data = await res.json();
		setQuotes(data);
		} catch (err) {
		console.error("Error loading quotes:", err);
		} finally {
		setLoading(false);
		}
	};

	//load quotes on first render and whenever the filter changes
	useEffect(() => {
		fetchQuotes();
		
	}, [maxAgeDays]);

	//custom form submission so the page doesn't refresh
	const handleSubmit = async (event) => {
		event.preventDefault(); //stop full page reload

		const form = event.target;
		const formData = new FormData(form);

		try {
		const res = await fetch("/api/quote", {
			method: "POST",
			body: formData, 
		});

		if (!res.ok) {
			console.error("Failed to submit quote");
			return;
		}

		const newQuote = await res.json();

		//add the new quote to the end of the list
		setQuotes((prev) => [...prev, newQuote]);

		//clear form fields
		form.reset();
		} catch (err) {
		console.error("Error submitting quote:", err);
		}
	};

	return (
		<div className="App">
			<h1>Hack at UCI Tech Deliverable</h1>

			<img src = "quotebook.png" alt = "Quote book icon" className = "quote-icon"/>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form onSubmit={handleSubmit} className = "quote-form">
				<label htmlFor = "input-name"> Name </label>
				<input type = "text" name = "name" id = "input-name" required />

				<label htmlFor = "input-message"> Quote </label>
				<input type = "text" name = "message" id = "input-message" required />

				<button type = "submit"> Submit </button>
			</form>
			
			{/* OLD CODE
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>
			*/}

			{/* filter for last week/month/year/all time */}
			<div className = "filter-row">
				<label htmlFor = "quote-filter"> Show quotes from: </label>
				<select
					id = "quote-filter"
					value = {maxAgeDays}
					onChange={(e) => setMaxAgeDays(Number(e.target.value))}
				>
					{FILTER_OPTIONS.map((opt) => (
						<option key = {opt.label} value = {opt.days}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
				{loading && <p>Loading quotes…</p>}

				{!loading && quotes.length === 0 && (
				<p>No quotes yet. Be the first to add one!</p>
				)}

				{!loading &&
				quotes.map((q, index) => (
					<Quote
					key={index} // small app; ok to use index, or use name+time
					name={q.name}
					message={q.message}
					time={q.time}
					/>
				))}
			</div>

			{/* OLD CODE
				<div className="messages">
					<p>Peter Anteater</p>
					<p>Zot Zot Zot!</p>
					<p>Every day</p>
				</div>
			*/}
		</div>
	);
}

export default App;
