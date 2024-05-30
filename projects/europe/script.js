 // Your Mapbox access token
 mapboxgl.accessToken = 'pk.eyJ1IjoiaWZvcm1haGVyIiwiYSI6ImNsaHBjcnAwNDF0OGkzbnBzZmUxM2Q2bXgifQ.fIyIgSwq1WWVk9CKlXRXiQ';

 // Initialize the map with satellite imagery style

 // List of the 10 largest cities in the world with their coordinates, image URLs, and descriptions
 var cities = [
     { name: 'Nehalem Basin', coordinates: [-123.9303, 45.7195], imageUrl: 'pictures/nehalem.jpg', description: 'Tokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.', longDescription: 'The Upper Nehalem Watershed Council, in partnership with a similar organization in the lower watershed, aims to implement the Nehalem Strategic Action Plan to protect the endangered "evolutionary unit" of Coho salmon living along the coast of Oregon. As an intern working with them, I worked alongside environmentalists and other GIS professionals from state government agencies and non-profits to collect, analyze, and summarize data about the watershed- from things like forest characteristics, environmental variables, human interactions, and private timber sales. I created an organized database to allow the data to be utilized and updated by future salmon conservationists in the area. I also worked with the data to produce usable products, including dam models, site maps, and a web map showing the breakdown of watershed characteristics into sub-basins. I also worked with Terrain Works\' NetMap model, which is a set of water resource tools created for ArcMap.', title: 'Protecting Coho Salmon in the Nehalem Watershed', zoomLevel: 12 },
     { name: 'Tallahassee', coordinates: [-84.2807, 30.4383], imageUrl: 'pictures/ppgis.jpg', description: 'Delhi, India’s capital territory, is a massive metropolitan area in the country’s north.', longDescription: 'Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis.', title: 'Application Development for Public Input', zoomLevel: 12 },
     { name: 'Lake Oswego', coordinates: [-122.6706, 45.4207], imageUrl: 'pictures/lakeoswego.jpg', description: 'Shanghai, on China’s central coast, is the country’s biggest city and a global financial hub.', longDescription: 'In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna.', title: 'Oregon White Oaks in Lake Oswego', zoomLevel: 12 },
     { name: 'PCC Rock Creek', coordinates: [-122.8405, 45.5582], imageUrl: 'pictures/pccrockcreek.jpg', description: 'São Paulo, Brazil’s vibrant financial center, is among the world’s most populous cities, with numerous cultural institutions and a rich architectural tradition.', longDescription: 'Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', title: 'Drone Mapping of PCC Rock Creek Learning Garden', zoomLevel: 12 },
     { name: 'Northern Oregon Coast', coordinates: [-123.9625, 45.5231], imageUrl: 'pictures/5.jpg', description: 'Mumbai (formerly called Bombay) is a densely populated city on India’s west coast. A financial center, it\'s India\'s largest city.', longDescription: 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.', title: 'Wildlife Injuries in the North Coast', zoomLevel: 12 },
     { name: 'Monterey Bay', coordinates: [-121.8947, 36.6002], imageUrl: 'pictures/6.jpg', description: 'Beijing, China’s sprawling capital, has history stretching back 3 millennia. Yet it’s known as much for modern architecture as its ancient sites.', longDescription: 'Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.', title: 'Potential Dive Sites in the Monterey Bay Area', zoomLevel: 12 },
     { name: 'Chiricahua Mountains', coordinates: [-109.3425, 31.9452], imageUrl: 'pictures/7.jpg', description: 'Cairo, Egypt’s sprawling capital, is set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum.', longDescription: 'Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.', title: 'Fauntastic Chiricahua Mountains', zoomLevel: 12 },
     { name: 'Taiwan', coordinates: [120.9605, 23.6978], imageUrl: 'pictures/8.jpg', description: 'Dhaka, the capital of Bangladesh, is the country’s largest city. The city’s vibrant culture is reflected in its numerous festivals and lively street life.', longDescription: 'Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero.', title: 'Slowing Down the Inevitable', zoomLevel: 12 },
     { name: 'Europe', coordinates: [14.5058, 46.0569], imageUrl: 'pictures/9.jpg', description: 'Mexico City is the densely populated, high-altitude capital of Mexico. It’s known for its Templo Mayor, a 13th-century Aztec temple.', longDescription: 'Fusce a quam. Etiam ut purus mattis mauris sodales aliquam. Curabitur nisi.', title: 'European Security Alert Summary', zoomLevel: 12 },
     { name: 'Global', coordinates: [0, 0], imageUrl: 'pictures/10.jpg', description: 'Osaka is a large port city and commercial center on the Japanese island of Honshu. It’s known for modern architecture, nightlife, and hearty street food.', longDescription: 'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.', title: 'Global Trust in Health Infographic', zoomLevel: 2 }
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
         <p>${city.longDescription}</p>
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
