"use strict";

const fetchCityDetails = async () => {
    const cityId = sessionStorage.getItem("selectedCityId");

    if (!cityId) {
        document.getElementById('cityDetails').innerHTML = "<p>No city selected.</p>";
        return;
    }

    try {
        const response = await fetch(`/api/cities/${cityId}`);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const city = await response.json();

        // Display city details in the table
        document.getElementById('city-name').innerText = city.city;
        document.getElementById('city-country').innerText = city.country;

        // Store city details in session storage for later use
        sessionStorage.setItem('cityId', city.id);

    } catch (error) {
        document.getElementById('cityDetails').innerHTML = `<p>Error loading city details: ${error.message}</p>`;
    }
};

const editButton = document.getElementById('button-edit');
const saveButton = document.getElementById('button-save');

const switchMode = () => {
    const cityColumn = document.getElementById('city-name');
    const countryColumn = document.getElementById('city-country');

    const cityInput = document.createElement('input');
    cityInput.id = 'name-input';
    cityInput.setAttribute('value', cityColumn.innerText);
    cityInput.setAttribute('name', 'city');
    cityColumn.innerText = "";

    const countryInput = document.createElement('input');
    countryInput.id = 'country-input';
    countryInput.setAttribute('value', countryColumn.innerText);
    countryInput.setAttribute('name', 'country');
    countryColumn.innerText = "";

    cityColumn.appendChild(cityInput);
    countryColumn.appendChild(countryInput);

    document.getElementById('button-edit').style.display = 'none';
    saveButton.style.display = 'block';
    saveButton.onclick = () => {
        updateCity();
    }
};

const updateCity = async () => {
    const cityColumn = document.getElementById('city-name');
    const countryColumn = document.getElementById('city-country');
    const city = {
        id: sessionStorage.getItem('cityId'),
        city: document.getElementById('name-input').value,
        country: document.getElementById('country-input').value
    }
    try {
        const response = await fetch('http://localhost:5000/api/cities', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(city)
        });
        const data = await response.json();
        if (response.status == 200) {
            cityColumn.innerText = data.city;
            countryColumn.innerText = data.country;
            saveButton.style.display = 'none';
            editButton.style.display = 'inline';
        }
    } catch (error) {
        console.log(error);
    }
};

// Load city details when the page loads
window.onload = () => {
    fetchCityDetails();
    editButton.onclick = () => {
        switchMode();
    };
};
