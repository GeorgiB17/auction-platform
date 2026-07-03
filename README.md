#  HdM Auction Platform

A modern full-stack auction platform developed for the auctioning of old devices and equipment from Hochschule der Medien (HdM).

The platform allows authenticated users to browse available items, place bids in real time, and track auction activity through a responsive and user-friendly interface.

##  Features

###  Authentication & Security
- LDAP login using HdM credentials
- Secure user authentication
- Session management with HTTP-only cookies
- Protected API routes
- User-specific bidding functionality

###  Auction System
- Browse active auctions
- View detailed item information
- Place bids on available items
- Automatic validation of bid amounts
- Track current highest bids
- Real-time auction updates

###  Real-Time Bidding
- WebSocket-based communication
- Instant bid updates without page refresh
- Live synchronization between connected users
- Immediate feedback on auction activity

###  Modern User Experience
- Responsive design for desktop, tablet, and mobile devices
- Clean and modern interface
- Fast and intuitive navigation
- Optimized user flow for browsing and bidding

##  Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Modern CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- LDAP Authentication
- Cookie-based sessions

### Real-Time Communication
- WebSockets


### Prerequisites

Make sure you have installed:

- Node.js (v18 or newer)
- PostgreSQL
- npm
- Access to the LDAP server (if running in production)

---

### Clone the Repository

```bash
git clone https://github.com/GeorgiB17/auction-platform.git
cd auction-platform
```

## ⚙️ Backend Setup

Install dependencies:

```bash
npm install
```

Configure environment variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/auction_platform

LDAP_URL=
LDAP_BASE_DN=
LDAP_BIND_DN=
LDAP_BIND_PASSWORD=

SESSION_SECRET=

FRONTEND_URL=http://localhost:5173
```

Run database migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

## 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The application will be available at:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

## Use Case

The HdM Auction Platform was created to simplify the sale and redistribution of older devices and equipment no longer needed by Hochschule der Medien. Instead of manually managing offers, users can participate in transparent and competitive auctions through a centralized web platform.

##  Future Improvements

- Auction categories
- Search and filtering
- Email notifications
- User watchlists
- Auction end reminders
- Image galleries
- Administrative dashboard
- Auction analytics
- Automatic auction closing

##  Screenshots

--
##  Authors

Developed as a university project at Hochschule der Medien (HdM).

- Georgi Bozhilski
- Asim Jugo



This project is intended for educational purposes and university-related use.
