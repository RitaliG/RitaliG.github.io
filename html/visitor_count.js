 // Initialize the visitor coordinates
 var visitorCoordinates = [ ];
 var visitor_IP = '';
 const serverAddress  = 'https://ritali.pythonanywhere.com/api/coordinates'
 const serverfetchLoc = 'https://ritali.pythonanywhere.com/api/geo-location'
 // const serverAddress  = 'http://localhost:5000/api/coordinates'
 // const serverfetchLoc = 'http://localhost:5000/api/geo-location'

 // Initialize the map
 var map = L.map('map').setView([-0, 23], 0.2); /* latitude and longitude adjustment for center of the map */

 // Add a tile layer
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '© OpenStreetMap contributors'
 }).addTo(map);

 // Function to load markers on the map
 function loadMarkers(coord) {
     L.marker(coord).addTo(map);
 }

 // Function to fetch initial coordinates from the server
 function fetchInitialCoordinates() {
     fetch(serverAddress)
         .then(response => response.json())
         .then(data => {
             for (var i = 0; i < data.length; i++) {
                 visitorCoordinates.push(data[i]);
                 loadMarkers(visitorCoordinates[i]);
             }
             document.getElementById('visitorCount').textContent = visitorCoordinates.length;
             fetchGeoLocation();  // Get new geolocation and update server after initial fetch
         })
         .catch(error => {
             console.error('Error fetching initial coordinates:', error);
         });
     fetchIP(); // fetch the visitor ip
 }
 
 // Function to get IP address of visitor
 function fetchIP() {
     fetch('https://api.ipify.org?format=json')
         .then(response => response.json())
         .then(data => {
             visitor_IP = data.ip;
         })
         .catch(error => {
             console.error('Error fetching the API:', error);
     });
 }

 // Function to get geolocation and send to the server
 function fetchGeoLocation() {
 fetch(serverfetchLoc, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ip: visitor_IP })
     })
     .then(response => response.json())
     .then(data => {
             if(data.status === 'success') {
                 var newCoord = [data.lat, data.lon];
                 sendCoordinatesToServer(newCoord, data.org, data.city);
             } else {
                 console.error("Failed to fetch geolocation: " + data.message);
             }
         })
         .catch(error => {
             console.error('Error fetching the API:', error);
         });
 }

 // Function to send coordinates to the server
 function sendCoordinatesToServer(newCoord, org, city) {
     fetch(serverAddress, {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ coordinates: newCoord,
                                                  ip: visitor_IP,
                                                  org: org,
                                                  city: city
                                                })
     })
     .then(response => response.json())
     .then(data => {
         console.log('Success:', data);
         // Re-fetch all coordinates including the new one to update the map
         fetch(serverAddress)
 .then(response => response.json())
 .then(data => {
             for (var i = 0; i < data.length; i++) {
                 if (i>visitorCoordinates.length-1) {
                     visitorCoordinates.push(data[i]);
                 }
                 loadMarkers(visitorCoordinates[i]);
             }
             document.getElementById('visitorCount').textContent = visitorCoordinates.length;
     })
     .catch(error => {
             console.error('Error re-fetching updated coordinates:', error);
     });
     })
     .catch(error => {
         console.error('Error sending coordinates:', error);
     });
 }

 // On page load, fetch initial coordinates
 window.onload = function() {
     fetchInitialCoordinates();
 };