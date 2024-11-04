async function fetchCalendarData() {
  // Use the CORS proxy to bypass restrictions
  const icsUrl = "https://calendar.google.com/calendar/embed?src=clq96farh6pfv4m53gb98hr6r3apstkv%40import.calendar.google.com&ctz=America%2FNew_York";

  try {
    const response = await fetch(icsUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const icsText = await response.text();
    parseICS(icsText);
  } catch (error) {
    document.getElementById("todo-list").innerText = "Failed to load events. " + error.message;
    console.error("Error fetching calendar:", error);
  }
}

function parseICS(icsText) {
  const jcalData = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");

  const events = vevents.map(event => {
    const summary = event.getFirstPropertyValue("summary");
    const startDate = event.getFirstPropertyValue("dtstart").toJSDate();
    return { summary, startDate };
  });

  displayEvents(events);
}

function displayEvents(events) {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = ""; // Clear the loading text

  // Sort events by date
  events.sort((a, b) => a.startDate - b.startDate);

  // Display each event as a to-do item
  events.forEach(event => {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";
    const dateString = event.startDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    todoItem.innerHTML = `<strong>${event.summary}</strong><br><small>${dateString}</small>`;
    todoList.appendChild(todoItem);
  });
}

fetchCalendarData();
