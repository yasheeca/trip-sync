const TripSync = {
  key: "tripsync_trips",
  currentKey: "tripsync_current",
  images: {
    coast: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85",
  },
  id(prefix = "id") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  },
  load() {
    let trips = JSON.parse(localStorage.getItem(this.key) || "null");
    if (!trips) {
      trips = [{
        id: this.id("trip"),
        name: "A week in Kyoto",
        destination: "Kyoto, Japan",
        description: "Temples, tiny ramen bars, and slow mornings under the maples.",
        startDate: "2026-10-14",
        endDate: "2026-10-21",
        budget: 85000,
        coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
        members: [{
            id: "m-arun",
            name: "Arun Mehta",
            email: "arun@example.com",
            role: "Admin",
          },
          {
            id: "m-priya",
            name: "Priya Shah",
            email: "",
            role: "Member"
          },
          {
            id: "m-rahul",
            name: "Rahul Das",
            email: "",
            role: "Member"
          },
        ],
        itinerary: [{
            id: "i-1",
            day: 1,
            title: "Fushimi Inari at sunrise",
            time: "08:00",
            location: "Fushimi Inari Shrine",
            description: "Beat the crowds and climb the first gates.",
          },
          {
            id: "i-2",
            day: 1,
            title: "Dinner in Gion",
            time: "19:30",
            location: "Gion",
            description: "A table booked for the whole crew.",
          },
        ],
        places: [{
          id: "p-1",
          name: "Arashiyama Bamboo Grove",
          description: "A quiet walk among Kyoto’s iconic bamboo.",
          category: "Nature",
          suggestedBy: "m-priya",
          votes: ["m-arun", "m-priya"],
        }, ],
        expenses: [{
            id: "e-1",
            title: "Rail passes",
            amount: 18000,
            category: "Travel",
            date: "2026-10-14",
            paidBy: "m-arun",
            splitAmong: ["m-arun", "m-priya", "m-rahul"],
          },
          {
            id: "e-2",
            title: "First night dinner",
            amount: 7500,
            category: "Food",
            date: "2026-10-14",
            paidBy: "m-priya",
            splitAmong: ["m-arun", "m-priya", "m-rahul"],
          },
        ],
      }, ];
      this.save(trips);
    }
    return trips;
  },
  save(trips) {
    localStorage.setItem(this.key, JSON.stringify(trips));
  },
  get(id) {
    return this.load().find((t) => t.id === id);
  },
  current() {
    let id =
      new URLSearchParams(location.search).get("id") ||
      localStorage.getItem(this.currentKey);
    let trip = this.get(id) || this.load()[0];
    if (trip) localStorage.setItem(this.currentKey, trip.id);
    return trip;
  },
  update(trip) {
    let trips = this.load().map((item) => (item.id === trip.id ? trip : item));
    this.save(trips);
  },
  remove(id) {
    this.save(this.load().filter((t) => t.id !== id));
  },
  esc(value = "") {
    return String(value).replace(
      /[&<>"']/g,
      (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
    );
  },
  money(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  },
  date(value) {
    return value ?
      new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) :
      "—";
  },
  days(trip) {
    return Math.max(
      1,
      Math.ceil(
        (new Date(trip.endDate) - new Date(trip.startDate)) / 86400000,
      ) + 1,
    );
  },
  status(trip) {
    return new Date(`${trip.endDate}T23:59:59`) < new Date() ?
      "completed" :
      "upcoming";
  },
  toast(message) {
    let el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2600);
  },
  initials(name) {
    return name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  },
};
window.TripSync = TripSync;
document
  .querySelector(".menu-toggle")
  ?.addEventListener("click", () =>
    document.querySelector(".nav-links")?.classList.toggle("open"),
  );