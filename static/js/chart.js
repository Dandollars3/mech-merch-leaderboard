document.addEventListener("DOMContentLoaded", () => {
  loadChartData();

  // Refresh button event
  document.getElementById("refreshBtn").addEventListener("click", () => {
    const btn = document.getElementById("refreshBtn");
    btn.disabled = true;
    btn.innerHTML = "<svg...> Refreshing...";
    loadChartData();
  });

  // Community card interactions
  document.querySelectorAll(".comm-card").forEach((card) => {
    card.addEventListener("click", function () {
      const community = this.querySelector("p").textContent;
      highlightCommunity(community);
    });
  });
});

async function loadChartData() {
  try {
    const response = await fetch("http://localhost:5000/leaderboard");
    const data = await response.json();
    renderChart(data);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    const btn = document.getElementById("refreshBtn");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = "<svg...> Refresh Data";
    }
  }
}

function renderChart(data) {
  const isMobile = window.innerWidth <= 768;
  const canvas = document.getElementById("leaderboardChart");
  const ctx = canvas.getContext("2d");

  // Destroy existing chart
  if (window.leaderboardChart) {
    window.leaderboardChart.destroy();
  }

  window.leaderboardChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.communities,
      datasets: [
        {
          label: "Number of Purchases",
          data: data.purchases,
          backgroundColor: data.colors || [
            "#1b1b1b",
            "#246c9d",
            "#2f3750",
            "#237623",
            "#616977",
          ],
          borderRadius: 10,
          barThickness: isMobile ? 18 : 40,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      layout: {
        padding: isMobile
          ? {
              left: 5,
              right: 5,
              top: 5,
              bottom: 5,
            }
          : {
              left: 15,
              right: 15,
              top: 10,
              bottom: 10,
            },
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
        delay: (context) => context.dataIndex * 200,
        onComplete: () => console.log("Animation complete!"),
        animateScale: true,
        animateRotate: true,
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            font: {
              size: isMobile ? 10 : 14,
            },
            count: isMobile ? 4 : 10,
          },
          grid: { display: false },
        },
        y: {
          ticks: {
            font: {
              // Reduced font size for community names on mobile
              size: isMobile ? 10 : 16,
              weight: "bold",
            },
            autoSkip: false,
            // Reduced padding to give more chart space
            padding: isMobile ? 4 : 8,
          },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Community Purchases Leaderboard",
          font: {
            size: isMobile ? 14 : 20,
            weight: "bold",
          },
          padding: { top: 5, bottom: isMobile ? 10 : 20 },
        },
        tooltip: {
          enabled: !isMobile,
        },
      },
    },
  });

  // No resize observer - CSS handles this now
}

// Debounce function to prevent too many resize events
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}

function highlightCommunity(community) {
  document.querySelectorAll(".comm-card").forEach((card) => {
    card.style.border = "none";
  });

  const card = [...document.querySelectorAll(".comm-card")].find(
    (c) => c.querySelector("p").textContent === community
  );

  if (card) {
    card.style.border = "3px solid #EF7F36";
    card.style.borderRadius = "12px";
  }
}
