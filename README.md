# Intern-Area - Job Portal

## Overview
Intern-Area is a job portal designed for users to apply for jobs and internships. The platform is built using the **MERN stack (MongoDB, Express.js, React, Node.js)** with **Firebase authentication**. The entire website is fully responsive and accessible on **desktops, tablets, and mobile devices**.

## Features

### 1. **Chatbot Integration**
- A chatbot is integrated to answer internship-related questions.
- If a user asks a non-internship-related question, it responds: _“I will not answer any question apart from internship.”_

### 2. **Forgot Password Functionality**
- Users can reset their password using **email or phone number**.
- Password reset request is **limited to once per day**; repeated attempts show a warning message.
- A **password generator** creates a random password consisting of **only uppercase and lowercase letters (no special characters or numbers).**

### 3. **User Login Tracking**
- Tracks login details such as:
  - **Browser type**
  - **Operating System (OS)**
  - **Device Type (Desktop, Mobile, or Tablet)**
  - **IP Address**
- Users can view their **login history**.
- **Special login restrictions:**
  - If a user logs in via **Google Chrome**, they must authenticate via **OTP sent to their email**.
  - If logging in from a **mobile device**, access is restricted to **10 AM – 1 PM**.

## Technologies Used
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- Node.js (v14+)
- MongoDB
- Firebase Account (for authentication & OTP services)

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/intern-area.git
   cd intern-area
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add Firebase and database credentials.

4. **Run the application:**
   ```sh
   npm start
   ```



