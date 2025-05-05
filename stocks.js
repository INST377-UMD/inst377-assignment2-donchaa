const apiKey = '2j9IpKKx5u83D3WSnrkRUOjiHpuCijXL'; // Replace with your actual Polygon.io API key
let chart;

function startListening() {
  if (annyang) {
    annyang.start();
  }
}

function stopListening() {
  if (annyang) {
    annyang.abort();
  }
}

if (annyang) {
  const commands = {
    'hello': () => alert('Hello World'),
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      page = page.toLowerCase();
      if (page === 'home') location.href = 'index.html';
      else if (page === 'stocks') location.href = 'stocks.html';
      else if (page === 'dogs') location.href = 'dogs.html';
    },
    'lookup *stock': (stock) => {
      document.getElementById('ticker').value = stock.toUpperCase();
      document.getElementById('range').value = '30';
      loadStockChart();
    }
  };
  annyang.addCommands(commands);
}

async function loadStockChart() {
  const ticker = document.getElementById('ticker').value.toUpperCase();
  const days = parseInt(document.getElementById('range').value);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const from = startDate.toISOString().split('T')[0];
  const to = endDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=100&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      alert("No data found for this ticker.");
      return;
    }

    const labels = data.results.map(point => new Date(point.t).toLocaleDateString());
    const values = data.results.map(point => point.c);

    if (chart) chart.destroy();

    const ctx = document.getElementById('stockChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${ticker} Closing Prices`,
          data: values,
          borderColor: 'blue',
          fill: false
        }]
      }
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching stock data.");
  }
}

async function loadRedditStocks() {
  const url = "https://tradestie.com/api/v1/apps/reddit?date=2022-04-03";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const table = document.querySelector("#redditStocks tbody");
    table.innerHTML = '';

    data.slice(0, 5).forEach(stock => {
      const row = document.createElement('tr');

      const link = document.createElement('a');
      link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
      link.target = "_blank";
      link.textContent = stock.ticker;

      const tickerCell = document.createElement('td');
      tickerCell.appendChild(link);

      const commentsCell = document.createElement('td');
      commentsCell.textContent = stock.no_of_comments;

      const sentimentCell = document.createElement('td');
      sentimentCell.innerHTML = stock.sentiment === 'Bullish'
        ? '📈 Bullish' : '📉 Bearish';

      row.appendChild(tickerCell);
      row.appendChild(commentsCell);
      row.appendChild(sentimentCell);
      table.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load Reddit stocks.");
  }
}

document.addEventListener('DOMContentLoaded', loadRedditStocks);
