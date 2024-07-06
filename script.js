// public token
mapboxgl.accessToken = 'pk.eyJ1IjoiaWZvcm1haGVyIiwiYSI6ImNsaHBjcnAwNDF0OGkzbnBzZmUxM2Q2bXgifQ.fIyIgSwq1WWVk9CKlXRXiQ';


// List of project locations with basic information
var cities = [
 { name: 'Nehalem Basin', coordinates: [-123.56341, 45.84511], imageUrl: 'https://yahnjr.github.io/map-portfolio/pictures/nehalem.png', description: 'Efforts to protect and restore Coho Salmon habitat in the Coast Range.', title: 'Protecting Coho Salmon in the Nehalem Watershed', zoomLevel: 10, link: 'projects/nehalem' },
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

var map2 = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    center: [0, 20], 
    zoom: 1.5 
});

// Function to create boxes for projects. called "city boxes" due to early build focus on cities.
function createCityBoxSection2(city, index, sidebarId, mapInstance) {
    var cityBox = document.createElement('div');
    cityBox.className = 'city-box';
    cityBox.setAttribute('name', city.name); 
    cityBox.innerHTML = `
        <h3>${city.title}</h3>
        <a href = "${city.link}"> <img src="${city.imageUrl}" alt="${city.name}"> </a>
        <p>${city.description}</p>
    `;
    cityBox.addEventListener('click', function() {
        mapInstance.flyTo({
            center: city.coordinates,
            zoom: city.zoomLevel, // Use the zoomLevel attribute for each project based on extent
            essential: true 
        });

    });
    document.getElementById(sidebarId).appendChild(cityBox);
}

// Add project points to the map and created boxes for projects
cities.forEach(function(city, index) {
 // Create a map pin for project
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
   scrollToCityBox(city.name, 'sidebar2'); // Pass city name and sidebar ID

 });

 createCityBoxSection2(city, index, 'sidebar2', map2);
});


// Function to scroll to the city box with a given index in a sidebar with a specific ID when marker is clicked

function logCityBoxPositions(sidebarId) {
  var sidebar = document.getElementById(sidebarId);
  var cityBoxes = sidebar.getElementsByClassName('city-box');
  
  console.log("Sidebar scrollTop:", sidebar.scrollTop);
  console.log("Sidebar clientHeight:", sidebar.clientHeight);
  console.log("Sidebar scrollHeight:", sidebar.scrollHeight);

  for (var i = 0; i < cityBoxes.length; i++) {
    var box = cityBoxes[i];
    console.log("Box " + i + " (" + box.getAttribute('name') + "):");
    console.log("  offsetTop:", box.offsetTop);
    console.log("  clientHeight:", box.clientHeight);
    console.log("  Total height (including margin):", box.clientHeight + 120);
    console.log("  getBoundingClientRect():", box.getBoundingClientRect());
  }
}

function scrollToCityBox(cityName, sidebarId) {
  var sidebar = document.getElementById(sidebarId);
  var cityBoxes = sidebar.getElementsByClassName('city-box');
  var targetIndex = -1;

  for (var i = 0; i < cityBoxes.length; i++) {
    if (cityBoxes[i].getAttribute('name') === cityName) {
      targetIndex = i;
      break;
    }
  }

  if (targetIndex !== -1) {
    var positions = [237, 859, 1481, 2103, 2725, 3347, 3969, 4591, 5213, 5835];
    var targetScrollTop = positions[targetIndex];
    
    var sidebarHeight = sidebar.clientHeight;
    var boxHeight = 500;

    targetScrollTop = Math.max(0, targetScrollTop - 237); // offset equal to the top box

    console.log("Target Index:", targetIndex);
    console.log("Target Scroll Top:", targetScrollTop);
    console.log("Current Scroll Top:", sidebar.scrollTop);

    // Try native smooth scrolling first
    if ('scrollBehavior' in document.documentElement.style) {
      sidebar.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    } else {
      // Fall back to JavaScript animation
      smoothScrollTo(sidebar, targetScrollTop, 500); // 500ms duration
    }
  } else {
    console.warn("City box not found for name:", cityName);
  }
}

function smoothScrollTo(element, targetScrollTop, duration) {
  var start = element.scrollTop;
  var change = targetScrollTop - start;
  var startTime = performance.now();

  function animateScroll(currentTime) {
    var elapsedTime = currentTime - startTime;
    var progress = Math.min(elapsedTime / duration, 1);
    var easeProgress = easeInOutCubic(progress);
    element.scrollTop = start + change * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Add scroll event listener to sidebar2 to update map center based on the top visible project box
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