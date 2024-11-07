from icalendar import Calendar
import requests

# URL of the Canvas .ics file
ics_url = "https://howardcc.instructure.com/feeds/calendars/user_3a1R4w3Vd0DuP7TNtNreCSFO8CZUUJg9Jrfn844P.ics"

def fetch_and_parse_ics(url):
    response = requests.get(url)
    response.raise_for_status()
    calendar = Calendar.from_ical(response.content)

    events = []
    for component in calendar.walk():
        if component.name == "VEVENT":
            summary = component.get("summary")
            start_date = component.get("dtstart").dt.strftime("%Y-%m-%d %H:%M")
            events.append(f"<li><strong>{summary}</strong> - {start_date}</li>")
    return events

events = fetch_and_parse_ics(ics_url)

# Write HTML content
with open("index.html", "w") as file:
    file.write("<html><body>")
    file.write("<h1>Canvas To-Do List</h1>")
    file.write("<ul>")
    file.write("\n".join(events))
    file.write("</ul>")
    file.write("</body></html>")
