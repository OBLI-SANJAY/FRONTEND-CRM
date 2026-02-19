# ClientConnect CRM

## Overview

ClientConnect CRM is a customer relationship management application built with React and Vite. The application provides functionality for managing leads, customers, and tasks with role-based access control (Admin, Manager, Employee). It features a modern dark-themed UI built with Bootstrap 5 and custom CSS styling.

### Core Modules
- **Authentication** - Login system with role detection based on email
- **Dashboard** - Main overview and navigation hub
- **Leads Management** - Add, view details, and track leads
- **Customer Management** - Customer list, details, and edit functionality
- **Tasks** - Task creation, editing, and management with filtering
- **Settings** - User profile and application settings (Manager/Employee only)
- **Role-Based Access** - Three-tier permission system (Admin, Manager, Employee)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool
- **Routing**: react-router-dom v6 for client-side navigation
- **Styling**: Bootstrap 5 combined with custom CSS files per component
- **State Management**: Local component state with localStorage for auth persistence

### Project Structure (Industry Standard)
```
src/
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── auth.css
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── leads/
│   │   ├── LeadList.jsx
│   │   ├── AddLead.jsx
│   │   ├── LeadDetails.jsx
│   │   └── Lead.css
│   ├── customers/
│   │   ├── CustomerList.jsx
│   │   ├── CustomerDetails.jsx
│   │   ├── EditCustomer.jsx
│   │   └── Customer.css
│   ├── tasks/
│   │   ├── TaskList.jsx
│   │   ├── AddTask.jsx
│   │   ├── EditTask.jsx
│   │   └── Task.css
│   ├── settings/
│   │   ├── Settings.jsx
│   │   └── Settings.css
│   └── kanban/
│       ├── KanbanBoard.jsx
│       ├── KanbanColumn.jsx
│       ├── KanbanCard.jsx
│       └── Kanban.css
├── context/
│   └── RoleContext.jsx
├── pages/
│   ├── Home.jsx
│   └── NotFound.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── services/
│   └── api.js
├── utils/
│   └── auth.js
├── App.jsx
├── main.jsx
└── index.css
```

### Component Organization
The project follows a modular component structure organized by feature:
- `src/components/common/` - Reusable UI components (Sidebar, Navbar, Footer)
- `src/components/auth/` - Authentication-related components
- `src/components/dashboard/` - Dashboard layout and widgets
- `src/components/leads/` - Lead management components
- `src/components/customers/` - Customer management components
- `src/components/tasks/` - Task management components
- `src/components/settings/` - Settings and profile components
- `src/components/kanban/` - Reusable Kanban board components (KanbanBoard, KanbanColumn, KanbanCard)

Each feature folder contains its own CSS file for styling encapsulation.

### Routing Architecture
- All routes defined centrally in `src/routes/AppRoutes.jsx`
- `ProtectedRoute.jsx` component handles authentication and role-based access
- Public routes: `/`, `/login`, `/signup`, `/forgot-password`
- Protected routes require authentication via localStorage role check

### Authentication Pattern
- Role-based access control with three roles: Admin, Manager, Employee
- Authentication state stored in localStorage (role and email)
- Role determination derived from email pattern (admin/manager keywords)
- Utility functions in `src/utils/auth.js` handle all auth operations:
  - `isAuthenticated()` - Check if user is logged in
  - `getRole()` - Get current user role
  - `getEmail()` - Get current user email
  - `setAuthData()` - Store auth data
  - `clearAuthData()` - Logout user
  - `getRoleFromEmail()` - Determine role from email

### Role-Based Access Rules
- **Admin**: Full access to all features, no settings page
- **Manager**: Cannot access admin-only data, has settings access
- **Employee**: Can only see own leads/tasks, has settings access

### API Layer
- Centralized API service in `src/services/api.js`
- RESTful pattern with GET, POST, PUT, DELETE methods
- Base URL configured as empty string (expects backend to be added)
- All methods return parsed JSON responses

### Design System
- Dark theme with green accent color (#3ef08c)
- Consistent border-radius patterns (rounded buttons, cards)
- Custom scrollbar styling
- Responsive layout structure with sidebar navigation

## External Dependencies

### NPM Packages
| Package | Purpose |
|---------|---------|
| react | Core UI library |
| react-dom | React DOM rendering |
| react-router-dom | Client-side routing |
| bootstrap | CSS framework for styling |

### Development Tools
| Package | Purpose |
|---------|---------|
| vite | Build tool and dev server |
| @vitejs/plugin-react | React support for Vite |

### Backend Requirements
- The API service expects a backend server to be configured
- API base URL is currently empty and needs to be set when backend is added
- Expected endpoints follow RESTful conventions for leads, customers, and tasks

### Browser APIs
- localStorage for authentication persistence
- Fetch API for HTTP requests

## Recent Changes

### January 30, 2026
- Added Kanban board view for Leads and Tasks with toggle between Table and Kanban views
- Created reusable Kanban components (KanbanBoard, KanbanColumn, KanbanCard) in `src/components/kanban/`
- Implemented localStorage persistence for leads and tasks data
- Status changes via dropdown in Kanban cards automatically persist
- Kanban columns: Leads (New, Contacted, Follow Up, Converted, Lost), Tasks (To Do, In Progress, Completed)
- Restructured project from flat CRA structure to industry-standard Vite architecture
- Created modular component organization with feature-based folders
- Implemented centralized routing with AppRoutes.jsx and ProtectedRoute.jsx
- Added common components (Sidebar, Navbar, Footer) for reusability
- Separated authentication utilities into dedicated auth.js file
- Added RoleContext for potential future state management
- Created Home and NotFound pages
- All existing business logic and role-based conditions preserved
