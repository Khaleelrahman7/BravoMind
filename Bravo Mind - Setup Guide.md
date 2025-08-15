# Bravo Mind - Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18 or higher
- npm or pnpm package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Installation Steps

```bash
# Navigate to project directory
cd bravo-mind

# Install dependencies
npm install
# or if you prefer pnpm
pnpm install

# Start development server
npm run dev
# or
pnpm run dev

# Open browser to http://localhost:5173
```

### 3. Project Dependencies

The project uses these key dependencies (already configured):

```json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.1.1",
    "recharts": "^2.15.0",
    "lucide-react": "^0.468.0",
    "tailwindcss": "^3.4.17",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  }
}
```

## File Structure Explanation

### Core Application Files

- **`src/App.jsx`** - Main application component with routing and layout
- **`src/App.css`** - Global styles and military theme variables
- **`src/main.jsx`** - React application entry point
- **`index.html`** - HTML template

### Component Files

- **`src/components/ui/military-theme.jsx`** - Reusable military-themed UI components
- **`src/components/AIChat.jsx`** - AI companion chat interface
- **`src/components/Missions.jsx`** - Interactive mission system
- **`src/components/BiometricDashboard.jsx`** - Health data visualization
- **`src/components/RallyPoint.jsx`** - Peer matching and chat system

### Utility Files

- **`src/lib/utils.js`** - Helper functions and mock data
- **`src/assets/`** - Images and static assets

## Key Features Implementation

### 1. Military Theme System
The app uses a custom military theme with:
- Dark color scheme (slate-900 background)
- Green accent colors (#22C55E)
- Military-style typography and components
- Tactical card layouts with status indicators

### 2. AI Companion
- Context-aware response system
- Keyword-based conversation routing
- Proactive check-in simulation
- Quick response buttons

### 3. Mission System
- Interactive wellness exercises
- Progress tracking with visual indicators
- Point-based gamification
- Mission completion states

### 4. Biometric Dashboard
- Recharts integration for data visualization
- Simulated health data generation
- Multiple time range views (7d, 30d, 90d)
- AI-generated health insights

### 5. Rally Point
- Peer compatibility algorithm
- Anonymous chat simulation
- Service branch and experience matching
- Connection management system

## Customization Guide

### Changing Colors
Edit `src/App.css` to modify the military theme:

```css
:root {
  --background: oklch(0.145 0 0);     /* Dark background */
  --foreground: oklch(0.985 0 0);     /* Light text */
  --primary: oklch(0.922 0 0);        /* Primary buttons */
  /* ... other color variables */
}
```

### Adding New Missions
1. Open `src/components/Missions.jsx`
2. Add to `availableMissions` array:

```javascript
{
  id: 'new-mission',
  title: 'Mission Title',
  description: 'Mission description',
  difficulty: 'easy',
  points: 15,
  icon: IconComponent,
  component: MissionComponent
}
```

3. Create the mission component following the existing patterns

### Modifying AI Responses
Edit `src/components/AIChat.jsx` in the `generateContextualResponse` function:

```javascript
if (input.includes('your-keyword')) {
  return "Your custom AI response here";
}
```

### Adding Biometric Data Types
Modify `src/components/BiometricDashboard.jsx` to add new health metrics:

1. Update data generation in `generateData` function
2. Add new StatCard components
3. Create additional charts as needed

## Development Tips

### 1. Hot Reload
The development server supports hot reload - changes to files will automatically update the browser.

### 2. Component Structure
Each major feature is organized as a separate component with its own state management.

### 3. Mock Data
All data is simulated using functions in `src/lib/utils.js`. Modify these for different scenarios.

### 4. Responsive Design
The app uses Tailwind CSS responsive classes (sm:, md:, lg:, xl:) for mobile compatibility.

## Troubleshooting

### Common Issues

1. **Port 5173 already in use**
   ```bash
   # Kill existing process
   lsof -ti:5173 | xargs kill -9
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Dependencies not installing**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**
   ```bash
   # Check for TypeScript errors (even in .jsx files)
   npm run build
   ```

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build creates optimized files in the `dist/` directory.

## Performance Notes

- The app loads ~661KB of JavaScript (gzipped: ~190KB)
- Charts are rendered client-side using Recharts
- All animations use CSS transitions for smooth performance
- Images are optimized for web delivery

## Security Considerations

- No real user data is transmitted
- All peer communications are simulated
- Local storage only (no external APIs)
- No authentication required for prototype

---

For additional help, refer to the component documentation within the source files.

