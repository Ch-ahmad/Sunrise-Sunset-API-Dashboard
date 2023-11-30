// JS

document.addEventListener('DOMContentLoaded', () => {
    const currentLocationButton = document.getElementById('current-location');
    const predefinedLocationsSelect = document.getElementById('predefined-locations');

    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchDataFromCoordinates, showError);
        } else {
            showError('Geolocation is not supported by this browser.');
        }
    });

    predefinedLocationsSelect.addEventListener('change', () => {
        const selectedCity = predefinedLocationsSelect.value;
        if (selectedCity) {
            const cities = {
                chicago: { lat: 41.8781, lng: -87.6298 },
                washington: { lat: 38.9072, lng: -77.0369 },
                los_angeles: { lat: 34.0522, lng: -118.2437 },
                las_vegas: { lat: 36.1699, lng: -115.1398 },
                miami: { lat: 25.7617, lng: -80.1918 }
            };
            const { lat, lng } = cities[selectedCity];
            fetchDataFromCoordinates({ coords: { latitude: lat, longitude: lng } });
        }
    });
});

function fetchDataFromCoordinates(position) {
    const { latitude, longitude } = position.coords;
    const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

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
    displayData('today', data);
    displayData('tomorrow', data);
}

function displayData(day, data) {
    document.getElementById(`${day}-sunrise`).textContent = formatTime(data.sunrise);
    document.getElementById(`${day}-sunset`).textContent = formatTime(data.sunset);
    document.getElementById(`${day}-dawn`).textContent = formatTime(data.civil_twilight_begin);
    document.getElementById(`${day}-dusk`).textContent = formatTime(data.civil_twilight_end);
    document.getElementById(`${day}-daylength`).textContent = data.day_length;
    document.getElementById(`${day}-solarnoon`).textContent = formatTime(data.solar_noon);
    document.getElementById(`${day}-timezone`).textContent = "UTC"; // Assuming UTC timezone
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString();
}

function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    clearDataDisplay();
}

function clearDataDisplay() {
    const elementsToClear = ['sunrise', 'sunset', 'dawn', 'dusk', 'daylength', 'solarnoon', 'timezone'];
    elementsToClear.forEach(element => {
        document.getElementById(`today-${element}`).textContent = '--:--';
        document.getElementById(`tomorrow-${element}`).textContent = '--:--';
    });
}
