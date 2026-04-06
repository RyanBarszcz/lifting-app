# 🏋️ Lifting App

A full-stack workout tracking application inspired by apps like Hevy, built with a strong focus on backend architecture, authentication, and performance tracking.

## 🚀 Overview

This app allows users to create workouts, track sets in real time, and analyze performance over time. It is designed to simulate a production-level system with clean APIs, secure authentication, and structured data modeling.

## 🧠 Features

- 🔐 Secure authentication using Clerk + JWT
- 🏋️ Create and manage workout routines
- ▶️ Start and complete workout sessions
- 📊 Track sets (weight, reps, volume)
- 📈 Automatic performance metrics:
  - Max weight
  - Estimated 1RM
  - Total volume
- 🔁 Fetch previous workouts for comparison
- ⚡ Optimized backend queries for performance

## 🏗️ Tech Stack

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

## 🧩 Architecture Highlights

- Separation of concerns between routes, controllers, and data access
- Stateless authentication using JWT tokens
- Relational schema with normalized tables for:
  - Users
  - Exercises
  - Workout Templates
  - Workout Sessions
  - Sets
- Backend-driven analytics (volume, PR tracking)

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