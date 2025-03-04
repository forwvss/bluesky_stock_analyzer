import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { SelectChangeEvent } from '@mui/material/Select';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `analysis-tab-${index}`,
    'aria-controls': `analysis-tabpanel-${index}`,
  };
}

// Mock data for the analysis
const mockAnalysisData = [
  { date: '2023-06-01', sentiment: 0.75, volume: 1250, price: 150.25, change: 2.5 },
  { date: '2023-06-02', sentiment: 0.65, volume: 980, price: 148.75, change: -1.0 },
  { date: '2023-06-03', sentiment: 0.80, volume: 1500, price: 152.50, change: 2.5 },
  { date: '2023-06-04', sentiment: 0.45, volume: 2000, price: 145.75, change: -4.4 },
  { date: '2023-06-05', sentiment: 0.60, volume: 1750, price: 147.25, change: 1.0 },
];

const AnalysisPage: React.FC = () => {
  const [stockSymbol, setStockSymbol] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('1m');
  const [tabValue, setTabValue] = useState(0);
  
  const handleStockSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStockSymbol(event.target.value);
  };
  
  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    setTimeRange(event.target.value);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSearch = () => {
    // This would fetch data from the backend
    console.log(`Analyzing ${stockSymbol} with time range ${timeRange}`);
  };
  
  const handleDownloadReport = () => {
    // This would generate and download a report
    console.log(`Downloading report for ${stockSymbol}`);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Detailed Stock Analysis
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
                <MenuItem value="1w">1 Week</MenuItem>
                <MenuItem value="1m">1 Month</MenuItem>
                <MenuItem value="3m">3 Months</MenuItem>
                <MenuItem value="6m">6 Months</MenuItem>
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
              Analyze
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Analysis Content */}
      {stockSymbol ? (
        <Paper sx={{ width: '100%', mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="analysis tabs">
              <Tab label="Overview" {...a11yProps(0)} />
              <Tab label="Sentiment Analysis" {...a11yProps(1)} />
              <Tab label="Price Correlation" {...a11yProps(2)} />
              <Tab label="Historical Data" {...a11yProps(3)} />
            </Tabs>
          </Box>
          
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography paragraph>
                  This analysis provides insights into {stockSymbol.toUpperCase()} stock performance based on social media sentiment from Bluesky.
                  The data covers the selected time period and shows correlations between social media activity and stock price movements.
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Key Findings
                </Typography>
                <Typography paragraph>
                  • Overall sentiment is positive (0.65 on a scale of -1 to 1)<br />
                  • Strong correlation between positive sentiment spikes and price increases<br />
                  • Average daily mentions: 125<br />
                  • Most active discussion days coincide with earnings reports
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadReport}
                  sx={{ mt: 2 }}
                >
                  Download Full Report
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Summary chart will be displayed here
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Sentiment Analysis Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Sentiment Analysis Over Time
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: 1, mb: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Sentiment trend chart will be displayed here
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Sentiment Distribution
                </Typography>
                <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Sentiment distribution chart will be displayed here
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Key Sentiment Metrics
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Average Sentiment</TableCell>
                        <TableCell align="right">0.65</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sentiment Volatility</TableCell>
                        <TableCell align="right">0.12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Positive Posts</TableCell>
                        <TableCell align="right">68%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Negative Posts</TableCell>
                        <TableCell align="right">22%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Neutral Posts</TableCell>
                        <TableCell align="right">10%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Price Correlation Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Sentiment vs. Price Correlation
            </Typography>
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: 1, mb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Correlation chart will be displayed here
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Analysis
            </Typography>
            <Typography paragraph>
              The correlation coefficient between social media sentiment and stock price for {stockSymbol.toUpperCase()} is 0.72, 
              indicating a strong positive correlation. This suggests that positive sentiment on Bluesky often precedes price increases, 
              with an average lag of 1-2 trading days.
            </Typography>
            <Typography paragraph>
              The strongest correlations are observed around earnings announcements and product launches, 
              where social media activity spikes significantly.
            </Typography>
          </TabPanel>
          
          {/* Historical Data Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Historical Data
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Sentiment Score</TableCell>
                    <TableCell align="right">Post Volume</TableCell>
                    <TableCell align="right">Stock Price</TableCell>
                    <TableCell align="right">Price Change (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAnalysisData.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell align="right">{row.sentiment.toFixed(2)}</TableCell>
                      <TableCell align="right">{row.volume}</TableCell>
                      <TableCell align="right">${row.price.toFixed(2)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: row.change >= 0 ? 'success.main' : 'error.main' 
                        }}
                      >
                        {row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => console.log('Download CSV')}
              >
                Download CSV
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Enter a Stock Symbol to Begin Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Use the search field above to enter a stock symbol (e.g., AAPL, MSFT, GOOGL) and select a time range to analyze.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default AnalysisPage; 