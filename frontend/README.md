# CapaCity - Airport Capacity Planning Tool

CapaCity is a web application that enables airport planners to forecast airport capacity based on facility capabilities and maintenance works. The tool supports analysis of facility utilization and provides insights for optimization.

## Features (MVP)

- User authentication
- Airport configuration
- Stand management
- Maintenance planning
- Airport capacity visualization (future releases)

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Backend/API**: Supabase
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials.

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app` - Next.js pages and layouts
- `src/components` - Reusable UI components
- `src/lib` - Utility libraries (Supabase client)
- `src/utils` - Helper functions

## Airport Themed Design

The UI follows airport signage conventions with:
- Black backgrounds
- Yellow accents for highlighting
- White text for readability
- Modern, clean interfaces modeled after airport information displays

## Future Development

Refer to the main project documentation for information on planned releases.
