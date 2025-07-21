# replit.md

## Overview

This is a modern full-stack web application called "Wavelet" built for influencer monitoring and social media trend analysis. The application provides real-time monitoring of social media influencers, content analysis using AI, and trend reporting capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server components:

- **Frontend**: React-based SPA with TypeScript
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o for content analysis
- **Build System**: Vite for frontend bundling and esbuild for backend
- **UI Framework**: shadcn/ui components with Radix UI primitives and Tailwind CSS

## Key Components

### Database Schema
The application uses four main database tables:
- `influencers`: Stores influencer profiles with platform info and follower counts
- `posts`: Contains social media posts with engagement metrics and AI analysis
- `trendBriefs`: AI-generated trend summaries and insights
- `trendingTopics`: Tracks trending topics with growth metrics

### Frontend Architecture
- **React Router**: Uses wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library with custom theming
- **Styling**: Tailwind CSS with dark theme and custom color palette

### Backend Architecture
- **REST API**: Express.js with TypeScript
- **Data Layer**: Drizzle ORM with PostgreSQL dialect
- **Storage Interface**: Abstracted storage interface with in-memory implementation
- **AI Services**: OpenAI integration for content analysis and trend generation

### Key Features
1. **Dashboard**: Real-time metrics, recent posts, and AI insights
2. **Influencer Management**: Add, track, and manage social media influencers
3. **Content Monitoring**: Real-time post tracking with sentiment analysis
4. **Trend Analysis**: AI-powered trend briefs and topic tracking

## Data Flow

1. **Content Ingestion**: Posts are created and analyzed using OpenAI API
2. **Real-time Updates**: Frontend uses React Query for automatic data refreshing
3. **AI Processing**: Content analysis includes sentiment scoring and topic extraction
4. **Trend Generation**: AI creates comprehensive trend briefs from analyzed content

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connection
- **OpenAI API**: Content analysis and trend generation
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management
- **Drizzle ORM**: Type-safe database operations

## Deployment Strategy

The application is configured for development and production environments:

- **Development**: Vite dev server with HMR and Express API
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles server
- **Production**: Serves static files from Express with API routes
- **Database**: Uses environment variable `DATABASE_URL` for PostgreSQL connection

The application includes mock data initialization for development and uses a flexible storage interface that can be easily swapped between in-memory and database implementations.