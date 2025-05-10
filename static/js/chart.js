document.addEventListener('DOMContentLoaded', () => {
  loadChartData();
  
  // Refresh button event
  document.getElementById('refreshBtn').addEventListener('click', () => {
    const btn = document.getElementById('refreshBtn');
    btn.disabled = true;
    btn.innerHTML = '<svg...> Refreshing...';
    loadChartData();
  });

  // Community card interactions
  document.querySelectorAll('.comm-card').forEach(card => {
    card.addEventListener('click', function() {
      const community = this.querySelector('p').textContent;
      highlightCommunity(community);
    });
  });
});

async function loadChartData() {
  try {
    const response = await fetch('http://localhost:5000/leaderboard');
    const data = await response.json();
    renderChart(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    const btn = document.getElementById('refreshBtn');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg...> Refresh Data';
    }
  }
}

function renderChart(data) {
  const container = document.getElementById('chart-container');
  const canvas = document.getElementById('leaderboardChart');
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // Canvas setup
  canvas.style.minWidth = '300px';
  canvas.style.width = '100%';
  canvas.style.height = isMobile ? 
    `${Math.max(400, data.communities.length * 50)}px` : 
    '600px';

  const ctx = canvas.getContext('2d');

  // Sort data
  const sortedIndices = [...Array(data.communities.length).keys()]
    .sort((a, b) => data.purchases[b] - data.purchases[a]);
  
  const sortedCommunities = sortedIndices.map(i => data.communities[i]);
  const sortedPurchases = sortedIndices.map(i => data.purchases[i]);
  const sortedColors = sortedIndices.map(i => data.colors[i]);

  // Create or update chart
  if (window.leaderboardChart) {
    window.leaderboardChart.destroy();
  }

  window.leaderboardChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedCommunities,
      datasets: [{
        label: 'Number of Purchases',
        data: sortedPurchases,
        backgroundColor: sortedColors,
        borderRadius: 10,
        barThickness: 'flex',
        categoryPercentage: isMobile ? 0.6 : 0.8,
        barPercentage: isMobile ? 0.8 : 0.9
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: isMobile ? 0.8 : 1.5,
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
        delay: (context) => context.dataIndex * 200,
        onComplete: () => console.log('Animation complete!'),
        animateScale: true,
        animateRotate: true
      },
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Community Purchases Leaderboard',
          font: { 
            size: isMobile ? 16 : 20,
            weight: 'bold' 
          },
          padding: { top: 10, bottom: 30 }
        },
        tooltip: {
          enabled: !isMobile
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { display: false },
          ticks: { 
            font: { 
              size: isMobile ? 12 : 14 
            } 
          }
        },
        y: {
          ticks: { 
            font: { 
              size: isMobile ? 12 : 16,
              weight: 'bold' 
            },
            mirror: true,
            z: 1 
          },
          grid: { display: false }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'y',
        intersect: false
      }
    }
  });
}

function highlightCommunity(community) {
  document.querySelectorAll('.comm-card').forEach(card => {
    card.style.border = 'none';
  });

  const card = [...document.querySelectorAll('.comm-card')]
    .find(c => c.querySelector('p').textContent === community);

  if (card) {
    card.style.border = '3px solid #EF7F36';
    card.style.borderRadius = '12px';
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  if (window.leaderboardChart) {
    window.leaderboardChart.destroy();
    loadChartData();
  }
// Add this right before your DOMContentLoaded ends
function optimizeForMobile() {
  const isMobile = window.innerWidth <= 768;
  const canvas = document.getElementById('leaderboardChart');
  
  if (!canvas) return;
  
  // Mobile-specific adjustments
  if (isMobile) {
    canvas.height = Math.max(400, data.communities.length * 60);
    
    if (window.leaderboardChart) {
      window.leaderboardChart.options.scales.y.ticks.font.size = 14;
      window.leaderboardChart.options.scales.y.ticks.padding = 10;
      window.leaderboardChart.options.barThickness = 20;
      window.leaderboardChart.update();
    }
  }
}

// Add this event listener
window.addEventListener('resize', optimizeForMobile);

// Call it initially
optimizeForMobile();
});
