document.addEventListener("DOMContentLoaded", () => {
  window.trip = TripSync.current();
  const app = document.getElementById("tripApp");
  if (!window.trip) {
    app.innerHTML =
      '<div class="empty-state"><h3>No trip found</h3><a class="button button-accent" href="dashboard.html">Back to dashboard →</a></div>';
    return;
  }
  const tabs = [
    ["overview", "Overview"],
    ["itinerary", "Itinerary"],
    ["places", "Places"],
    ["expenses", "Expenses"],
    ["settlement", "Settlement"],
    ["members", "Members"],
  ];
  app.innerHTML = `<section class="trip-hero" style="background-image:url('${trip.coverImage}')"><div><p class="kicker">${TripSync.esc(trip.destination)} · ${TripSync.status(trip)}</p><h1>${TripSync.esc(trip.name)}</h1><p>${TripSync.date(trip.startDate)} — ${TripSync.date(trip.endDate)} · ${TripSync.days(trip)} days</p></div></section><nav class="trip-tabs">${tabs.map((t) => `<button class="trip-tab" data-tab="${t[0]}">${t[1]}</button>`).join("")}</nav><section id="tripContent" class="trip-content"></section>`;
  document
    .querySelectorAll(".trip-tab")
    .forEach((btn) => (btn.onclick = () => window.renderTab(btn.dataset.tab)));
  window.renderTab = function(name = "overview") {
    document
      .querySelectorAll(".trip-tab")
      .forEach((x) => x.classList.toggle("active", x.dataset.tab === name));
    let content = document.getElementById("tripContent");
    if (name === "overview") content.innerHTML = overview();
    if (name === "itinerary") content.innerHTML = window.renderItinerary(trip);
    if (name === "places") content.innerHTML = window.renderPlaces(trip);
    if (name === "expenses") content.innerHTML = window.renderExpenses(trip);
    if (name === "settlement")
      content.innerHTML = window.renderSettlement(trip);
    if (name === "members") content.innerHTML = window.renderMembers(trip);
  };
  window.editTrip = function() {
    let name = prompt("Trip name:", trip.name),
      destination = prompt("Destination:", trip.destination),
      budget = prompt("Budget in ₹:", trip.budget);
    if (
      !name ||
      !destination ||
      budget === null ||
      Number.isNaN(Number(budget))
    )
      return;
    trip.name = name.trim();
    trip.destination = destination.trim();
    trip.budget = Number(budget);
    TripSync.update(trip);
    location.reload();
  };

  function overview() {
    let total = trip.expenses.reduce((n, e) => n + Number(e.amount), 0),
      next = [...trip.itinerary].sort(
        (a, b) => a.day - b.day || a.time.localeCompare(b.time),
      )[0];
    let countdown = Math.ceil(
      (new Date(trip.startDate) - new Date()) / 86400000,
    );
    return `<div class="overview-grid"><div class="panel"><div class="module-head"><h2>At a glance</h2><button class="button button-dark" onclick="window.editTrip()">Edit trip</button></div><p>${TripSync.esc(trip.description || "A shared plan for a memorable journey.")}</p><div class="metric-grid"><div class="metric"><strong>${TripSync.days(trip)}</strong><small>Days</small></div><div class="metric"><strong>${trip.members.length}</strong><small>Members</small></div><div class="metric"><strong>${TripSync.money(total)}</strong><small>Spent</small></div><div class="metric"><strong>${TripSync.money(trip.budget - total)}</strong><small>Remaining</small></div></div></div><div class="panel"><h2>Trip pulse</h2><p class="kicker">${countdown > 0 ? countdown + " days until takeoff" : "Your trip is underway"}</p><h3>${next ? TripSync.esc(next.title) : "Your itinerary is wide open"}</h3><p class="muted">${next ? `Day ${next.day} · ${next.time} · ${TripSync.esc(next.location)}` : "Add an activity to give the days a little shape."}</p><button class="button button-dark" onclick="window.renderTab('itinerary')">View itinerary →</button></div></div>`;
  }
  window.renderTab("overview");
});