const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
// app.use(cors());
const PORT = 5000;

app.use(express.static(path.join(__dirname, '../frontend')));

const CITIES = [
    {
        id: 1,
        city: 'Oslo',
        country: 'Norway'
    },
    {
        id: 2,
        city: 'Paris',
        country: 'France',
    },
    {
        id: 3,
        city: 'Pretoria',
        country: 'South Africa',
    },
];

app.get('/api/', (req, res) => {
    res.send('👋 Hello Backend API 👋');
});

app.listen(PORT, () => {
    console.log(`BACKEND SERVER LISTENING ON PORT ${PORT}`);
});

app.get('/api/cities/', (req, res) => {
    res.status(200).send(CITIES);
});


app.get('/api/cities/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const city = CITIES.find(item => {
        return item.id === id;
    });

    if (!city) {
        res.status(404).send({ message: 'City not found' });
    }

    console.log(city);
    res.status(200).send(city);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


app.post('/api/cities/', (req, res) => {
    console.log(req.body)

    const city = {
        id: CITIES.length + 1,
        city: req.body.city,
        country: req.body.country,
    };

    CITIES.push(city);
    res.send(city);
});


app.delete('/api/cities/:id', (req, res) => {
    const cityId = parseInt(req.params.id, 10); // Get the city ID from the URL parameter
    const cityIndex = CITIES.findIndex(city => city.id === cityId); // Find the index of the city

    if (cityIndex === -1) {
        return res.status(404).json({ message: "City not found" }); // City not found
    }

    CITIES.splice(cityIndex, 1); // Remove the city from the array
    res.status(200).json({ message: "City deleted successfully" });
});


app.put('/api/cities/', (req, res) => {
    console.log(req.body)
    const id = parseInt(req.body.id);

    const cityIndex = CITIES.findIndex(item => item.id === id);
    if (cityIndex === -1) {
        res.status(404).send('City not found, can not update');
        return;
    }

    const updatedCity = CITIES.find(item => item.id === id);
    updatedCity.city = req.body.city;
    updatedCity.country = req.body.country;

    CITIES[cityIndex] = updatedCity;
    res.send(updatedCity);

});