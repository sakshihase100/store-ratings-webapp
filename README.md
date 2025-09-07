# Store Rating App
 Output: https://github.com/sakshihase100/store-ratings-webapp/commit/459f0129651df2a5da43e0be7a4ecca9b789e821
A full-stack web application that allows users to rate and review stores. Admins can manage stores, owners can view and manage their stores, 
and users can rate or edit ratings. The app supports role-based dashboards and interactive rating functionality.


## Features

- **Role-based access**:
  - **Admin**: Manage all stores and view all ratings.
  - **Owner**: View and manage their store ratings.
  - **User**: Rate stores and edit their ratings.
- Add a new rating if not already rated.
- Edit rating functionality for users.
- View average rating for each store.
- Responsive UI with **Bootstrap** and **Bootstrap Icons**.
- Real-time user interactions with immediate rating updates.

---

## Tech Stack

- **Frontend**: React, React Router, Bootstrap, Bootstrap Icons
- **Backend**: Node.js, Express.js
- **Database**: MySQL / PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **API Testing**: Postman

---

## Installation

### Backend
1. Clone the repository:


2.Navigate to backend folder:
cd backend

3.Install dependencies:
npm install

4.Setup environment variables (.env):

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=store_rating_db
JWT_SECRET=your_secret_key
PORT=4000

5. Start the server:
npm start
Server runs at (http://localhost:5173/stores).

### Frontend

1.Navigate to frontend folder:
cd frontend

2.Install dependencies:
npm install

3.Start the frontend:
npm start
Frontend runs at http://localhost:3000.
  
Usage

1.Sign Up / Login as Admin, Owner, or User.
2.Dashboard:
  -Admins can manage all stores.
  -Owners can manage their stores.
  -Users can submit or edit ratings.
3.Rating:
  -Click on a store to view and submit/edit ratings.
  -Average ratings and your rating are displayed.
4.Edit Ratings:
  -Users can edit their rating if already submitted.
  -Owners/Admins can update store ratings as needed.


Folder Structure

Store-Rating-App/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
│
├── README.md
└── package.json


API Endpoints
Authentication
   -POST /api/auth/register – Register new user
   -POST /api/auth/login – Login existing user
Stores
   -GET /api/stores – Get all stores with ratings
   -POST /api/stores – Add a new store (Admin only)
Ratings
   -POST /api/ratings – Submit a rating
   =PUT /api/ratings/:id – Edit your rating
   -GET /api/ratings/:storeId – Get ratings for a specific store



 Contributing
1.Fork the repository.
2.Create a new branch (git checkout -b feature-name).
3.Commit your changes (git commit -m 'Add some feature').
4.Push to the branch (git push origin feature-name).
5.Open a Pull Request.





