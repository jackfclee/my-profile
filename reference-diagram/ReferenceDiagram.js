function doInit() {
  fetchJsonData('images/_assets.json');
}

// Function to fetch JSON data from URL
function fetchJsonData(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      initDropdown(jsonData);
      // Store jsonData globally if needed for further use
      window.jsonData = jsonData;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// Function to initialize the dropdown with categories
function initDropdown(jsonData) {
  const dropdown = document.getElementById('topicDropdown');
  jsonData.forEach(topic => {
    let option = document.createElement('option');
    option.value = topic.topic;
    option.textContent = topic.displayName || topic.topic;
    dropdown.appendChild(option);
  });
}

// Function to display images based on the selected topic
function displayImages() {
  const selectedtopic = document.getElementById('topicDropdown').value;
  const display = document.getElementById('imageDisplay');
  display.innerHTML = ''; // Clear previous images

  const topic = jsonData.find(cat => cat.topic === selectedtopic);
  if (topic?.references) {
    topic.references.forEach(ref => {
      let img = document.createElement('img');
      img.src = 'images/' + topic.topic + "/" + ref.file; // Assuming the file path is correct
      img.alt = ref.displayName || ref.file;
      let p = document.createElement('p');
      p.innerText = ref.displayName || ref.file;
      p.className = "sub-banner";
      display.appendChild(p);
      display.appendChild(img);
    });
  }
}