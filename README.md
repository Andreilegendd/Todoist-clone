# Todoist Clone

A modern task management web application inspired by Todoist. Built with a modern technology stack to ensure fast performance, scalability, and user-friendly experience.

## 🚀 Key Features

### Task Management
- **Create and edit tasks** - Add tasks with descriptions, due dates, and priorities
- **Task priorities** - 4 priority levels (P1-P4) with color indication
- **Task completion** - Mark completed tasks with ability to undo
- **Task filtering** - By projects, labels, priority, and completion status
- **Date sorting** - View tasks for today, upcoming, or overdue

### Organization
- **Projects** - Group tasks by projects with customizable colors
- **Labels** - Add labels for better task categorization
- **Inbox folder** - Centralized place for new tasks

### User Interface
- **Modern design** - Clean and intuitive interface
- **Dark/Light theme** - Switch between appearance modes
- **Responsive design** - Works on all devices
- **Sidebar** - Quick access to projects and filters
- **Modal windows** - Convenient creation of tasks, projects, and labels

### Authentication System
- **Registration and login** - Secure authentication system
- **JWT tokens** - Protected authentication
- **Session management** - Automatic logout on token expiration
- **Protected routes** - Access only for authenticated users

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework for production
- **TypeScript** - Typed JavaScript for reliability
- **Tailwind CSS** - Utility-first CSS framework
- **React Query (TanStack Query)** - Server state management and caching
- **Zustand** - Lightweight client state management
- **Radix UI** - Accessible UI components
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Zod** - Schema validation
- **Lucide React** - Icons

### Backend
- **Node.js** - JavaScript server platform
- **Express.js** - Web framework
- **Sequelize** - Database ORM
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables
- **UUID** - Unique identifiers

### DevOps and Infrastructure
- **Docker** - Application containerization
- **Docker Compose** - Container orchestration
- **PostgreSQL 17** - Database Docker image
- **Nodemon** - Auto-restart in development mode

### Development Tools
- **ESLint** - Code linter
- **TypeScript** - Static typing
- **Sequelize CLI** - Database migration management

## 📦 Project Structure

```
todoist-clone/
├── backend/                    # Server-side application
│   ├── controllers/           # API controllers
│   ├── models/               # Sequelize models
│   ├── routes/              # API routes
│   ├── middleware/          # Middleware
│   ├── migrations/          # Database migrations
│   ├── config/             # Configuration
│   └── services/           # Business logic
├── frontend/               # Client-side application
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/          # API clients
│   │   ├── types/        # TypeScript types
│   │   ├── zustand/      # Zustand state
│   │   └── providers/    # React providers
└── docker-compose.yml    # Docker configuration
```

## 🗄️ Database

The application uses PostgreSQL with the following main tables:

- **Users** - System users
- **UserSessions** - User sessions
- **Projects** - User projects
- **Tasks** - Tasks linked to projects
- **Labels** - Labels for categorization
- **TaskLabels** - Many-to-many relationship between tasks and labels

## 🔒 Security

- JWT tokens for authentication
- Password hashing with bcrypt
- CORS settings for cross-origin requests
- Data validation on client and server
- Protected routes with middleware

## 🎨 UI/UX Features

- Modern Material Design
- Loading indicators
- Responsive layout

## 🔄 State Management

- **React Query** - Server state, caching, synchronization
- **Zustand** - Global application state (auth, UI)
- Automatic cache invalidation on changes
- Optimistic updates for better UX

## 📱 Responsiveness

The application is fully adapted for all devices:
- Desktop (1200px+)
- Tablet (768px - 1199px) 
- Mobile (up to 767px)
