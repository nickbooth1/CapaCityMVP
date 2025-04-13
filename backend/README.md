# CapaCity Backend

This is the backend service for the CapaCity application, which helps airport planners forecast capacity and manage airport facilities and maintenance.

## Features

- RESTful API for airports, stands, and maintenance requests
- Authentication via Supabase
- PostgreSQL database integration
- Error handling and logging

## Tech Stack

- Node.js with Express
- Supabase for authentication and database
- PostgreSQL for data storage

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Supabase account with a project set up

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory based on `.env.example`
5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Airports

- `GET /api/airports` - Get all airports
- `GET /api/airports/:id` - Get airport by ID
- `POST /api/airports` - Create new airport
- `PUT /api/airports/:id` - Update airport
- `DELETE /api/airports/:id` - Delete airport

### Stands

- `GET /api/stands` - Get all stands
- `GET /api/stands/:id` - Get stand by ID
- `POST /api/stands` - Create new stand
- `PUT /api/stands/:id` - Update stand
- `DELETE /api/stands/:id` - Delete stand

### Maintenance

- `GET /api/maintenance` - Get all maintenance requests
- `GET /api/maintenance/:id` - Get maintenance request by ID
- `POST /api/maintenance` - Create new maintenance request
- `PUT /api/maintenance/:id` - Update maintenance request
- `PATCH /api/maintenance/:id/status` - Change maintenance request status
- `DELETE /api/maintenance/:id` - Delete maintenance request

## Database Schema

The application uses the following main tables:

- `airports` - Stores airport information
- `stands` - Stores stand information (linked to airports)
- `maintenance_requests` - Stores maintenance requests (linked to stands and users)
- `users` - Managed by Supabase Auth

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request 