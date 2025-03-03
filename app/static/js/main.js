/**
 * Bluesky Stock Analyzer - Main JavaScript
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Add event listeners for tabs
    initializeTabs();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    // Fetch all forms that need validation
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Initialize tab functionality
 */
function initializeTabs() {
    const tabElements = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabElements.forEach(function(tabElement) {
        tabElement.addEventListener('click', function(event) {
            event.preventDefault();
            new bootstrap.Tab(tabElement).show();
        });
    });
}

/**
 * Create a sentiment distribution chart
 * 
 * @param {string} elementId - The ID of the element to render the chart in
 * @param {Object} data - The sentiment data
 */
function createSentimentChart(elementId, data) {
    // Count sentiment labels
    const sentimentCounts = {
        'positive': 0,
        'negative': 0,
        'neutral': 0
    };
    
    // Process data
    data.forEach(item => {
        if (item.sentiment && item.sentiment.consensus) {
            const label = item.sentiment.consensus.label;
            sentimentCounts[label] = (sentimentCounts[label] || 0) + 1;
        }
    });
    
    // Create chart data
    const chartData = [
        {
            values: [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral],
            labels: ['Positive', 'Negative', 'Neutral'],
            type: 'pie',
            marker: {
                colors: ['#28a745', '#dc3545', '#6c757d']
            },
            textinfo: 'label+percent',
            hole: 0.4
        }
    ];
    
    // Layout configuration
    const layout = {
        title: 'Sentiment Distribution',
        height: 400,
        showlegend: true
    };
    
    // Create chart
    Plotly.newPlot(elementId, chartData, layout);
}

/**
 * Create a sentiment timeline chart
 * 
 * @param {string} elementId - The ID of the element to render the chart in
 * @param {Object} data - The sentiment data
 */
function createTimelineChart(elementId, data) {
    // Group data by date
    const dateGroups = {};
    
    // Process data
    data.forEach(item => {
        if (item.created_at && item.sentiment && item.sentiment.consensus) {
            // Parse date (assuming ISO format)
            const date = new Date(item.created_at);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
            
            if (!dateGroups[dateStr]) {
                dateGroups[dateStr] = {
                    'positive': 0,
                    'negative': 0,
                    'neutral': 0
                };
            }
            
            const label = item.sentiment.consensus.label;
            dateGroups[dateStr][label]++;
        }
    });
    
    // Sort dates
    const sortedDates = Object.keys(dateGroups).sort();
    
    // Prepare chart data
    const positiveData = {
        x: sortedDates,
        y: sortedDates.map(date => dateGroups[date].positive),
        name: 'Positive',
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: '#28a745' }
    };
    
    const negativeData = {
        x: sortedDates,
        y: sortedDates.map(date => dateGroups[date].negative),
        name: 'Negative',
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: '#dc3545' }
    };
    
    const neutralData = {
        x: sortedDates,
        y: sortedDates.map(date => dateGroups[date].neutral),
        name: 'Neutral',
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: '#6c757d' }
    };
    
    // Layout configuration
    const layout = {
        title: 'Sentiment Over Time',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Count' },
        height: 400
    };
    
    // Create chart
    Plotly.newPlot(elementId, [positiveData, negativeData, neutralData], layout);
}

/**
 * Create a keyword distribution chart
 * 
 * @param {string} elementId - The ID of the element to render the chart in
 * @param {Object} data - The sentiment data
 */
function createKeywordChart(elementId, data) {
    // Count keywords
    const keywordCounts = {};
    
    // Process data
    data.forEach(item => {
        if (item.keyword) {
            keywordCounts[item.keyword] = (keywordCounts[item.keyword] || 0) + 1;
        }
    });
    
    // Sort keywords by count
    const sortedKeywords = Object.keys(keywordCounts).sort((a, b) => keywordCounts[b] - keywordCounts[a]);
    
    // Take top 10 keywords
    const topKeywords = sortedKeywords.slice(0, 10);
    
    // Prepare chart data
    const chartData = [
        {
            x: topKeywords,
            y: topKeywords.map(keyword => keywordCounts[keyword]),
            type: 'bar',
            marker: {
                color: '#0d6efd'
            }
        }
    ];
    
    // Layout configuration
    const layout = {
        title: 'Top Keywords',
        xaxis: { title: 'Keyword' },
        yaxis: { title: 'Count' },
        height: 400
    };
    
    // Create chart
    Plotly.newPlot(elementId, chartData, layout);
}

/**
 * Load and visualize data
 * 
 * @param {string} url - The URL to fetch data from
 */
function loadAndVisualizeData(url) {
    // Show loading state
    document.getElementById('visualization-placeholder').style.display = 'block';
    document.getElementById('visualization-container').style.display = 'none';
    
    // Fetch data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Hide placeholder, show container
            document.getElementById('visualization-placeholder').style.display = 'none';
            document.getElementById('visualization-container').style.display = 'block';
            
            // Create charts
            createSentimentChart('sentiment-chart', data);
            createTimelineChart('timeline-chart', data);
            createKeywordChart('keyword-chart', data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('visualization-placeholder').innerHTML = `
                <i class="fas fa-exclamation-triangle fa-4x text-danger mb-3"></i>
                <h4 class="text-danger">Error Loading Data</h4>
                <p class="text-muted">There was an error loading the data. Please try again.</p>
            `;
            document.getElementById('visualization-placeholder').style.display = 'block';
            document.getElementById('visualization-container').style.display = 'none';
        });
} 