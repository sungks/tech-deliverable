from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator, Optional

from fastapi import FastAPI, Form, Query, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return quote


# TODO: add another API route with a query parameter to retrieve quotes based on max age
@app.get("/quotes")
def get_quotes(
    max_age_days: Optional[int] = Query(
        None,
        ge = 0,
        description = "Max age of quotes in days. 0 or omitted = all time.",
    )
)-> list[Quote]:
    # Retrive the quotes from the database; if max_age_days is None or 0, return all the quotes
    # otherwise, return only the quotes that are within the last max_age_days days

    quotes = database["quotes"]

    if max_age_days is None or max_age_days == 0:
        return sorted(quotes, key=lambda q: q["time"]) #sort quotes in chronolical order
    
    now = datetime.now
    cutoff = now - timedelta(days = max_age_days)

    filtered: list[Quote] = []
    for q in quotes:
        try:
            q_time = datetime.fromisoformate(q["time"])
        except ValueError:
            #if the time is malformed in any way, choose to keep or skip it
            filtered.append(q)
            continue
        
        if q_time >= cutoff:
            filtered.append(q)
    
    #sort the final filtered list and return
    filtered.sort(key = lambda q: q["time"])
    return filtered