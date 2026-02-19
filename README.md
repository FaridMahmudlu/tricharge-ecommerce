# TriCharge — E-Commerce Platform

A full-stack e-commerce web application for wireless charging products, built with React (TypeScript) on the frontend and Node.js/Express (TypeScript) on the backend, using Supabase as the database.

---

## 🗂️ Project Structure

```
Website/
├── backend/          # Node.js + Express REST API (TypeScript)
│   ├── src/
│   │   ├── routes/       # API route definitions
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Data models
│   │   ├── middleware/   # Auth, rate-limiting, etc.
│   │   ├── db/           # Database connection
│   │   └── index.ts      # Server entry point
│   └── .env.example      # Environment variable template
│
└── temp-frontend/    # React (CRA + TypeScript) frontend
    ├── src/
    │   ├── pages/        # Page components
    │   ├── components/   # Reusable UI components
    │   ├── context/      # React context (Auth, Cart)
    │   ├── services/     # API client
    │   ├── data/         # Local product data (fallback)
    │   └── types/        # TypeScript types
    └── .env              # Frontend environment variables
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Styled Components, React Router v6 |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (JSON Web Tokens) |
| Payments | Stripe |
| Uploads | Multer |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy the example environment file and fill in your credentials:
```bash
copy .env.example .env
```

Required environment variables (see `.env.example`):
- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key
- `SUPABASE_DB_URL` — Your Supabase PostgreSQL connection string
- `JWT_SECRET` — A random secret string for JWT signing
- `STRIPE_SECRET_KEY` — Your Stripe secret key

Start the backend in development mode:
```bash
npm run dev
```
> Server runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd temp-frontend
npm install
```

Create a `.env` file:
```bash
copy .env.example .env
```
Add your Stripe publishable key:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Start the frontend:
```bash
npm start
```
> App opens at **http://localhost:3000**

---

## 📜 Available Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start in development mode (hot-reload) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled production build |
| `npm run seed` | Seed the database with initial data |

### Frontend
| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a single product |
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| POST | `/api/orders` | Create an order |
| POST | `/api/payment/create-payment-intent` | Create Stripe payment intent |

---

## 🔒 Environment Variables

> ⚠️ **Never commit your `.env` files to version control.** They contain secrets.

Use the provided `.env.example` files as templates.

---

## 📄 License

MIT
