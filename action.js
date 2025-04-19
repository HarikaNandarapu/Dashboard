let viewershipData = [];

// Function to load and process JSON data
function loadData() {
  const fileInput = document.getElementById('jsonFileInput');
  if (fileInput.files.length === 0) {
    alert("Please upload a JSON file.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      viewershipData = JSON.parse(e.target.result);
      generateDashboard();
    } catch (error) {
      alert("Invalid JSON file. Please upload a valid JSON file.");
    }
  };

  reader.readAsText(file);
}

// Function to generate the dashboard
function generateDashboard() {
  if (viewershipData.length === 0) {
    alert("No data available. Please upload a valid JSON file.");
    return;
  }

  // Extract data for visualizations
  const years = viewershipData.map(entry => entry.year);
  const peakViewership = viewershipData.map(entry => entry.peak_viewership);
  const videoTitles = viewershipData.map(entry => entry.video_title);

  // 1. Line Chart: Viewership Trends Over Time
  Plotly.newPlot('lineChart', [{
    x: years,
    y: peakViewership,
    type: 'line',
    name: 'Peak Viewership',
    marker: { color: '#6a89cc' }
  }], {
    title: 'Viewership Trends Over Time',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Peak Viewership' },
    plot_bgcolor: 'rgba(255, 255, 255, 0.5)',
    paper_bgcolor: 'rgba(255, 255, 255, 0.5)',
  });

  // 2. Bar Chart: Top-Performing Videos
  Plotly.newPlot('barChart', [{
    x: videoTitles,
    y: peakViewership,
    type: 'bar',
    name: 'Peak Viewership',
    marker: { color: '#82ccdd' }
  }], {
    title: 'Top-Performing Videos',
    xaxis: { title: 'Video Title' },
    yaxis: { title: 'Peak Viewership' },
    plot_bgcolor: 'rgba(255, 255, 255, 0.5)',
    paper_bgcolor: 'rgba(255, 255, 255, 0.5)',
  });

  // 3. Histogram: Viewership Distribution
  Plotly.newPlot('histogram', [{
    x: peakViewership,
    type: 'histogram',
    name: 'Viewership Distribution',
    marker: { color: '#f8c291' }
  }], {
    title: 'Viewership Distribution',
    xaxis: { title: 'Peak Viewership' },
    yaxis: { title: 'Frequency' },
    plot_bgcolor: 'rgba(255, 255, 255, 0.5)',
    paper_bgcolor: 'rgba(255, 255, 255, 0.5)',
  });

  // 4. Stacked Bar Chart: Video Performance by Year
  const yearlyData = {};
  viewershipData.forEach(entry => {
    if (!yearlyData[entry.year]) {
      yearlyData[entry.year] = [];
    }
    yearlyData[entry.year].push(entry.peak_viewership);
  });

  const stackedBarData = Object.keys(yearlyData).map(year => ({
    x: videoTitles.filter((_, i) => years[i] == year),
    y: yearlyData[year],
    type: 'bar',
    name: year
  }));

  Plotly.newPlot('stackedBarChart', stackedBarData, {
    title: 'Video Performance by Year',
    xaxis: { title: 'Video Title' },
    yaxis: { title: 'Peak Viewership' },
    barmode: 'stack',
    plot_bgcolor: 'rgba(255, 255, 255, 0.5)',
    paper_bgcolor: 'rgba(255, 255, 255, 0.5)',
  });

  // 5. Scatter Plot: Correlation Between Year and Viewership
  Plotly.newPlot('scatterPlot', [{
    x: years,
    y: peakViewership,
    mode: 'markers',
    type: 'scatter',
    name: 'Viewership',
    marker: { color: '#e55039' }
  }], {
    title: 'Correlation Between Year and Viewership',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Peak Viewership' },
    plot_bgcolor: 'rgba(255, 255, 255, 0.5)',
    paper_bgcolor: 'rgba(255, 255, 255, 0.5)',
  });
}