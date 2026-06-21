# Pantry.io - Smart Meal Planning App

A modern web application that helps you find recipes based on what you already have in your pantry, reducing food waste and making meal planning effortless.

## Features

### ✨ Recipe Search
Search thousands of free recipes by name, category, or cuisine

### 🏺 Pantry Management
Track items in your pantry, fridge, and freezer

### 🎯 Smart Meal Planning
Get recipe suggestions based on your available ingredients

### 📋 Shopping List Generation
Automatically create shopping lists for missing ingredients

### 📷 Barcode Scanner
Scan product barcodes to instantly add items to your pantry

### 📱 Responsive Design
Works seamlessly on desktop and mobile devices

### ⚡ Performance Optimized
Lazy loading, code splitting, and memoization

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **API**: TheMealDB (free recipe API) + Open Food Facts (product database)
- **Styling**: CSS3 with responsive design
- **Testing**: Jest & React Testing Library
- **Build**: Create React App
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/crh225/pantry.io.git

# Navigate to project directory
cd pantry.io

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.

### Running Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

```bash
npm test -- --coverage
```

Runs tests with coverage report.

## Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Shared components (Header, etc.)
│   ├── recipe/          # Recipe-related components
│   ├── pantry/          # Pantry management components
│   └── MealPlannerPage.tsx
├── store/               # Redux store
│   ├── slices/         # Redux slices
│   ├── hooks.ts        # Typed Redux hooks
│   └── index.ts        # Store configuration
├── services/            # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## Architecture

The application follows a layered architecture:

- **Presentation Layer**: React components with minimal logic
- **Application Layer**: Redux state management (actions, reducers, selectors)
- **Data Access Layer**: API integration services
- **Domain Layer**: Business logic and utility functions

Files approach 50 lines → signal to refactor into focused modules (soft trigger, not a hard gate).

## Performance Optimizations

- ✅ Code splitting with React.lazy()
- ✅ Component memoization with React.memo
- ✅ Lazy image loading
- ✅ Redux selector optimization
- ✅ Local storage for pantry persistence

## Security Features

- ✅ Input validation and sanitization
- ✅ XSS protection (angle bracket removal)
- ✅ Input length limits
- ✅ Error handling and user feedback

## User Documentation

- [User Personas](USER_PERSONAS.md) - Target user profiles
- [User Stories](USER_STORIES.md) - Feature specifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Recipe data provided by [TheMealDB](https://www.themealdb.com/)
- Product data from [Open Food Facts](https://world.openfoodfacts.org/)
- Built with Create React App
- Icons and emojis from native emoji sets
