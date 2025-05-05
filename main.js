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
        if (page === 'home') window.location.href = 'index.html';
        else if (page === 'stocks') window.location.href = 'stocks.html';
        else if (page === 'dogs') window.location.href = 'dogs.html';
      }
    };
  
    annyang.addCommands(commands);
  }
  
  async function fetchQuote() {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      const quoteBox = document.getElementById('quoteBox');
      quoteBox.textContent = `"${data.content}" - ${data.author}`;
    } catch (error) {
      console.error('Failed to fetch quote', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', fetchQuote);
  