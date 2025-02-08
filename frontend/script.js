"use strict";

const fetchCities = async () => {
  try {
    const response = await fetch('/api/cities');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const cities = await response.json();
    console.log("Cities fetched:", cities);
    populateTable(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
};

function populateTable(cities) {
  const tableBody = document.querySelector('#citiesTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  cities.forEach(city => {
    const row = document.createElement('tr');

    // Clickable ID
    const idCell = document.createElement('td');
    const idLink = document.createElement('a');
    idLink.href = "city.html";
    idLink.textContent = city.id;
    idLink.onclick = () => {
      sessionStorage.setItem("selectedCityId", city.id);
    };
    idCell.appendChild(idLink);
    row.appendChild(idCell);

    // City Name
    const cityCell = document.createElement('td');
    cityCell.textContent = city.city;
    row.appendChild(cityCell);

    // Country Name
    const countryCell = document.createElement('td');
    countryCell.textContent = city.country;
    row.appendChild(countryCell);

    // Delete Button Column
    const deleteColumn = document.createElement('td');
    deleteColumn.className = 'column-delete';
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "❌";
    deleteButton.style.cursor = "pointer";
    deleteButton.onclick = () => {
        deleteCity(city.id);
    };
    deleteColumn.appendChild(deleteButton);
    row.appendChild(deleteColumn);

    tableBody.appendChild(row);
  });
}

// Fetch cities when the page loads
fetchCities();


const form = document.getElementById('city-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = {
    city: form.elements['city'].value,
    country: form.elements['country'].value
  }
  // Call the function the does the backend request
  addCity(city);

  // Clear the current values
  form.elements['city'].value = "";
  form.elements['country'].value = "";
});


const addCity = async (city) => {
  try {
    const response = await fetch('http://localhost:5000/api/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(city)
    });

    // Check if the response succeeded
    if (response.status == 200) {
      // Refresh the list from the backend
      fetchCities();
    }
  } catch (error) {
    console.log(error);
  }
};



const deleteCity = async (id) => {
  try {
    const response = await fetch('http://localhost:5000/api/cities/' + id,{
      method: 'DELETE'
    });

    // Check if the response succeeded
    if(response.status == 200) {
      // Refresh the list from the backend
      fetchCities();
    }
  } catch (error) {
    console.log(error);
  }
};