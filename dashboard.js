document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("tripGrid"),
    stats = document.getElementById("dashboardStats");
  let trips = TripSync.load(),
    filter = "all";

  function render() {
    let upcoming = trips.filter((t) => TripSync.status(t) === "upcoming"),
      shown =
      filter === "all" ?
      trips :
      trips.filter((t) => TripSync.status(t) === filter);
    stats.innerHTML = `<div class="stat"><strong>${trips.length}</strong><span>Total trips</span></div><div class="stat"><strong>${upcoming.length}</strong><span>On the horizon</span></div><div class="stat"><strong>${trips.reduce((n, t) => n + t.members.length, 0)}</strong><span>Travel companions</span></div>`;
    grid.innerHTML = shown.length ?
      shown
      .map(
        (t) =>
        `<article class="trip-card"><a href="trip.html?id=${t.id}"><div class="trip-card-image" style="background-image:url('${t.coverImage}')"></div><span class="trip-status">${TripSync.status(t)}</span><div class="trip-card-body"><p>${TripSync.esc(t.destination)}</p><h3>${TripSync.esc(t.name)}</h3><div class="trip-meta"><span>${TripSync.date(t.startDate)} — ${TripSync.date(t.endDate)}</span><span>◉ ${t.members.length}</span></div></div></a><button class="delete-trip" data-id="${t.id}">Delete trip</button></article>`,
      )
      .join("") :
      `<div class="empty-state"><div class="feature-icon">✦</div><h3>No trips here yet</h3><p>Your next story is waiting to be planned.</p><a class="button button-accent" href="create-trip.html">Create your first trip →</a></div>`;
    grid.querySelectorAll(".delete-trip").forEach(
      (btn) =>
      (btn.onclick = () => {
        if (confirm("Delete this trip and all its details?")) {
          TripSync.remove(btn.dataset.id);
          trips = TripSync.load();
          render();
          TripSync.toast("Trip deleted");
        }
      }),
    );
  }
  document.querySelectorAll(".filter").forEach(
    (btn) =>
    (btn.onclick = () => {
      document.querySelector(".filter.active").classList.remove("active");
      btn.classList.add("active");
      filter = btn.dataset.filter;
      render();
    }),
  );
  render();
});