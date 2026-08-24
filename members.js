window.renderMembers = function(trip) {
  return `<div class="module-head"><h2>Travel companions</h2><button class="button button-accent" onclick="window.openMemberForm()">+ Add member</button></div><div id="memberForm"></div><div class="panel">${trip.members.map((m) => `<div class="member-row"><div class="avatar-stack"><i>${TripSync.initials(m.name)}</i></div><div class="row-main"><strong>${TripSync.esc(m.name)} <span class="muted">${m.role}</span></strong><small>${TripSync.esc(m.email || "No email added")}</small></div>${m.role !== "Admin" ? `<button class="row-actions" onclick="window.removeMember('${m.id}')">Remove</button>` : ""}</div>`).join("")}</div>`;
};
window.openMemberForm = function() {
  document.getElementById("memberForm").innerHTML =
    `<form class="inline-form" id="memberFormInner"><label>Name<input name="name" required></label><label>Email<input name="email" type="email"></label><button class="button button-dark form-submit">Add member →</button></form>`;
  document.getElementById("memberFormInner").onsubmit = (e) => {
    e.preventDefault();
    let d = new FormData(e.target);
    trip.members.push({
      id: TripSync.id("member"),
      name: d.get("name"),
      email: d.get("email"),
      role: "Member",
    });
    TripSync.update(trip);
    window.renderTab("members");
    TripSync.toast("Member added");
  };
};
window.removeMember = function(id) {
  if (confirm("Remove this member?")) {
    trip.members = trip.members.filter((m) => m.id !== id);
    trip.expenses.forEach((e) => {
      e.splitAmong = e.splitAmong.filter((x) => x !== id);
      if (e.paidBy === id) e.paidBy = trip.members[0].id;
    });
    TripSync.update(trip);
    window.renderTab("members");
  }
};