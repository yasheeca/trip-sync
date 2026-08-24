window.renderItinerary = function(trip) {
  const items = [...trip.itinerary].sort(
    (a, b) => a.day - b.day || a.time.localeCompare(b.time),
  );
  let rows = items
    .map(function(item) {
      return (
        '<div class="activity-row"><div class="row-main"><strong>Day ' +
        item.day +
        " · " +
        TripSync.esc(item.title) +
        "</strong><small>" +
        item.time +
        " · " +
        TripSync.esc(item.location) +
        (item.description ? " · " + TripSync.esc(item.description) : "") +
        '</small></div><div class="row-actions"><button onclick="window.openItineraryForm(\'' +
        item.id +
        "')\">Edit</button><button onclick=\"window.removeItinerary('" +
        item.id +
        "')\">Delete</button></div></div>"
      );
    })
    .join("");
  return (
    '<div class="module-head"><h2>Day-wise itinerary</h2><button class="button button-accent" onclick="window.openItineraryForm()">+ Add activity</button></div><div id="itineraryForm"></div>' +
    (rows ||
      '<div class="empty-state"><h3>Nothing scheduled yet</h3><p>Add a first anchor for the adventure.</p></div>')
  );
};
window.openItineraryForm = function(id) {
  const item = trip.itinerary.find((x) => x.id === id) || {};
  document.getElementById("itineraryForm").innerHTML =
    '<form class="inline-form" id="itForm"><label>Day<input name="day" type="number" min="1" max="' +
    TripSync.days(trip) +
    '" value="' +
    (item.day || 1) +
    '" required></label><label>Time<input name="time" type="time" value="' +
    (item.time || "09:00") +
    '" required></label><label>Activity title<input name="title" value="' +
    TripSync.esc(item.title || "") +
    '" required></label><label>Location<input name="location" value="' +
    TripSync.esc(item.location || "") +
    '"></label><label class="full">Description<textarea name="description">' +
    TripSync.esc(item.description || "") +
    '</textarea></label><button class="button button-dark form-submit">' +
    (id ? "Save changes" : "Add activity") +
    " →</button></form>";
  document.getElementById("itForm").onsubmit = function(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const next = {
      id: id || TripSync.id("item"),
      day: Number(data.get("day")),
      time: data.get("time"),
      title: data.get("title"),
      location: data.get("location"),
      description: data.get("description"),
    };
    trip.itinerary = id ?
      trip.itinerary.map((x) => (x.id === id ? next : x)) :
      [...trip.itinerary, next];
    TripSync.update(trip);
    window.renderTab("itinerary");
    TripSync.toast(id ? "Activity updated" : "Activity added");
  };
};
window.removeItinerary = function(id) {
  if (confirm("Delete this activity?")) {
    trip.itinerary = trip.itinerary.filter((x) => x.id !== id);
    TripSync.update(trip);
    window.renderTab("itinerary");
  }
};