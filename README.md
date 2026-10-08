# Kino XII 🎬

A cinema ticket booking app for the Kino XII cinema network, built as the assignment for **Redberry Bootcamp XII**.

🔗 **Live:** https://redberry-bootcamp-cinema-task.vercel.app

---

## Features

### Home
- Animated hero carousel with the featured movies
- **Recently viewed** movies (saved in the browser)
- **Now Playing** cards with age rating, runtime, "from ₾" price and a Buy Ticket button
- **Coming Soon** cards with release date and **Notify Me** (asks you to log in first if needed)

### Sessions
- Filters: venue, date (next 7 days), format, language and time of day
- Choosing venues narrows the format list to formats those venues actually have
- Sorting (time, price, title) and pagination
- **Everything lives in the URL**, so refresh, copy-paste and the browser Back button all keep your filters
- Changing a filter or the sort goes back to page 1
- Skeleton loading, an empty state with "Clear filters", sold-out sessions shown but disabled

### Movie details
- Backdrop, poster, synopsis, genres, director, cast, formats and rating note
- 7-day date picker with sessions grouped by venue and hall
- **Age gate:** 16+ / 18+ sessions are disabled for users who are too young, with an explanation

### Search
- Search bar in the navbar with a **debounced** request (one request after you stop typing)
- Prompt, results and "no results" states

### Login & registration
- Validation on blur, with a checkmark for valid fields and red errors for invalid ones
- API errors (for example "email already taken") are shown under the matching field
- Avatar upload with preview and file type/size checks
- If a protected action needs login (like booking or Notify Me), it **continues automatically** after you log in
- An expired session (401) opens the login modal

### Profile
- Edit full name, mobile number, date of birth and preferred venue
- Save is disabled until something changes and the form is valid
- Profile status banner, age information, and a yellow/green dot in the navbar

### Booking (2-step modal)
1. **Seats:** the hall map is drawn from the API (sections → rows → seats, with aisles). Up to 3 seats, a ticket type per seat (Adult / Child / Student), Child is hidden for 16+ titles, and the subtotal updates live
2. **Checkout:** seats are held for 8 minutes with a countdown, the buyer details are prefilled from the profile, and the card details are validated
- If someone takes your seat first (409), you see which seats were lost, the rest of your selection is kept and the map reloads
- When the timer runs out, you go back to step 1 with a message
- Confirmation view with the order reference

### My Tickets
- Upcoming and Past tabs
- Ticket cards with seats, ticket types and total paid
- **Refund** with a confirmation modal; disabled (with the reason) less than 2 hours before the session

---

## Tech stack

- **React** + **Vite**
- **React Router** for pages and URL state
- **Plain CSS** with CSS variables and BEM class names
- The **Fetch API** with a small `request()` helper, so no extra libraries

## Getting started

```bash
git clone https://github.com/elenekartvelishvili/redberry-bootcamp-cinema-task.git
cd redberry-bootcamp-cinema-task
npm install
npm run dev
```

Then open http://localhost:5173

| Script | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the app for production into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with ESLint |

## Project structure

```
src/
├── api/          API calls, one file per area (movies, sessions, booking, tickets, profile)
│   └── client.js     shared request() helper: token, query params, errors, 401 handling
├── components/   reusable UI pieces (cards, seat map, forms, search, timer...)
├── context/      AuthContext (user, login modal, protected actions)
│                 OptionsContext (filter options loaded once at start)
├── modals/       login, register, booking and refund modals
├── pages/        Home, Sessions, MovieDetails, Profile
└── utils/        validators, date formatting, age check, recently viewed
```

## How some things work

### API requests
- Every request goes through one helper: `request()` in `src/api/client.js`.
- It adds the `Authorization: Bearer <token>` header when the user is logged in, and builds the query string. Arrays become `key[]=a&key[]=b`, which is the format the API expects, and empty values are skipped.
- If the response is not OK, it throws an `ApiError` with the `status`, the field `errors` and the full `body`. So every component handles errors the same way:
  - `422` with `errors` → each message is shown under its field
  - `422` with only `message` → a rule was broken (expired hold, age gate…), so the message is shown as it is
  - `409` → seats were taken; `body.contested` says which ones
- The files in `src/api/` (movies, sessions, booking, tickets, profile) are small functions on top of `request()`, so components never build URLs themselves.

### Login and protected actions
- `AuthContext` keeps the logged-in user, the token (in `localStorage`) and which modal is open.
- On page load, if a token is saved, `GET /me` restores the user. If the token is old, it is removed.
- `requireAuth(action)` is used for everything that needs an account (booking, Notify Me…). If you are logged in, the action runs right away. If not, the login modal opens and the action is **saved**. After a successful login, it runs automatically, so you don't have to click twice.
- If any request returns `401` (session expired), the user is logged out on our side and the login modal opens.

