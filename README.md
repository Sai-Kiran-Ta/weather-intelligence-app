# Weather Intelligence Web App 🌤️

Weather Intelligence is a highly polished, fully responsive, and feature-rich React application built with TypeScript, Tailwind CSS, and Recharts. It connects to the public, high-precision, keyless **Open-Meteo APIs** to provide live local weather analysis, geocoding lookups, and customizable weather trends.

## 🌟 Key Features

1. **Intelligent City Search**: Dual searching options via automated geocoding lookup (yielding matching locations list on typing) and instant single-search queries.
2. **Current Conditions Display**: Visually striking current weather indicators including actual/feels-like temperatures, humidity, wind velocity, precipitation rates, and peak daily UV indexes.
3. **7-Day Outlook**: Responsive daily outlook forecast displaying temperature ranges, precipitation likelihood, and key weather conditions. Translates into a horizontal scroll layout on mobile viewports.
4. **Interactive Meteorological Trends**: Immersive charts powered by **Recharts** letting users toggle dynamic area forecasts for Temperature, Precipitation, and Wind Speeds.
5. **Smart Weather Recommendations**: Automatically evaluates active values to provide suggestions for apparel ("Wear warm clothes"), sun safety ("Apply sunscreen"), hydration ("Stay hydrated"), and items protection ("Carry an umbrella").
6. **Robust Error Handling**: Handles geocoding lookup failures and weather API connection issues gracefully. Shows matching major metropolis backups for easy recovery.
7. **Local State Persistence**: Stores search history list, chosen measurement units, and the last observed city in local storage. Automatically retrieves the latest forecast for the last viewed city on boot.
8. **Position Autodetect**: Seamlessly retrieves precise location using the browser Geolocation API to fetch local forecasts directly.

---

## 📂 Project Structure

```text
/
├── .env.example           # Shared environment configurations
├── index.html             # Single Page Application main HTML container
├── package.json           # Node dependencies & automation scripts
├── tsconfig.json          # TypeScript compilation settings
├── vite.config.ts         # Vite server & bundler configuration
└── src/
    ├── main.tsx           # Entry point and React strict mount
    ├── App.tsx            # Main application coordinator
    ├── index.css          # Tailwind CSS styling directives
    ├── types.ts           # Unified TypeScript definitions
    ├── utils.ts           # Core weather algorithms & units converters
    └── components/
        ├── WeatherIcon.tsx        # Dynamic Lucide icon lookup component
        ├── CurrentWeatherCard.tsx # Detailed live weather card
        ├── ForecastGrid.tsx       # 7-day responsive forecast
        ├── WeatherCharts.tsx      # Recharts trend graphing
        ├── Recommendations.tsx    # Intelligent planning recommendations
        └── ErrorDisplay.tsx       # Fault screen & location backups
```

---

## 🛠️ Local Setup Instructions

Follow these instructions to run the application on your computer:

### Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm** or **yarn**

### 1. Clone & Navigate
If you have downloaded the source folder, open your terminal and navigate to the root directory:
```bash
cd weather-intelligence
```

### 2. Install Dependencies
Install all required node packages and build systems:
```bash
npm install
```

### 3. Launch Development Server
Launch the local Vite server:
```bash
npm run dev
```
The application will begin running. Open [http://localhost:3000](http://localhost:3000) in your browser to view it.

### 4. Build for Production
Create the compiled, minified production assets inside the `dist/` directory:
```bash
npm run build
```

---

## 🚀 Deployment Instructions

### Option 1: Deploying to GitHub
To push your project repository from AI Studio workspace to GitHub:

1. **Initialize Git Repository Locally** (if downloading the ZIP source):
   ```bash
   git init
   git add .
   git commit -m "feat: complete weather intelligence application"
   ```
2. **Create a New Repository on GitHub**:
   - Visit [GitHub](https://github.com) and create a new repository (e.g., `weather-intelligence`).
   - Do *not* initialize it with a README, license, or gitignore file (since they are already in this workspace).
3. **Link and Push to GitHub**:
   ```bash
   git remote add origin https://github.com/your-username/weather-intelligence.git
   git branch -M main
   git push -u origin main
   ```

---

### Option 2: Deploying to Cloudflare Pages (Recommended)
Cloudflare Pages provides blazing-fast static hosting for React-Vite applications with automatic edge deployment.

#### Method A: Direct Upload via CLI (Fastest)
1. **Build the Application**:
   Ensure you have compiled the latest code:
   ```bash
   npm run build
   ```
   This generates the build folder inside `/dist`.
2. **Deploy using Wrangler**:
   Run the following command to deploy the static build directly to Cloudflare:
   ```bash
   npx wrangler pages deploy dist --project-name=weather-intelligence
   ```
3. Follow the CLI authentication prompts to connect your Cloudflare account, and your site will be live on a custom `.pages.dev` subdomain!

#### Method B: Connected Git Repository (Automated CI/CD)
1. **Connect Cloudflare to GitHub**:
   - Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com).
   - Navigate to **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**.
2. **Select Repository**:
   - Select your newly pushed `weather-intelligence` repository.
3. **Configure Build Settings**:
   - **Framework Preset**: Select **Vite** or **Create React App** (or leave as custom).
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
4. **Deploy**:
   - Click **Save and Deploy**. Cloudflare will automatically fetch your code, build it, and redeploy every time you push updates to GitHub!
