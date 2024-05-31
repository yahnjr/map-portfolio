 // Your Mapbox access token
 mapboxgl.accessToken = 'pk.eyJ1IjoiaWZvcm1haGVyIiwiYSI6ImNsaHBjcnAwNDF0OGkzbnBzZmUxM2Q2bXgifQ.fIyIgSwq1WWVk9CKlXRXiQ';

 // Initialize the map with satellite imagery style

 // List of the 10 largest cities in the world with their coordinates, image URLs, and descriptions
 var cities = [
  { name: 'Nehalem Basin', coordinates: [-123.56341, 45.84511], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/nehalem.png', description: 'Efforts to protect and restore Coho Salmon habitat in the Coast Range. Click picture to read more.', title: 'Protecting Coho Salmon in the Nehalem Watershed', zoomLevel: 10, link: 'projects/nehalem' },
  { name: 'Tallahassee', coordinates: [-84.2807, 30.4383], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/ppgis.png', description: 'Designing straight-forward apps for the collection of public input.', title: 'Application Development for Public Input', zoomLevel: 12, link: 'projects/ppgis' },
  { name: 'Lake Oswego', coordinates: [-122.69132, 45.41107], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/lakeo.png', description: 'A look at Oregon white oaks, a keystone species, in the area.', title: 'Oregon White Oaks in Lake Oswego', zoomLevel: 13, link: 'projects/lakeoswego' },
  { name: 'PCC Rock Creek', coordinates: [-122.85989, 45.56512], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/rockcreek.jpg', description: 'A drone mapping workflow from start to finish.', title: 'Drone Mapping of PCC Rock Creek Learning Garden', zoomLevel: 18, link: 'projects/pccrockcreek' },
  { name: 'Northern Oregon Coast', coordinates: [-123.85823, 46.14208], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/northcoast.jpg', description: 'Looking for ways to quantify and reduce wildlife injuries in the Norther Oregon coast. ', title: 'Wildlife Injuries in the North Coast', zoomLevel: 9, link: 'projects/northcoast' },
  { name: 'Monterey Bay', coordinates: [-121.90715, 36.79893], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/monterey.jpg', description: 'Spatial analysis to determine potential dive sites in the Monterey Bay area in central California.', title: 'Potential Dive Sites in the Monterey Bay Area', zoomLevel: 9, link: 'projects/monterey' },
  { name: 'Chiricahua Mountains', coordinates: [-109.3425, 31.9452], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/chiricahuas.jpg', description: 'A map showcasing the fascinating biodiversity of the Chiricahua Mountains in Arizona.', title: 'Fauntastic Chiricahua Mountains', zoomLevel: 9, link: 'projects/chiricahuas' },
  { name: 'Taiwan', coordinates: [120.9605, 23.6978], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/taiwan.png', description: 'An analysis of changing temperatures in Taiwan and the role of environmental factors in this change. Presented at GIS in Action 2022. .', title: 'Slowing Down the Inevitable', zoomLevel: 7, link: 'projects/taiwan' },
  { name: 'Europe', coordinates: [12.98111, 49.01730], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/europe.jpg', description: 'A map utilizing data obtained in my work as an Intelligence Analyst. A summary of major security incidents over the first 5 months of 2023.', title: 'European Security Alert Summary', zoomLevel: 4, link: 'projects/europe' },
  { name: 'Global', coordinates: [0, 0], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/world.jpg', description: 'Infographic exploring the Wellcome Global Monitor\'s poll data on trust in science and medical institutions.', title: 'Global Trust in Health Infographic', zoomLevel: 2, link: 'projects/world' }
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
         <p>${city.description}</p>
     `;
     cityBox.addEventListener('click', function() {
         mapInstance.flyTo({
             center: city.coordinates,
             zoom: city.zoomLevel, // Use the zoomLevel attribute from the city variable
             essential: true
         });

         setTimeout(function() {
            window.location.href = "../../" + city.link;
          }, 2000); // Delay for 3 seconds to watch zoom animation

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
      essential: true 
    });


    // Scroll to the corresponding city box (function call)
    scrollToCityBox(index, 'sidebar2');
  });

  // Create a city box for Section 2 (function call)
  createCityBoxSection2(city, index, 'sidebar2', map2);
});

// Function to scroll to the city box with a given index in a sidebar with a specific ID
function scrollToCityBox(index, sidebarId) {
  // ... (implementation of scrollToCityBox logic)
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
         zoom: targetCity.zoomLevel,
         essential: true
     });
 });
