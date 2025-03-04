# Bluesky Stock Analyzer

A modern web application for analyzing stock market data and social media sentiment.

## Features

- Real-time stock data visualization
- Social media sentiment analysis
- Technical indicators and trend analysis
- User-friendly interface with dark mode support
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Flask, Python
- **Data Analysis**: Pandas, NumPy, NLTK
- **Visualization**: Recharts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Anaconda or Miniconda
- Git

### Installation

#### Clone the Repository

```bash
git clone https://github.com/yourusername/bluesky_stock_analyzer.git
cd bluesky_stock_analyzer
```

#### Backend Setup (with Conda)

1. Create a new Conda environment:
```bash
conda create -n bluesky_env python=3.9
```

2. Activate the Conda environment:
```bash
conda activate bluesky_env
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

4. Start the Flask backend server:
```bash
cd backend
python run.py
```

The backend server will start at http://localhost:5000

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Use the search bar to find a stock by symbol (e.g., AAPL, MSFT)
3. View real-time stock data, charts, and sentiment analysis
4. Switch between different time ranges and analysis views

## Development

### Running Tests

#### Backend Tests
```bash
conda activate bluesky_env
cd backend
pytest
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### Environment Management

#### Conda Commands

- List all Conda environments:
```bash
conda env list
```

- Activate the environment:
```bash
conda activate bluesky_env
```

- Deactivate the environment:
```bash
conda deactivate
```

- Remove the environment:
```bash
conda env remove --name bluesky_env
```

## Troubleshooting

### Common Issues

1. **Missing dependencies**: Make sure you've installed all required packages
```bash
conda activate bluesky_env
pip install -r requirements.txt
```

2. **Port already in use**: If port 5000 or 3000 is already in use, you can change the port in the configuration

3. **Node.js errors**: Make sure you have the correct version of Node.js installed
```bash
node --version
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Bluesky](https://blueskyweb.org/) for providing the social media API
- [Alpha Vantage](https://www.alphavantage.co/) for stock market data
- All open-source libraries used in this project 