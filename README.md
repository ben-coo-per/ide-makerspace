# IDE MakerSpace

A web app for IDE to vote on what we want in the makerspace and browse list of what the makerspace needs.

## Contributing

Contributions are welcome! Please fork the repo and submit a PR.

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```sh
# Clone the repo
git clone https://github.com/ben-coo-per/ide-makerspace.git
cd ide-makerspace/web-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Project Structure

```
src/
├── routes/
│   ├── /              # Landing page
│   ├── /wants/        # Community wants (voting & submissions)
│   ├── /needs/        # Curated needs list
│   └── /api/
│       ├── /wants/    # Wants API (Google Sheets: WANTS)
│       └── /needs/    # Needs API (Google Sheets: NEEDS)
├── lib/
│   ├── components/    # shadcn-svelte UI components
│   └── api/           # Client API utilities
static/                # Static assets (favicon, og-image)
```

### Environment Variables

Create a `.env` file:

```sh
PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account",...}
```

### Tech Stack

- **Framework:** SvelteKit
- **UI:** shadcn-svelte + Tailwind CSS
- **Backend:** Google Sheets API
- **Deployment:** Vercel (recommended)

### Key Features

- **Wants:** Community-driven voting and submissions
- **Needs:** Curated list for project budget spending
- **Vote tracking:** localStorage prevents duplicate votes
- **Real-time updates:** Optimistic UI with API sync

### Building

```sh
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Deployment

The app uses SvelteKit's auto-adapter. Deploy to Vercel, Netlify, or any Node.js host.

### Questions?

Open an issue or reach out to the IDE MakerSpace volunteers.
