document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createTripForm");
  if (!form) return;
  document.querySelectorAll(".image-choice").forEach(
    (btn) =>
    (btn.onclick = () => {
      document
        .querySelector(".image-choice.selected")
        ?.classList.remove("selected");
      btn.classList.add("selected");
      form.selectedImage.value = btn.dataset.image;
    }),
  );
  form.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (new Date(data.get("endDate")) < new Date(data.get("startDate"))) {
      TripSync.toast("End date must be after the start date");
      return;
    }
    const trip = {
      id: TripSync.id("trip"),
      name: data.get("name").trim(),
      destination: data.get("destination").trim(),
      description: data.get("description").trim(),
      startDate: data.get("startDate"),
      endDate: data.get("endDate"),
      budget: Number(data.get("budget")),
      coverImage: data.get("coverImage").trim() || data.get("selectedImage"),
      members: [{
        id: TripSync.id("member"),
        name: "You",
        email: "",
        role: "Admin"
      }, ],
      itinerary: [],
      places: [],
      expenses: [],
    };
    TripSync.save([trip, ...TripSync.load()]);
    localStorage.setItem(TripSync.currentKey, trip.id);
    location.href = `trip.html?id=${trip.id}`;
  };
});