document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/leaderboard')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('chart-container');

      // Optional: make chart container more mobile-friendly
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.width = '100%';
      container.style.overflowX = 'auto'; // For horizontal scroll on small screens

      const canvas = document.getElementById('leaderboardChart');
      canvas.style.minWidth = '300px';
      canvas.style.width = '100%';
      canvas.height = 400;

      const ctx = canvas.getContext('2d');

      // Sort data from highest to lowest
      const sortedIndices = [...Array(data.communities.length).keys()]
        .sort((a, b) => data.purchases[b] - data.purchases[a]);
      
      const sortedCommunities = sortedIndices.map(i => data.communities[i]);
      const sortedPurchases = sortedIndices.map(i => data.purchases[i]);
      const sortedColors = sortedIndices.map(i => data.colors[i]);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedCommunities,
          datasets: [{
            label: 'Number of Purchases',
            data: sortedPurchases,
            backgroundColor: sortedColors,
            borderRadius: 10,
            barThickness: 40
          }]
        },
        options: {
          animation: {
            duration: 2000,
            easing: 'easeOutQuart',
            delay: (context) => context.dataIndex * 200,
            onComplete: () => console.log('Animation complete!'),
            animateScale: true,
            animateRotate: true
          },
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Community Purchases Leaderboard',
              font: { size: 20, weight: 'bold' },
              padding: { top: 10, bottom: 30 }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { display: false },
              ticks: { font: { size: 14 } }
            },
            y: {
              ticks: { font: { size: 16, weight: 'bold' }, mirror: true, z: 1 },
              grid: { display: false }
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Failed to fetch leaderboard data:', error);
    });
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.innerHTML = '<svg...> Refreshing...';
  loadChartData();
});

async function loadChartData() {
  try {
    const response = await fetch('http://localhost:5000/leaderboard');
    const data = await response.json();
    updateChart(data); // You’ll need to define this function to refresh chart dynamically
  } catch (error) {
    console.error('Error:', error);
  } finally {
    const btn = document.getElementById('refreshBtn');
    btn.disabled = false;
    btn.innerHTML = '<svg...> Refresh Data';
  }
}

document.querySelectorAll('.comm-card').forEach(card => {
  card.addEventListener('click', function() {
    const community = this.querySelector('p').textContent;
    highlightCommunity(community);
  });
});

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