### Filter options
- `OptionsContext` loads `GET /filter-options` **once** when the app starts and shares it with every page.
- Venues, formats, languages, time bands, sort options, ticket types, age ratings, the seat limit (3) and the hold time (8 min) all come from there. Nothing is hardcoded, so if the API adds a venue, the app shows it without code changes.

### Sessions page and the URL
- The filters are **not** kept in `useState`. They are read from the URL with `useSearchParams`, e.g. `/sessions?venues=galleria,vake&date=2026-10-12&sort=price_asc&page=2`.
- Changing a filter writes the new value into the URL, and the page loads the sessions again. That's why refresh, copy-paste and the Back button all keep the same view.
- Any filter or sort change **removes the `page` param**, so you're back on page 1 and never land on an empty page 4.
- When venues are selected, the format list only shows formats those venues have (from `venue.formats`). Formats that don't fit anymore are removed.
- Sorting and pagination happen on the server. The page just sends `sort` and `page` and shows what comes back.

### Movie details and the age gate
- The page loads the movie by its `slug` from the URL, and loads the sessions for the selected day separately, so changing the day only reloads the sessions.
- The age check lives in one helper, `isTooYoung(user, minAge)`, used both here and in the booking modal. For 16+ and 18+ movies, if the user's age is below the limit, the session buttons are disabled with an explanation. Logged-out users can still click; the check happens after login.
- Every movie you open is saved to **recently viewed** in `localStorage` (newest first, max 6, no duplicates).

### Booking
**Step 1: seats**
- The hall map is drawn **only from the API**: `sections → rows → seats`. Each section gets its own heading, row labels come from the data, and a gap is added after seats with `aisleAfter: true`. Unavailable spots are empty space, not buttons.
- Seat colors come from `seat.state` (available / sold / held). A legend explains them.
- The selected seats are one array in state: `[{ id, code, ticketType }]`. Clicking adds a seat (default **Adult**) or removes it; a 4th seat shows a message instead.
- The ticket type dropdown only shows types allowed for this movie: Child is hidden when the movie is 16+ (`blockedFromRatingAge` from the API).
- Price per seat = `session price × priceRatio` (Adult 1, Student 0.75, Child 0.6), rounded to 2 decimals, because `12 * 0.6` in JavaScript is `7.199999…`.
- **Next: Checkout** is enabled only with at least one seat and when the user is old enough.

**Holding seats**
- Clicking Next sends `POST /sessions/{id}/holds`. The server keeps the seats for 8 minutes.
- On `409`, the lost seat codes are shown, those seats are removed from the selection, the other seats stay selected, and the map is loaded again so the lost seats show as taken.

**Step 2: checkout**
- The timer counts down from the server's `expiresAt`. Every second it calculates `expiresAt - now` instead of subtracting 1, so it stays correct even if the tab was in the background. The interval is cleared when the timer disappears.
- At 0:00 (or if the server says the hold expired), the modal goes back to step 1, clears the selection, reloads the map and shows "Your hold time expired. Please re-select your seats."
- Name, email and mobile are prefilled from the profile. The card number (16 digits), expiry (MM/YY, in the future) and CVV (3 digits) are validated before sending.
- The Pay button is disabled while the request is running, so a double click can't buy twice.
- The confirmation shows the order **from the server's response** (reference, seats, total, card last 4).

### My Tickets and refunds
- `GET /tickets` returns orders. **Upcoming** = not started and not refunded; **Past** = everything else.
- The Refund button uses the server's `isRefundable` flag. When refunds are closed (less than 2 hours before the session), it's disabled with the reason shown.
- Refund asks for confirmation first, then calls `POST /orders/{reference}/refund`. The card is updated with the **order the server returns**, so a refunded order moves to Past by itself.
- The profile tab is in the URL too (`/profile?tab=tickets`), so "My Tickets" links open the right tab.

### Profile form
- The form starts with the user's saved data. "Changed?" and "valid?" are **calculated on every render**, not stored, so Save is enabled only when something changed **and** all fields are valid.
- After saving, the app reloads the user from `/me`, so the banner, the navbar dot and the age info update right away.

### Search
- The search request is **debounced**: each key press starts a 300ms timer, and pressing another key cancels the old timer. So typing "cars" sends **one** request, not four.
- Clicking outside or pressing Escape closes the panel.

### Loading, empty and error states
- Every data load follows the same pattern: `loading` → request → data **or** error → `loading` off.
- Every error has a **Try again** button (it bumps a `reloadKey`, which makes the effect run again).
- Every list has an empty state (no sessions, no tickets, no search results), with a way out where it makes sense.
- Every effect that loads data uses an `ignore` flag in its cleanup, so an old, slow response can never overwrite newer data (for example when switching days quickly).

---

Made by **Elene Kartvelishvili** for Redberry Bootcamp XII.