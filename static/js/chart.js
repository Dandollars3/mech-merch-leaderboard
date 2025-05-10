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
  const isMobile = window.innerWidth <= 768;
  const canvas = document.getElementById('leaderboardChart');
  const mobileHeight = Math.max(400, data.communities.length * 75);
  
  // Canvas setup
  canvas.style.width = '100%';
  canvas.style.height = isMobile ? `${mobileHeight}px` : '500px';

  const ctx = canvas.getContext('2d');

  // Destroy existing chart
  if (window.leaderboardChart) {
    window.leaderboardChart.destroy();
  }

  window.leaderboardChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.communities,
      datasets: [{
        label: 'Number of Purchases',
        data: data.purchases,
        backgroundColor: data.colors,
        borderRadius: 10,
        barThickness: isMobile ? 20 : 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      layout: {
        padding: isMobile ? { 
          left: 25, 
          right: 25, 
          top: 25, 
          bottom: 25 
        } : {}
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
        delay: (context) => context.dataIndex * 200,
        onComplete: () => console.log('Animation complete!'),
        animateScale: true,
        animateRotate: true
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            font: {
              size: isMobile ? 12 : 14
            },
            count: isMobile ? 5 : 10
          },
          grid: { display: false }
        },
        y: {
          ticks: {
            font: {
              size: isMobile ? 15 : 16,
              weight: 'bold'
            },
            autoSkip: false,
            padding: isMobile ? 15 : 5
          },
          grid: { display: false }
        }
      },
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
      }
    }
  });

  // Handle window resize
  const resizeObserver = new ResizeObserver(() => {
    if (window.leaderboardChart) {
      const newMobileHeight = Math.max(400, data.communities.length * 75);
      canvas.style.height = window.innerWidth <= 768 ? 
        `${newMobileHeight}px` : '500px';
      window.leaderboardChart.update();
    }
  });
  resizeObserver.observe(canvas);
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
