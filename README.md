# TripSync

TripSync is a responsive travel planning and shared expense management app built with plain HTML, CSS, JavaScript, and browser LocalStorage. It is designed to be easy to read, demo, and extend.

## Run locally

1. Open the `tripsync` folder in VS Code.
2. Install the **Live Server** extension, or use any static file server.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Open the displayed local URL in a browser. No backend, build step, package install, or account is required.

The app seeds a Kyoto sample trip the first time it runs. Data is stored under the `tripsync_trips` LocalStorage key and is shared by every page on the same origin.

## Features

- Landing page with product overview and responsive travel-inspired visual design
- Dashboard with total, upcoming, completed, empty, and delete states
- Create trips with validation, budget, date range, image URL, and predefined cover choices
- Trip overview with dynamic duration, countdown, budget balance, expenses, members, and next activity
- Members with admin/member roles, initials, email, add, and remove behavior
- Day-wise itinerary sorted by day and time with add, edit, and delete
- Place suggestions with categories, suggested-by labels, delete, and per-member vote toggling
- Expenses with categories, dates, payer, selected split members, equal shares, and deletion
- Settlement table showing paid, owed, and final balance plus minimized suggested transfers

## Suggested demo path

Open the dashboard and inspect the seeded Kyoto trip. Visit **Itinerary** to add an activity, **Places** to suggest and vote on a destination, **Expenses** to add a shared cost, and **Settlement** to see the balance update. Add a member, refresh the page, and confirm the data remains. Create a second trip to test the dashboard filters and delete confirmation.

## Project structure

```text
tripsync/
├── index.html
├── dashboard.html
├── create-trip.html
├── trip.html
├── css/style.css
├── js/app.js
├── js/dashboard.js
├── js/trips.js
├── js/trip.js
├── js/itinerary.js
├── js/places.js
├── js/expenses.js
├── js/settlement.js
├── js/members.js
└── assets/images/
```

## Notes

Cover photos use remote Unsplash image URLs for the demo presentation. Replace them with local images in `assets/images/` if you want the project to run fully offline. To reset the seeded demo, clear site data for the Live Server origin in browser developer tools.
