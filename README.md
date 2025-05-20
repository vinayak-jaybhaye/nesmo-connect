
# Nesmo Connect

**Nesmo Connect** is a web-based community engagement platform developed as part of a college project for the NGO **NESMO**. Inspired by LinkedIn, the application aims to connect NESMO's alumni with current students—enabling meaningful interaction, mentorship, and collaboration within the NESMO community.

> 🎓 Developed under the *Community Engagement Project* subject.

## 🌐 Live Demo

🔗 [https://nesmo-connect.vercel.app](https://nesmo-connect.vercel.app)

---

## 🧠 Project Overview

Nesmo Connect enables members of the NESMO community to:

- Create profiles and view others' profiles
- Share posts (opportunities, Achievements etc) and updates in real-time
- Discover people within the community
- Connect and collaborate on various projects and initiatives

The goal is to foster networking and collaboration within an NGO setting using a modern, interactive web application.

---

## 🏗️ Architecture Diagram
![Architecture Diagram](https://github.com/user-attachments/assets/fbbd97fd-25cd-4abf-a6b1-a742d56568a5)

**Key Highlights:**

- **Frontend:** Built with React and deployed via Vercel.
- **Backend & Database:** Firebase Authentication + Firebase Realtime Database.
- **Hosting:** Static frontend served through Vercel, with Firebase managing all backend and database operations.

---

## 🛠️ Tech Stack

| Layer         | Technology         |
| ------------- | ------------------ |
| Frontend      | React              |
| State & Forms | React Redux        |
| Backend       | Firebase Auth      |
| Database      | Firebase RTDB      |
| Hosting       | Vercel             |
| Deployment    | GitHub + Vercel CI |

---

## 📦 Installation and Setup

Follow the steps below to run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vinayak-jaybhaye/nesmo-connect.git
   cd nesmo-connect
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   A sample environment file is already provided in the repository as `.env.sample`.  
   Copy it and rename it to `.env`:

   ```bash
   cp .env.sample .env
   ```

   Then fill in your Firebase credentials in the `.env` file.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

---

## ✨ Features

- 🔐 User authentication with Firebase
- 🧑‍🤝‍🧑 Profile creation and discovery
- 📢 Post sharing and community updates
- 🔄 Real-time updates using Firebase RTDB
- 🌐 Responsive and user-friendly UI

---

<!--
## 📸 Screenshots

> *(Optional: Add real or placeholder screenshots here)*

```md
![Home Page](screenshots/home.png)
![Profile Page](screenshots/profile.png)
```
---

## 🧪 Testing

Basic tests can be written using React Testing Library or Jest (not included in current version). Add your test scripts in the `/__tests__` folder.

---
-->

## 📌 Roadmap

- [x] User Authentication
- [x] Profile Setup and Edit
- [x] Real-Time Post Feed
- [x] Chat or Messaging
- [x] Admin Dashboard for NGO Heads

---

## 🤝 Contributing

We welcome contributions from the community.

To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/YourFeatureName`
3. Commit your changes: `git commit -m 'Add Your Feature'`
4. Push to the branch: `git push origin feature/YourFeatureName`
5. Open a pull request

---

## 📜 License

This project is developed as part of academic coursework and is not intended for commercial use.

---
<!--
## 👨‍💻 Author

**Vinayak Jaybhaye**  
🔗 [GitHub Profile](https://github.com/vinayak-jaybhaye)

---

-->

## 📬 Contact

For queries or feedback, open an issue on the [GitHub Repository](https://github.com/vinayak-jaybhaye/nesmo-connect).
