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
	return (
		<div className="App">
			<h1>Hack at UCI Tech Deliverable</h1>

			<img src = "quotebook.png" alt = "Quote book icon" className = "quote-icon"/>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
				<p>Peter Anteater</p>
				<p>Zot Zot Zot!</p>
				<p>Every day</p>
			</div>
		</div>
	);
}

export default App;
