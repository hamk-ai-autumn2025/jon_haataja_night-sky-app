# Skai - Night Sky App

A React + TypeScript + Vite application that helps you discover astronomy events in your country using AI-powered search.

## 🌟 Features

### Core Functionality

- **AI-Powered Event Search**: Get comprehensive astronomy events for any country and month using OpenAI
- **Smart Country Selection**: Searchable dropdown with all world countries
- **Month & Year Selection**: Easy navigation through astronomy events by time period
- **Event Sorting**: Multiple sorting options (date, title, visibility requirements)
- **Responsive Design**: Beautiful glassmorphic UI that works on all devices

### Event Management

- **Detailed Event Cards**: Rich event information with visibility indicators (naked eye 👁️ or telescope 🔭)
- **Event Modal**: Click any event to view detailed information in an elegant modal
- **Event Images**: Beautiful astronomy-themed images for different event types
- **Add to Calendar**: Export events to Google Calendar, Outlook, Yahoo Mail, or iCloud (iCal)
- **Share Events**: Share astronomy events via:
  - Native share (mobile devices)
  - Email
  - Twitter/X
  - WhatsApp
  - Copy to clipboard

### Performance & Caching

- **Client-Side Caching**: Automatic 24-hour localStorage caching to reduce API calls
- **Server-Side Caching**: In-memory caching in serverless functions for improved performance
- **Code Splitting**: Lazy loading of components for faster initial load
- **Skeleton Loading**: Smooth loading states while fetching data

### Privacy & Compliance

- **Cookie Consent Banner**: GDPR-compliant cookie consent management with:
  - Necessary cookies (always enabled)
  - Analytics cookies (optional)
  - Marketing cookies (optional)
  - Detailed accordion-style explanations for each category
  - Persistent settings button for preference updates
- **Privacy Policy**: Comprehensive privacy policy accessible from footer

### Architecture & Security

- **Serverless Architecture**: Secure API key handling via Netlify Functions
- **Error Boundary**: Graceful error handling throughout the application
- **TypeScript**: Full type safety across the codebase
- **Content Security Policy**: Enhanced security headers

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- GitHub Models API key (for OpenAI access)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd night-sky-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `night-sky-app` directory:

   ```env
   VITE_OPENAI_API_KEY=your_github_models_api_key_here
   ```

4. **Run the development server**

   For regular Vite development (direct API calls):

   ```bash
   npm run dev
   ```

   For testing with Netlify Functions locally:

   ```bash
   npm run dev:netlify
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 📦 Deployment to Netlify

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Netlify deployment support"
   git push origin main
   ```

### Step 2: Deploy to Netlify

#### Option A: Using Netlify Dashboard (Recommended)

1. **Sign up/Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or login with your GitHub account

2. **Create a New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify to access your repositories
   - Select your `night-sky-app` repository

3. **Configure Build Settings**

   Netlify should automatically detect settings from `netlify.toml`, but verify:
   - **Base directory**: `night-sky-app`
   - **Build command**: `npm run build`
   - **Publish directory**: `night-sky-app/dist`
   - **Functions directory**: `night-sky-app/netlify/functions`

4. **Set Environment Variables**
   - Go to "Site configuration" → "Environment variables"
   - Add the following variable:
     - **Key**: `OPENAI_API_KEY`
     - **Value**: Your GitHub Models API key

   ⚠️ **Important**: Use `OPENAI_API_KEY` (not `VITE_OPENAI_API_KEY`) for the serverless function

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your site will be live at `https://your-site-name.netlify.app`

#### Option B: Using Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize your site**

   ```bash
   netlify init
   ```

   Follow the prompts to:
   - Create a new site or link to an existing one
   - Configure build settings

