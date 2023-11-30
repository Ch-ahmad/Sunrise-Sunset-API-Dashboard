document.addEventListener('DOMContentLoaded', () => {
    const currentLocationButton = document.getElementById('current-location');
    const predefinedLocationsSelect = document.getElementById('predefined-locations');

    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchSunriseSunsetInfo(latitude, longitude);
            }, showError);
        } else {
            showError('Geolocation is not supported by this browser.');
        }
    });

    predefinedLocationsSelect.addEventListener('change', () => {
        const selectedCity = predefinedLocationsSelect.value;
        if (selectedCity) {
            // Define the latitude and longitude for each city
            const cities = {
                chicago: { lat: 41.8781, lng: -87.6298 },
                washington: { lat: 38.9072, lng: -77.0369 },
                los_angeles: { lat: 34.0522, lng: -118.2437 },
                las_vegas: { lat: 36.1699, lng: -115.1398 },
                miami: { lat: 25.7617, lng: -80.1918 }
            };
            const { lat, lng } = cities[selectedCity];
            fetchSunriseSunsetInfo(lat, lng);
        }
    });
});

function fetchSunriseSunsetInfo(lat, lng) {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                updateDisplay(data.results);
            } else {
                showError('Unable to fetch sunrise and sunset times.');
            }
        })
        .catch(error => {
            showError('Error: ' + error.message);
        });
}

function updateDisplay(data) {
    // Update your HTML elements with the data
    document.getElementById('today-sunrise').textContent = new Date(data.sunrise).toLocaleTimeString();
    document.getElementById('today-sunset').textContent = new Date(data.sunset).toLocaleTimeString();
    // Add more fields as needed
}

function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
}
