# ✂️ SalonBook – Salon Appointment Booking Platform

**SalonBook** is a modern salon appointment booking platform designed to make salon service management and appointment scheduling easier. Customers can explore salon services, book appointments, manage their bookings, and make secure online payments. Administrators can manage services, customers, appointments, and transactions through a dedicated dashboard.

🌐 **Live Website:** https://salonbook-frontend.vercel.app

---

## 🖥️ Homepage Preview

<!-- Add your website homepage screenshot to public/images/salonbook-homepage.png -->

![SalonBook Homepage](./public/salonbook.png)

---

## ✨ Key Features

### 👤 Customer Features
- User registration and secure login.
- Browse available salon services.
- View service details and pricing.
- Book salon appointments.
- Manage and view appointment history.
- Cancel appointments.
- Secure online payments using Stripe.
- View payment and transaction information.
- Personalized customer dashboard.

### 🛠️ Admin Features
- Dedicated admin dashboard.
- Manage salon services (Create, Read, Update, Delete).
- Add new services and update existing services.
- Manage customer appointments.
- Manage registered users.
- Monitor payment transactions.
- Manage customer and admin profiles.
- Role-based dashboard access.

### 🔒 Security & Payment
- Authentication using Better Auth.
- Role-based access control.
- Protected dashboard routes.
- Stripe payment integration.
- Server-side payment verification.
- Secure communication between frontend and backend.

---

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Authentication | Better Auth |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Payment | Stripe |
| Image Upload | ImgBB, Multer |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📂 Project Repositories

| Repository | Link |
|---|---|
| Frontend | [SalonBook Frontend](https://github.com/sagorhowlader1/salonbook-frontend) |
| Backend | [SalonBook Backend](https://github.com/sagorhowlader1/salonbook-backend) |
| Live Website | [Visit SalonBook](https://salonbook-frontend.vercel.app) |

---

## ⚙️ Installation Instructions

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm or yarn
- MongoDB database
- Git

### 1. Clone the Frontend Repository

```bash
git clone https://github.com/sagorhowlader1/salonbook-frontend.git
```

Navigate to the project directory:

```bash
cd salonbook-frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Clone the Backend Repository

Open another terminal:

```bash
git clone https://github.com/sagorhowlader1/salonbook-backend.git
```

Navigate to the backend directory:

```bash
cd salonbook-backend
```

### 4. Install Backend Dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create `.env` files in the frontend and backend project roots.

**Frontend `.env`:**

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
BETTER_AUTH_DB_URI=
BACKEND_API_URL=
INTERNAL_API_SECRET=
STRIPE_SECRET_KEY=
```

**Backend `.env`:**

```env
MONGODB_URI=
STRIPE_SECRET_KEY=
INTERNAL_API_SECRET=
IMGBB_API_KEY=
```

**Important:** Add your own environment variable values. Never commit `.env` files, API keys, database credentials, or other sensitive information to GitHub.

---

## 🚀 How to Run the Project Locally

### Start the Backend Server

Navigate to the backend directory and run:

```bash
npm start
```

The backend server runs on:

```text
http://localhost:5000
```

### Start the Frontend Development Server

Open another terminal and navigate to the frontend directory:

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

The application will be available locally.

---

## 💳 Payment Integration

SalonBook integrates **Stripe Checkout** to process online appointment payments.

The payment workflow includes:

- Creating a Stripe Checkout session.
- Redirecting customers to Stripe Checkout.
- Verifying payment status on the server.
- Updating appointment and transaction information after successful payment.

---

## 🌍 Live Deployment

The frontend is deployed on Vercel.

**Live Website:** https://salonbook-frontend.vercel.app

---

## 👨‍💻 Author

**Sagor Howlader**

Full-Stack Web Developer

- GitHub: [@sagorhowlader1](https://github.com/sagorhowlader1)

---

⭐ If you find this project interesting, consider giving it a star on GitHub!

**Built with ❤️ by Sagor Howlader**








<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->
