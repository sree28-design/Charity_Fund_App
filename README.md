# Charity Fundraising Platform

A simple and clean MERN stack application for charity fundraising with donation functionality and bank balance management.

## Features

- User authentication (register/login)
- Create and browse fundraising campaigns
- Donate to campaigns
- Track bank balance
- User dashboard with statistics
- Campaign management
- Donation history

## Tech Stack

**Frontend:**

- React 18
- Material-UI
- React Router
- Axios
- Recharts

**Backend:**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:

```bash
cd server
npm install
```

2. Create `.env` file with:

```
MONGO_URI=mongodb://localhost:27017/charity-db
JWT_SECRET=your_secret_key
PORT=5000
```

3. Start server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
npm install
```

2. Start client:

```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Campaigns

- GET `/api/campaigns` - Get all campaigns
- GET `/api/campaigns/:id` - Get single campaign
- POST `/api/campaigns` - Create campaign (auth required)
- PUT `/api/campaigns/:id` - Update campaign (auth required)
- DELETE `/api/campaigns/:id` - Delete campaign (auth required)

### Donations

- POST `/api/donations` - Create donation (auth required)
- GET `/api/donations/my-donations` - Get user donations (auth required)
- GET `/api/donations/campaign/:id` - Get campaign donations

### User

- GET `/api/users/balance` - Get user balance (auth required)
- PUT `/api/users/balance` - Update balance (auth required)

## Usage

1. **Register/Login**: Create an account or login
2. **Browse Campaigns**: View all active fundraising campaigns
3. **Create Campaign**: Start your own fundraising campaign
4. **Donate**: Contribute to campaigns you support
5. **Dashboard**: Track your donations and manage campaigns
6. **Balance**: Monitor your account balance

## License

MIT
