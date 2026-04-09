# 🏋️ Lifting App

A full-stack workout tracking application inspired by apps like Hevy, designed with a strong focus on **scalable architecture, data integrity, and performance tracking**.

---

## 🚀 Overview

Lifting App allows users to create workout routines, track sets in real time, and analyze performance over time. The project emphasizes **clean system design**, **secure authentication**, and **structured data flow** across the frontend and backend.

---

## 🧠 Features

- 🔐 Secure authentication using Clerk + JWT
- 🏋️ Create, edit, and manage workout routines
- ▶️ Start and complete workout sessions
- 📊 Track sets (weight, reps, volume) in real time
- 🔁 View previous performance per exercise
- 📈 Automatic performance metrics:
  - Max weight
  - Estimated 1RM
  - Total volume
- 🧩 Drag-and-drop exercise reordering
- ⚡ Client-side caching to reduce redundant API calls

---

## 🖥️ Frontend Architecture

The frontend is structured using a layered approach for scalability and maintainability:

UI Components → Service Layer → API Layer → Backend

### Key Concepts

- **API Layer**: Handles all HTTP requests and authentication
- **Service Layer**: Manages business logic and data transformation
- **Caching Layer**: Custom localStorage cache with TTL and invalidation
- **State Management**: React Context for active workouts and routines

### Highlights

- Modular API and service abstraction
- Optimistic UI updates for better UX
- Clean separation of concerns across components

---

## 🏗️ Backend Architecture

- RESTful API built with Express
- PostgreSQL database with Prisma ORM
- Relational schema with normalized tables:
  - Users
  - Exercises
  - Workout Templates
  - Workout Sessions
  - Sets
- Backend-driven analytics for performance tracking

---

## ⚙️ Key Engineering Decisions

- Implemented a **service layer** to separate business logic from UI
- Built a **custom caching system** with TTL and prefix invalidation
- Used **Zod validation** to ensure data integrity before API submission
- Designed **mutation pipelines** (e.g., finishing a workout) to clean and validate data
- Centralized API interactions for consistency and reuse

---

## 💡 Highlight Feature: Workout Completion Pipeline

The workout completion flow is designed to mimic production-level systems:

- Filters out incomplete or invalid sets
- Transforms workout data into backend-ready format
- Validates data using Zod schemas
- Submits through a service layer
- Automatically invalidates cached data to keep UI consistent

This ensures **accurate analytics and reliable backend data**.

---

## 🧩 Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM

### Auth & Infrastructure
- Clerk (JWT-based authentication)
- REST API design
- Environment-based configuration

---

## 🧪 Testing

Basic unit tests are included to validate core data transformation logic.

### Example:
- `cleanExercises` ensures only valid sets are sent to the backend

Run tests with:

```bash
npm test
```

---

## 📡 API Example

```http
POST /sessions/:id/complete
Authorization: Bearer <token>

{
  "exercises": [
    {
      "exerciseId": "uuid",
      "sets": [
        { "setNumber": 1, "weight": 135, "reps": 8 }
      ]
    }
  ]
}
```

---

## 🔮 Future Improvements

- Add integration tests for API routes
- Expand analytics dashboard (weekly trends, muscle focus)
- Add offline support for active workouts
- Implement retry logic for failed requests

---

## 📌 Summary

This project demonstrates:

- Clean frontend and backend architecture
- Secure authentication and API design
- Real-time state management
- Data validation and transformation pipelines
- Performance optimization through caching
