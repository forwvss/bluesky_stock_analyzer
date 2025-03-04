import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SelectChangeEvent } from '@mui/material/Select';

// Mock data for charts
const mockStockData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Stock Price',
      data: [33, 53, 85, 41, 44, 65],
      fill: false,
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};

const mockSentimentData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Positive Sentiment',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(75,192,192,0.4)',
    },
    {
      label: 'Negative Sentiment',
      data: [28, 48, 40, 19, 86, 27],
      backgroundColor: 'rgba(255,99,132,0.4)',
    },
  ],
};

const DashboardPage: React.FC = () => {
  const [stockSymbol, setStockSymbol] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('1w');
  
  const handleStockSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStockSymbol(event.target.value);
  };
  
  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    setTimeRange(event.target.value);
  };
  
  const handleSearch = () => {
    // This would fetch data from the backend
    console.log(`Searching for ${stockSymbol} with time range ${timeRange}`);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Analysis Dashboard
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Stock Symbol"
              variant="outlined"
              value={stockSymbol}
              onChange={handleStockSymbolChange}
              placeholder="e.g. AAPL, MSFT, GOOGL"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                onChange={handleTimeRangeChange}
                label="Time Range"
              >
                <MenuItem value="1d">1 Day</MenuItem>
                <MenuItem value="1w">1 Week</MenuItem>
                <MenuItem value="1m">1 Month</MenuItem>
                <MenuItem value="3m">3 Months</MenuItem>
                <MenuItem value="1y">1 Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              size="large"
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Stock Overview */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Stock Price History
              </Typography>
              <Button startIcon={<RefreshIcon />} size="small">
                Refresh
              </Button>
            </Box>
            <Divider />
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Chart will be displayed here. Select a stock symbol to view data.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Stock Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stockSymbol ? (
              <Box>
                <Typography variant="h4" gutterBottom>
                  {stockSymbol.toUpperCase()}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Current Price
                    </Typography>
                    <Typography variant="h6">$0.00</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Change
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      +0.00%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Open
                    </Typography>
                    <Typography variant="h6">$0.00</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Previous Close
                    </Typography>
                    <Typography variant="h6">$0.00</Typography>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Enter a stock symbol to view information
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Sentiment Analysis */}
      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Social Media Sentiment Analysis
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stockSymbol ? (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Sentiment chart will be displayed here
                </Typography>
              </Box>
            ) : (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Enter a stock symbol to view sentiment analysis
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Posts */}
      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Bluesky Posts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stockSymbol ? (
              <Grid container spacing={2}>
                {[1, 2, 3].map((post) => (
                  <Grid item xs={12} key={post}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          @username
                        </Typography>
                        <Typography variant="body1">
                          This is a sample post about {stockSymbol.toUpperCase()}. The actual content will be fetched from the Bluesky API.
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Posted 2 hours ago
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Enter a stock symbol to view recent posts
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 