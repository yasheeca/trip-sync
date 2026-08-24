window.renderPlaces = function(trip) {
  let members = trip.members;
  return `<div class="module-head"><h2>Places to explore</h2><button class="button button-accent" onclick="window.openPlaceForm()">+ Suggest a place</button></div><div id="placeForm"></div><div class="place-grid">${
    [...trip.places]
      .sort((a, b) => b.votes.length - a.votes.length)
      .map((p) => {
        let voted = p.votes.includes(members[0]?.id);
        return `<article class="place-card"><span class="kicker">${TripSync.esc(p.category)}</span><h3>${TripSync.esc(p.name)}</h3><p>${TripSync.esc(p.description || "No description yet.")}</p><div class="place-foot"><span>Suggested by ${TripSync.esc(members.find((m) => m.id === p.suggestedBy)?.name || "You")}</span><span><button class="filter" onclick="window.votePlace('${p.id}')">${voted ? "♥" : "♡"} ${p.votes.length}</button><button class="row-actions" onclick="window.removePlace('${p.id}')">×</button></span></div></article>`;
      })
      .join("") ||
    '<div class="empty-state"><h3>Your shared wish list is empty</h3><p>Put the first pin on the map.</p></div>'
  }</div>`;
};
window.openPlaceForm = function() {
  document.getElementById("placeForm").innerHTML =
    `<form class="inline-form" id="placeFormInner"><label>Place name<input name="name" required></label><label>Category<select name="category"><option>Nature</option><option>Adventure</option><option>Food</option><option>Shopping</option><option>Historical</option><option>Entertainment</option><option>Other</option></select></label><label class="full">Description<textarea name="description"></textarea></label><button class="button button-dark form-submit">Add place →</button></form>`;
  document.getElementById("placeFormInner").onsubmit = (e) => {
    e.preventDefault();
    let d = new FormData(e.target);
    trip.places.push({
      id: TripSync.id("place"),
      name: d.get("name"),
      description: d.get("description"),
      category: d.get("category"),
      suggestedBy: trip.members[0]?.id,
      votes: [],
    });
    TripSync.update(trip);
    window.renderTab("places");
    TripSync.toast("Place added");
  };
};
window.votePlace = function(id) {
  let p = trip.places.find((x) => x.id === id),
    member = trip.members[0]?.id;
  if (!p || !member) return;
  p.votes = p.votes.includes(member) ?
    p.votes.filter((x) => x !== member) :
    [...p.votes, member];
  TripSync.update(trip);
  window.renderTab("places");
};
window.removePlace = function(id) {
  if (confirm("Remove this place suggestion?")) {
    trip.places = trip.places.filter((x) => x.id !== id);
    TripSync.update(trip);
    window.renderTab("places");
  }
};