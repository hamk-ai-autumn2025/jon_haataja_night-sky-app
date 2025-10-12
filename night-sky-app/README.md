# Skai - Night Sky App

A React + TypeScript + Vite application that helps you discover astronomy events in your country using AI-powered search.

## 🌟 Features

- **AI-Powered Event Search**: Get comprehensive astronomy events for any country and month
- **Client-Side Caching**: Automatic 24-hour localStorage caching to reduce API calls
- **Serverless Architecture**: Secure API key handling via Netlify Functions
- **Server-Side Caching**: In-memory caching in serverless functions for improved performance
- **Event Sorting**: Sort events by date, title, or visibility requirements
- **Responsive Design**: Beautiful UI that works on all devices

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
│   ├── components/                     # React components
│   ├── services/
│   │   └── openaiService.ts           # API service with caching
│   ├── styles/                        # CSS files
│   └── App.tsx                        # Main app component
├── netlify.toml                       # Netlify configuration
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
- `npm run lint` - Run ESLint
- `npm run prettier` - Format code with Prettier

## Event Sorting

The application provides sorting controls above the event list:

- Date (Oldest → Newest)
- Date (Newest → Oldest)
- Title (A → Z)
- Title (Z → A)
- Visibility (Naked Eye First)
- Visibility (Telescope First)

## 📄 License

This project is part of a portfolio/learning project.

## 🤝 Contributing

This is a student project, but suggestions are welcome!