4. **Set environment variables**

   ```bash
   netlify env:set OPENAI_API_KEY "your_github_models_api_key_here"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Step 3: Verify Deployment

1. Visit your Netlify URL
2. Try searching for astronomy events
3. Check browser DevTools console - you should see "📡 Using serverless function"
4. Verify the `X-Cache` header in Network tab (HIT for cached, MISS for fresh data)

## 🔧 Configuration

### Environment Variables

#### Development (.env file)

```env
VITE_OPENAI_API_KEY=your_api_key        # Used for direct API calls in development
VITE_USE_SERVERLESS=false               # Optional: Force serverless mode in dev
```

#### Production (Netlify Dashboard)

```env
OPENAI_API_KEY=your_api_key             # Used by serverless function
```

### Caching Configuration

**Client-Side Cache (localStorage)**

- Duration: 24 hours
- Key format: `astronomy_events_{country}_{month}_{year}`
- Can be cleared via browser DevTools

**Server-Side Cache (in-memory)**

- Duration: 24 hours
- Maximum entries: 100 (auto-cleanup)
- Persists during function warm starts

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

## 📁 Project Structure

```
night-sky-app/
├── netlify/
│   └── functions/
│       └── get-astronomy-events.ts    # Serverless function
├── src/
│   ├── components/
│   │   ├── AddToCalendar.tsx         # Calendar export functionality
│   │   ├── Button.tsx                # Reusable button component
│   │   ├── CookieConsent.tsx         # Cookie consent banner
│   │   ├── CountrySelect.tsx         # Country selection dropdown
│   │   ├── ErrorBoundary.tsx         # Error handling wrapper
│   │   ├── EventCard.tsx             # Event display card
│   │   ├── EventList.tsx             # Event list container
│   │   ├── Footer.tsx                # App footer with privacy link
│   │   ├── Input.tsx                 # Reusable input component
│   │   ├── Modal.tsx                 # Event detail modal
│   │   ├── MonthSelect.tsx           # Month selection dropdown
│   │   ├── PrivacyPolicy.tsx         # Privacy policy modal
│   │   ├── SearchForm.tsx            # Main search form
│   │   ├── ShareEvent.tsx            # Social sharing functionality
│   │   ├── SkeletonEventCard.tsx     # Loading skeleton
│   │   ├── SortSelect.tsx            # Sort options dropdown
│   │   ├── eventImages.ts            # Event image mappings
│   │   ├── months.ts                 # Month data
│   │   └── sortEvents.ts             # Event sorting logic
│   ├── hooks/
│   │   └── useDebounce.ts            # Debounce hook
│   ├── services/
│   │   └── openaiService.ts          # API service with caching
│   ├── styles/
│   │   ├── App.css                   # Main app styles
│   │   ├── CookieConsent.css         # Cookie banner styles
│   │   ├── index.css                 # Global styles
│   │   └── PrivacyPolicy.css         # Privacy policy styles
│   ├── utils/
│   │   ├── calendarLinks.ts          # Calendar export utilities
│   │   └── cookieConsent.ts          # Cookie management utilities
│   ├── __tests__/                    # Test files
│   ├── assets/                       # Images and icons
│   └── App.tsx                       # Main app component
├── netlify.toml                      # Netlify configuration
├── package.json
└── vite.config.ts
```

## 🎯 How It Works

### Development Mode

- Direct API calls to GitHub Models (OpenAI-compatible endpoint)
- Client-side caching in localStorage
- Fast development workflow

### Production Mode (Netlify)

1. User submits search form
2. Frontend checks localStorage cache
3. If not cached, calls `/.netlify/functions/get-astronomy-events`
4. Serverless function checks its in-memory cache
5. If not cached, function calls OpenAI API
6. Results are cached both server-side and client-side
7. Subsequent identical searches return instantly from cache

### Cache Strategy

- **First request**: ~5-10 seconds (API call)
- **Cached requests**: <100ms (instant)
- **Cache expiry**: 24 hours
- **Cache invalidation**: Automatic based on timestamp

## 🔒 Security

- ✅ API keys stored as environment variables
- ✅ No sensitive data exposed to client
- ✅ CORS properly configured
- ✅ Serverless functions protect API endpoints
- ✅ Production uses secure server-side API calls

## 🐛 Troubleshooting

### Build Fails on Netlify

- Check that `OPENAI_API_KEY` is set in environment variables
- Verify Node version is 20 or higher
- Check build logs for specific errors

### Serverless Function Errors

- Ensure environment variable is named `OPENAI_API_KEY` (not `VITE_OPENAI_API_KEY`)
- Check function logs in Netlify dashboard
- Verify API key is valid

### Caching Issues

- Clear localStorage in browser DevTools
- Check console for cache status messages
- Verify timestamps in cached data

## 📝 Scripts

- `npm run dev` - Start Vite development server
- `npm run dev:netlify` - Start Netlify dev server with functions
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run prettier` - Format code with Prettier

## Event Sorting

The application provides sorting controls above the event list:

- **Date (Oldest → Newest)**: Chronological order
- **Date (Newest → Oldest)**: Reverse chronological order
- **Title (A → Z)**: Alphabetical order
- **Title (Z → A)**: Reverse alphabetical order
- **Visibility (Naked Eye First)**: Shows naked-eye events before telescope events
- **Visibility (Telescope First)**: Shows telescope events before naked-eye events

## 🎨 User Features

### Event Interaction

- **Click to View Details**: Click any event card to open a detailed modal view
- **Add to Calendar**: Export individual events to your preferred calendar app
- **Share Events**: Share interesting astronomy events with friends via multiple platforms
- **Event Images**: Each event type displays a relevant astronomy image

### Privacy Controls

- **Cookie Settings**: Floating cookie icon (🍪) button allows users to update preferences anytime
- **Privacy Policy**: Accessible via the footer link
- **Granular Consent**: Choose exactly which cookie categories to enable

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Test files include:

- Component tests (EventCard, ShareEvent, CookieConsent, etc.)
- Utility function tests (calendarLinks, sortEvents, etc.)
- Service tests (openaiService)
- Hook tests (useDebounce)

## 📄 License

This project is part of a portfolio/learning project.

## 🤝 Contributing

This is a student project, but suggestions are welcome!
