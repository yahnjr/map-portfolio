 // Your Mapbox access token
 mapboxgl.accessToken = 'pk.eyJ1IjoiaWZvcm1haGVyIiwiYSI6ImNsaHBjcnAwNDF0OGkzbnBzZmUxM2Q2bXgifQ.fIyIgSwq1WWVk9CKlXRXiQ';

 // Initialize the map with satellite imagery style

 // List of the 10 largest cities in the world with their coordinates, image URLs, and descriptions
 var cities = [
  { name: 'Nehalem Basin', coordinates: [-123.9303, 45.7195], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/nehalem.jpg', description: 'Tokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.', title: 'Protecting Coho Salmon in the Nehalem Watershed', zoomLevel: 12 },
  { name: 'Tallahassee', coordinates: [-84.2807, 30.4383], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/ppgis.jpg', description: 'Delhi, India’s capital territory, is a massive metropolitan area in the country’s north.', title: 'Application Development for Public Input', zoomLevel: 12 },
  { name: 'Lake Oswego', coordinates: [-122.6706, 45.4207], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/lakeoswego.jpg', description: 'Shanghai, on China’s central coast, is the country’s biggest city and a global financial hub.', title: 'Oregon White Oaks in Lake Oswego', zoomLevel: 12 },
  { name: 'PCC Rock Creek', coordinates: [-122.8405, 45.5582], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/pccrockcreek.jpg', description: 'São Paulo, Brazil’s vibrant financial center, is among the world’s most populous cities, with numerous cultural institutions and a rich architectural tradition.', title: 'Drone Mapping of PCC Rock Creek Learning Garden', zoomLevel: 12 },
  { name: 'Northern Oregon Coast', coordinates: [-123.9625, 45.5231], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/5.jpg', description: 'Mumbai (formerly called Bombay) is a densely populated city on India’s west coast. A financial center, it\'s India\'s largest city.', title: 'Wildlife Injuries in the North Coast', zoomLevel: 12 },
  { name: 'Monterey Bay', coordinates: [-121.8947, 36.6002], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/6.jpg', description: 'Beijing, China’s sprawling capital, has history stretching back 3 millennia. Yet it’s known as much for modern architecture as its ancient sites.', title: 'Potential Dive Sites in the Monterey Bay Area', zoomLevel: 12 },
  { name: 'Chiricahua Mountains', coordinates: [-109.3425, 31.9452], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/7.jpg', description: 'Cairo, Egypt’s sprawling capital, is set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum.', title: 'Fauntastic Chiricahua Mountains', zoomLevel: 12 },
  { name: 'Taiwan', coordinates: [120.9605, 23.6978], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/8.jpg', description: 'Dhaka, the capital of Bangladesh, is the country’s largest city. The city’s vibrant culture is reflected in its numerous festivals and lively street life.', title: 'Slowing Down the Inevitable', zoomLevel: 12 },
  { name: 'Europe', coordinates: [14.5058, 46.0569], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/europe.jpg', description: 'Mexico City is the densely populated, high-altitude capital of Mexico. It’s known for its Templo Mayor, a 13th-century Aztec temple.', title: 'European Security Alert Summary', zoomLevel: 12 },
  { name: 'Global', coordinates: [0, 0], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/10.jpg', description: 'Osaka is a large port city and commercial center on the Japanese island of Honshu. It’s known for modern architecture, nightlife, and hearty street food.', title: 'Global Trust in Health Infographic', zoomLevel: 2 }
];

 // Add city points to the map and create city boxes for Section 1

// Initialize the second map with satellite imagery style
 var map2 = new mapboxgl.Map({
     container: 'map2',
     style: 'mapbox://styles/mapbox/satellite-streets-v11', // Changed to satellite map with labels
     center: [0, 20], // Starting position [lng, lat]
     zoom: 1.5 // Starting zoom level
 });

 // Function to create city box elements for Section 2
 function createCityBoxSection2(city, index, sidebarId, mapInstance) {
     var cityBox = document.createElement('div');
     cityBox.className = 'city-box';
     cityBox.innerHTML = `
         <h3>${city.title}</h3>
         <img src="${city.imageUrl}" alt="${city.name}">
         <p>${city.description}</p>
     `;
     cityBox.addEventListener('click', function() {
         mapInstance.flyTo({
             center: city.coordinates,
             zoom: city.zoomLevel, // Use the zoomLevel attribute from the city variable
             essential: true // This animation is considered essential with respect to prefers-reduced-motion
         });
         if (window.currentPopup) { // Close previous popup if it exists
             window.currentPopup.remove();
         }
         var popup = new mapboxgl.Popup({ offset: 25, maxWidth: '300px' })
             .setLngLat(city.coordinates)
             .setHTML(
                 '<div style="text-align:center;">' +
                 '<h3>' + city.name + '</h3>' +
                 '<p>' + city.description + '</p>' +
                 '</div>'
             )
             .addTo(mapInstance);
         window.currentPopup = popup; // Store reference to the current popup
         highlightCityBox(cityBox);
     });
     document.getElementById(sidebarId).appendChild(cityBox);
 }

 // Add city points to the second map and create city boxes for Section 2
 cities.forEach(function(city, index) {
  // Create a marker for each city
  var marker = new mapboxgl.Marker()
      .setLngLat(city.coordinates)
      .addTo(map2);

  // Attach click event to each marker
  marker.getElement().addEventListener('click', function() {
    map2.flyTo({
      center: city.coordinates,
      zoom: 10,
      essential: true // This animation is considered essential with respect to prefers-reduced-motion
    });
    if (window.currentPopup) { // Close previous popup if it exists
      window.currentPopup.remove();
    }
    var popup = new mapboxgl.Popup({ offset: 25, maxWidth: '300px' })
      .setLngLat(city.coordinates)
      .setHTML(
        '<div style="text-align:center;">' +
          '<h3>' + city.name + '</h3>' +
          '<p>' + city.description + '</p>' +
        '</div>'
      )
      .addTo(map2);
    window.currentPopup = popup; // Store reference to the current popup

    // Scroll to the corresponding city box (function call)
    scrollToCityBox(index, 'sidebar2');

    // Highlight the corresponding city box (function call)
    highlightCityBox(document.querySelectorAll('.city-box')[index], 'dullTeal');
  });

  // Create a city box for Section 2 (function call)
  createCityBoxSection2(city, index, 'sidebar2', map2);
});

// Function to scroll to the city box with a given index in a sidebar with a specific ID
function scrollToCityBox(index, sidebarId) {
  // ... (implementation of scrollToCityBox logic)
}

// Function to highlight city box with a specific color (already defined above)
function highlightCityBox(cityBoxElement, highlightColor) {
  // ... (implementation of highlightCityBox logic)
}

 // Add scroll event listener to sidebar2 to update map center based on the top visible city box
 document.getElementById('sidebar2').addEventListener('scroll', function() {
     var sidebar = this;
     var cityBoxes = sidebar.getElementsByClassName('city-box');
     var mapCenterIndex = 0;
     var minDistance = Number.MAX_VALUE;

     for (var i = 0; i < cityBoxes.length; i++) {
         var box = cityBoxes[i];
         var boxRect = box.getBoundingClientRect();
         var sidebarRect = sidebar.getBoundingClientRect();
         var distance = Math.abs(boxRect.top - sidebarRect.top);

         if (distance < minDistance) {
             minDistance = distance;
             mapCenterIndex = i;
         }
     }

     var targetCity = cities[mapCenterIndex];
     map2.flyTo({
         center: targetCity.coordinates,
         zoom: 10,
         essential: true
     });
 });
