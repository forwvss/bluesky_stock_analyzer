# Bluesky Stock Analyzer Frontend

This is the frontend for the Bluesky Stock Analyzer application, built with React, TypeScript, and Material-UI.

## Features

- Modern UI with Material Design
- Responsive layout for all devices
- Dark mode support
- Interactive stock charts
- Social media sentiment analysis visualization
- Detailed stock analysis reports

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- For backend: Anaconda or Miniconda

### Installation

#### Frontend Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd bluesky_stock_analyzer/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

#### Backend Setup (using Conda)

1. Navigate to the project root directory:
   ```
   cd bluesky_stock_analyzer
   ```

2. Create a new Conda environment:
   ```
   conda create -n bluesky_env python=3.9
   ```

3. Activate the Conda environment:
   ```
   conda activate bluesky_env
   ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

5. Start the Flask backend server:
   ```
   python app.py
   ```
   
   The backend server will start at http://localhost:5000

## Available Scripts

In the frontend directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Running Tests

The application includes comprehensive test coverage for components, services, and utilities. To run the tests:

```
npm test
```

To run tests with coverage report:

```
npm test -- --coverage
```

### Test Structure

Tests are organized in the following structure:

- `src/components/__tests__/` - Tests for React components
- `src/services/__tests__/` - Tests for API services
- `src/utils/__tests__/` - Tests for utility functions
- `src/context/__tests__/` - Tests for context providers

## Project Structure

- `src/components/` - React components
  - `common/` - Reusable components
  - `layout/` - Layout components
- `src/pages/` - Page components
- `src/services/` - API services
- `src/utils/` - Utility functions
- `src/context/` - React context providers
- `src/theme/` - Theme configuration
- `src/types/` - TypeScript type definitions

## Technologies Used

- React 18
- TypeScript
- Material-UI
- React Router
- Recharts
- Axios

## Backend Integration

The frontend communicates with the Flask backend API. The proxy is configured in `package.json` to forward API requests to the backend server running at `http://localhost:5000`.

## Development Workflow

1. Start the backend server using Conda (as described in the Backend Setup section)
2. In a separate terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```
3. Access the application at http://localhost:3000 