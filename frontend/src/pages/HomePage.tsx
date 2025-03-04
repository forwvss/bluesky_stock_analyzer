import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TimelineIcon from '@mui/icons-material/Timeline';

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?stocks)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Bluesky Stock Analyzer
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Analyze stock market trends using social media data from Bluesky.
                Get real-time insights and make informed investment decisions.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/dashboard"
                startIcon={<ShowChartIcon />}
                sx={{ mt: 2 }}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h3">
                  Real-time Analysis
                </Typography>
                <Typography>
                  Get real-time analysis of stock market trends based on social media sentiment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <AnalyticsIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h3">
                  Sentiment Analysis
                </Typography>
                <Typography>
                  Advanced sentiment analysis using multiple models to provide accurate insights.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <TimelineIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h3">
                  Interactive Visualizations
                </Typography>
                <Typography>
                  Interactive charts and visualizations to help you understand market trends.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mt: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Start analyzing stock market trends with Bluesky data today.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/dashboard"
              sx={{ mx: 1 }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/analysis"
              sx={{ mx: 1 }}
            >
              View Analysis
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 