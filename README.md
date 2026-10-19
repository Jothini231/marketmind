# MarketMind — Personalized Marketplace Feed

MarketMind is a personalized feed for vehicle and property listings. The app tracks what users do (View, Save, Contact Seller), saves those actions in MongoDB, and suggests items based on what each user likes.

---

## Tech Stack

- **Frontend:** React, Vite, Axios, React Icons
- **Backend:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB & Mongoose
- **Cloud Storage:** Amazon S3 (Private Bucket + Presigned URLs using AWS SDK v3)
- **Testing:** Jest, Supertest

---

## Features

1. **User Switcher & Saved Session:** 
   - Two test users: **Alex** and **Sarah**.
   - The chosen user is saved in `localStorage`, so your login stays even if you refresh or reopen your browser.
2. **Recommendation Engine:** 
   - Scores items using points based on what you do (`VIEW` = 1 point, `SAVE` = 3 points, `CONTACT` = 5 points).
   - Recommends items matching your favorite category, city, and vehicle make or property type.
3. **Separate Details Page:** 
   - Click **View** on any card to open `/listings/:listingId`.
   - Shows the full image, price, city, and all specifications.
   - Saves a `VIEW` action in MongoDB automatically.
   - Has a back button to return to the feed.
4. **Bookmark Save / Unsave Button:** 
   - Click the bookmark icon to save a listing (it changes color).
   - Click it again to unsave (it returns to normal color and removes the save from MongoDB).
   - Your saved bookmarks stay saved across browser restarts.
5. **No Sudden Screen Jumps:** 
   - When you click Save or Contact, the feed does not jump or reorder under your mouse.
   - Updated rankings appear when you log in again or switch users.
6. **Private AWS S3 Images:** 
   - Sample images are stored safely in a private S3 bucket.
   - The backend creates temporary 1-hour links (presigned URLs). No AWS passwords or keys are exposed to the frontend.
7. **Edge Cases Handled:**
   - **New User (Cold Start):** Shows a clean, balanced mix of 30 listings with score 0 in default order.
   - **Click Spam Protection:** Clicking Save 20 times only saves 1 record in MongoDB, so scores cannot be cheated.
   - **No Duplicates in Recommendations:** Items you already interacted with are hidden from recommendations so you see fresh items.
   - **Never Empty:** If you interacted with almost everything, previously viewed items are shown as a backup so the feed is never empty.

---

## Project Structure

```
market-feed/
├── backend/
│   ├── seed/
│   │   ├── data/
│   │   │   ├── listings.js        # 30 listings (mixed vehicles and properties)
│   │   │   └── users.js           # 2 test users (Kasun and Nethmi)
│   │   └── seed.js                # Script to fill database
│   ├── src/
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # 404 and error handlers
│   │   ├── models/                # User, Listing, and Interaction models
│   │   ├── routes/                # API routes
│   │   ├── services/              # Recommendation math and S3 image service
│   │   └── index.js               # Main backend server
│   ├── tests/
│   │   └── recommendations.test.js# Automated tests
│   ├── .env.example               # Example environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # ActionButtons, ListingCard
│   │   ├── pages/                 # UserSelection, Feed, ListingDetail
│   │   ├── services/api.js        # Backend API calls
│   │   ├── utils/storage.js       # Browser storage helper
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Setup & Running the Project

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (MongoDB Atlas cloud or local MongoDB)
- **AWS S3** (Private bucket for images)

---

### Step 1: Backend Setup

1. Open your terminal and go to the backend folder:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend/` folder (use `.env.example` as a guide):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string

   AWS_REGION=eu-north-1
   AWS_S3_BUCKET=your_s3_bucket_name
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

3. Fill the database with the initial 30 listings and 2 users:
   ```bash
   node seed/seed.js
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   *Backend will run on `http://localhost:5000`.*

---

### Step 2: Frontend Setup

1. Open a new terminal window and go to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```
   *Frontend will open on `http://localhost:5173`.*

---

## How to Test the App

1. **Select a User:** Open `http://localhost:5173` and click on **Alex**.
2. **Cold Start Test:** You will see a balanced mix of cars and houses in default order.
3. **Interact:**
   - Click the bookmark icon on a vehicle to **Save** it.
   - Click **View** on a vehicle to open its details page, then click the back arrow.
   - Click **Contact Seller** on a listing.
4. **Switch User Test:** Click **Log Out** in the top right and select **Sarah**.
5. **User Isolation Test:** Sarah has her own separate feed. Save and contact property listings as Sarah.
6. **Session Persistence Test:** Close your browser tab and reopen `http://localhost:5173`. Your user is still logged in, and your feed still remembers your previous actions from MongoDB.

---

## How the Recommendation Engine Works

### 1. Action Weights

Different actions show different levels of interest:

| Action | Points | Why |
|---|:---:|---|
| **VIEW** | **1 pt** | Just browsing / casual look |
| **SAVE** | **3 pts** | Strong interest / saved for later |
| **CONTACT** | **5 pts** | Very strong intent / ready to buy or inquire |

The app calculates your total points for **vehicles** vs **properties** to find your top interest category.

### 2. Scoring Unseen Listings

For every listing you have not interacted with yet, the app calculates points (0 to 12 points):

| Match | Points | Explanation |
|---|:---:|---|
| **Category Match** | **+5 pts** | Matches your top category (vehicle or property) |
| **Make / Type Match** | **+4 pts** | Matches the car brand (e.g. Toyota) or house type (e.g. apartment) you liked |
| **Location Match** | **+3 pts** | Located in a city you previously viewed |

Items are sorted with highest score first. If two items have the same score, they are sorted by ID so the order stays steady.

### 3. Save and Unsave
When you click the bookmark to unsave an item, the app removes that save record from MongoDB. That means its +3 points are no longer counted in your recommendations.

---

## AWS S3 Setup

- **Private Bucket:** Up to 5 sample images are stored in a private S3 bucket (`listings/L001.jpg` to `listings/L005.jpg`).
- **Security:** The frontend never talks to S3 directly. It asks the backend (`GET /api/images/:listingId`), and the backend creates a safe 1-hour presigned link.
- **Fallback:** Any listing without an S3 image shows a clean fallback photo without crashing.

---

## Automated Tests

The backend includes 3 automated tests using **Jest** and **Supertest**:

1. **Cold-start test:** A brand new user gets 30 listings with score 0 in default order.
2. **User isolation test:** Alex (likes vehicles) and Sarah (likes properties) receive completely different recommendations.
3. **Repeated interaction test:** Clicking Save 5 times on the same item stores only 1 record in the database.

To run the tests:

```bash
cd backend
npm test
```

