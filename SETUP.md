# Environment Variables Configuration

## Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travel_booking

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## Frontend Environment Variables

Create a `.env` file in the frontend directory:

# Environment Variables Configuration

## Backend (.env)

Create a `.env` in `backend/` (or copy from `.env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travel_booking

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production, create `.env.production`:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Run locally (development)

1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env if needed, then:
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` for the frontend and `http://localhost:5000/api/health` for backend health.

## Run in production (serve built frontend from backend)

1. Build frontend

```bash
cd frontend
npm run build
```

2. Start backend (it will serve the `frontend/build` folder)

```bash
cd ../backend
cp .env.example .env
npm install --production
NODE_ENV=production npm start
```

Now the app will be served from the backend host (e.g., `http://localhost:5000`).
