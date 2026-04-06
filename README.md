# CareQueue - AI-Assisted Hospital Queue Optimization

CareQueue is an intelligent hospital queue management system that leverages AI to predict and reduce patient waiting times. The platform provides real-time queue tracking, wait time predictions, and a comprehensive dashboard for healthcare administrators.

## Features

- **AI Wait Time Prediction** - Machine learning models predict patient wait times based on historical data, current queue status, and various factors
- **Real-time Dashboard** - Live monitoring of queue status, patient counts, and department-wise analytics
- **Patient Input System** - Easy patient registration and queue ticket generation
- **Analytics & Visualization** - Comprehensive charts and graphs for hospital management
- **Admin Panel** - Full administrative controls for queue management

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **Database:** PostgreSQL (Supabase) with Prisma ORM
- **State Management:** Zustand
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Deployment:** Next.js standalone build

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase)
- Bun or npm

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CareQueue.git
cd CareQueue
```

### 2. Install dependencies

```bash
# Using npm
npm install

# Or using bun
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database (Supabase)
DATABASE_URL="postgresql://username:password@host:port/database"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
```

### 4. Set up the database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 5. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | NextAuth.js URL | Yes |

## Usage

1. **For Patients:** Visit the homepage to view current wait times and register for a queue ticket
2. **For Administrators:** Access the admin panel to manage queues, view analytics, and configure system settings
3. **For Display:** Use the dashboard view on hospital displays for real-time queue information

## Project Structure

```
CareQueue/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── landing/     # Landing page components
│   │   ├── dashboard/   # Dashboard components
│   │   └── admin/       # Admin panel components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── .env                 # Environment variables (DO NOT COMMIT)
└── package.json         # Dependencies
```

## Demo

Demo link coming soon.

## Future Improvements

- Mobile application for patients
- SMS/Email notifications for queue updates
- Integration with hospital appointment systems
- Advanced ML models for better prediction accuracy
- Multi-hospital support
- Patient feedback system

## Author

**SHAIK MOHAMMED YASIN**

Team **BALLERINA**

---

Made with care for healthcare optimization
