document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/leaderboard')
    .then(response => response.json())
    .then(data => {
      const ctx = document.getElementById('leaderboardChart').getContext('2d');

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
          // Animation configuration goes here inside options
          animation: {
            duration: 2000,
            easing: 'easeOutQuart',
            delay: (context) => {
              // Stagger the animation for each bar
              return context.dataIndex * 200;
            },
            onComplete: () => {
              console.log('Animation complete!');
              // You could add visual effects here when animation finishes
            },
            animateScale: true,  // Adds zoom effect
            animateRotate: true  // Adds slight rotation effect
          },
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              display: false
            },
            title: {
              display: true,
              text: 'Community Purchases Leaderboard',
              font: { 
                size: 20,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 30
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false
              },
              ticks: { 
                font: { 
                  size: 14 
                } 
              }
            },
            y: {
              ticks: { 
                font: { 
                  size: 16, 
                  weight: 'bold' 
                },
                mirror: true,
                z: 1
              },
              grid: {
                display: false
              }
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
  // Show loading state
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.innerHTML = '<svg...> Refreshing...';
  
  // Reload chart
  loadChartData();
});

async function loadChartData() {
  try {
    const response = await fetch('http://localhost:5000/leaderboard');
    const data = await response.json();
    updateChart(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Reset button
    const btn = document.getElementById('refreshBtn');
    btn.disabled = false;
    btn.innerHTML = '<svg...> Refresh Data';
  }
}

// Add click handlers to community cards
document.querySelectorAll('.comm-card').forEach(card => {
  card.addEventListener('click', function() {
    const community = this.querySelector('p').textContent;
    highlightCommunity(community);
  });
});

function highlightCommunity(community) {
  // Remove all highlights first
  document.querySelectorAll('.comm-card').forEach(card => {
    card.style.border = 'none';
  });
  
  // Highlight selected
  const card = [...document.querySelectorAll('.comm-card')]
    .find(c => c.querySelector('p').textContent === community);
  
  if (card) {
    card.style.border = '3px solid #EF7F36';
    card.style.borderRadius = '12px';
  }
  
  // You could also filter the chart here if needed
}
