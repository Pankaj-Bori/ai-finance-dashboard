# 💰 AI-Powered Personal Finance Assistant

A modern, full-stack personal finance dashboard designed to help users (especially students) manage their daily expenses, track transactions, and gain smart financial insights.

---

## 🚀 Overview

This project is a **real-time finance management system** that allows users to:

* Track income and expenses 📊
* Manage wallet balance 💰
* Record transactions 🧾
* Generate invoices 📄
* Store card details 💳
* Get basic AI-driven financial insights 🤖

Unlike generic finance apps, this system is tailored with **student-focused use cases** like hostel expenses, recharge tracking, and daily spending limits.

---

## 🎯 Features

### 🏠 Dashboard

* Displays total balance, income, and expenses
* Visual charts (bar + pie)
* Smart insights (e.g., spending patterns)

### 💰 My Wallet

* View and update wallet balance
* Track available funds

### 📊 Transactions

* Add new transactions (income/expense)
* View transaction history
* Category-based tracking

### 🧾 Invoice

* Create and manage invoices
* Mark invoices as paid/unpaid

### 💳 Cards

* Save and view card details
* Masked card numbers for security

### ⚙️ Settings

* Update user profile
* Manage account details

### 🤖 Smart Insights (AI Feature)

* Analyze spending behavior
* Provide simple suggestions like:

  * “You spent ₹1200 on food this week”
  * “Try reducing unnecessary expenses”

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Recharts / Chart.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB

---

## 📂 Project Structure

```
finance-app/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Pankaj-Bori/finance-app.git
cd finance-app
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Setup Environment Variables

Create a `.env` file in backend:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

---

## 📊 How It Works

1. User interacts with frontend dashboard
2. Requests are sent to backend APIs
3. Backend processes data and stores it in MongoDB
4. Data is returned and displayed in real-time

---

## 🔥 Unique Highlights

* Student-focused financial tracking
* Real-time interactive dashboard
* Fully functional sidebar navigation
* Simple AI-based financial insights
* Clean and modern fintech UI

---

## ⚠️ Limitations

* Basic AI logic (can be improved with ML models)
* No bank API integration yet
* Requires internet connection

---

## 🚀 Future Enhancements

* Advanced AI predictions (budget forecasting)
* Mobile application (React Native)
* Bank API integration
* Secure authentication (JWT, OAuth)
* Expense reminders & notifications

---

## 📌 Author

**Pankaj Bori**
B.Tech CSE Student

---

## ⭐ Contribution

Feel free to fork this repository and contribute to improve the project.

---

## 📜 License

This project is for educational purposes.

