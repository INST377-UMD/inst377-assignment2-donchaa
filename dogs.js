// Load 10 random dog images into the carousel
async function loadRandomDogs() {
    const carousel = document.getElementById('dogCarousel');
    const images = [];
  
    for (let i = 0; i < 10; i++) {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await res.json();
      const img = document.createElement('img');
      img.src = data.message;
      images.push(img);
    }
  
    images.forEach(img => carousel.appendChild(img));
  
    simpleslider.getSlider({
      container: carousel,
      pause: 3,
      transitionTime: 0.5,
      delay: 3
    });
  }
  
  // Fetch dog breeds and create buttons
  async function loadBreeds() {
    const res = await fetch('https://dogapi.dog/api/v2/breeds');
    const data = await res.json();
    const buttonContainer = document.getElementById('breedButtons');
  
    data.data.forEach(breed => {
      const btn = document.createElement('button');
      btn.textContent = breed.attributes.name;
      btn.classList.add('custom-btn');
      btn.setAttribute('data-id', breed.id);
      btn.addEventListener('click', () => showBreedInfo(breed));
      buttonContainer.appendChild(btn);
    });
  }
  
  // Show breed info in a container
  function showBreedInfo(breed) {
    const infoBox = document.getElementById('breedInfo');
    infoBox.innerHTML = `
      <h3>${breed.attributes.name}</h3>
      <p>${breed.attributes.description || "No description available."}</p>
      <p><strong>Min Life Expectancy:</strong> ${breed.attributes.life.min} years</p>
      <p><strong>Max Life Expectancy:</strong> ${breed.attributes.life.max} years</p>
    `;
    infoBox.style.display = 'block';
  }
  
  // Add voice command for loading breed
  if (annyang) {
    const commands = {
      'load dog breed *breed': async function(breedName) {
        const res = await fetch('https://dogapi.dog/api/v2/breeds');
        const data = await res.json();
        const breed = data.data.find(b => b.attributes.name.toLowerCase() === breedName.toLowerCase());
        if (breed) {
          showBreedInfo(breed);
        }
      }
    };
    annyang.addCommands(commands);
    annyang.start();
  }
  
  window.onload = () => {
    loadRandomDogs();
    loadBreeds();
  };
  