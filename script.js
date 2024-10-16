// public token
mapboxgl.accessToken = 'pk.eyJ1IjoiaWZvcm1haGVyIiwiYSI6ImNsaHBjcnAwNDF0OGkzbnBzZmUxM2Q2bXgifQ.fIyIgSwq1WWVk9CKlXRXiQ';

var map2 = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/mapbox/satellite-v9',
    projection: 'globe', 
    zoom: 1.5,
    center: [-90, 40]
});

map2.on('style.load', () => {
  map2.setFog({
    color: 'rgb(255, 240, 240)', // Lower atmosphere
    'high-color': 'rgb(200, 255, 255)', // Upper atmosphere
    'horizon-blend': 0.01, // Atmosphere thickness (default 0.2 at low zooms)
    'space-color': 'rgb(0, 0, 0)', // Background color
    'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
  });
});

// Add globe rotation
const secondsPerRevolution = 120;
const maxSpinZoom = 3;

let userInteraction = false;
let spinEnabled = true;

function spinGlobe() {
  const zoom = map2.getZoom();
  if(spinEnabled && !userInteraction && zoom < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution;
    const center = map2.getCenter();
    center.lng -= distancePerSecond;

    map2.easeTo({center, duration: 1000, easing: (n) => n});
  }

  requestAnimationFrame(spinGlobe);
}

map2.on('mousedown', () => {
  userInteraction = true;
});

map2.on('mouseup', () => {
  userInteraction = false;
  spinGlobe();
});

map2.on('style.load', () => {
  spinGlobe();
});

// Function to create boxes for projects. called "project boxes" due to early build focus on projects.
function createProjectBoxSection2(project, index, sidebarId, mapInstance) {
    var ProjectBox = document.createElement('div');
    ProjectBox.className = 'project-box';
    ProjectBox.setAttribute('name', project.name); 
    ProjectBox.innerHTML = `
        <h3>${project.title}</h3>
        <a href = "${project.link}"> <img src="${project.imageUrl}" alt="${project.name}"> </a>
        <p>${project.description}</p>
    `;
    ProjectBox.addEventListener('click', function() {
        mapInstance.flyTo({
            center: project.coordinates,
            zoom: project.zoomLevel, // Use the zoomLevel attribute for each project based on extent
            essential: true 
        });

    });
    document.getElementById(sidebarId).appendChild(ProjectBox);
}

fetch('resources/projects.json')
  .then(response => response.json())
  .then(data => {
    const projects = data;

    // Add project points to the map and created boxes for projects
    projects.forEach(function(project, index) {
      // Create a map pin for project
      var marker = new mapboxgl.Marker()
        .setLngLat(project.coordinates)
        .addTo(map2);
   
      // Attach click event to each marker
      marker.getElement().addEventListener('click', function() {
        map2.flyTo({
          center: project.coordinates,
          zoom: 10,
          essential: true
        });
   
        // Scroll to the corresponding project box (function call)
        scrollToProjectBox(project.name, 'sidebar2'); // Pass project name and sidebar ID
   
      });
     
        createProjectBoxSection2(project, index, 'sidebar2', map2);
        
        document.getElementById('sidebar2').addEventListener('scroll', () => {
            var sidebar = document.getElementById('sidebar2');
            var projectBoxes = sidebar.getElementsByClassName('project-box');
            var mapCenterIndex = -1;
            var sidebarRect = sidebar.getBoundingClientRect();
            var sidebarMidpoint = sidebarRect.top + sidebarRect.height / 2;
       
            fadeInFadeOut(sidebar);

            if (window.matchMedia("(max-width: 768px)").matches) {
              console.log('Horizontal scroll position:', sidebar.scrollLeft);
            } else {
              console.log('Vertical scroll position:', sidebar.scrollTop);
            }
       
            var isMobile = window.matchMedia("(max-width: 768px)").matches;
  
            if (isMobile) {
              // Horizontal scrolling logic
              var sidebarRect = sidebar.getBoundingClientRect();
              var sidebarMidpoint = sidebarRect.left + sidebarRect.width / 2;

              for (var i = 0; i < projectBoxes.length; i++) {
                var box = projectBoxes[i];
                var boxRect = box.getBoundingClientRect();

                if (boxRect.left <= sidebarMidpoint && boxRect.right >= sidebarMidpoint) {
                  mapCenterIndex = i;
                  break;
                }
              }
            } else {
              // Vertical scrolling logic
              var sidebarRect = sidebar.getBoundingClientRect();
              var sidebarMidpoint = sidebarRect.top + sidebarRect.height / 2;

              for (var i = 0; i < projectBoxes.length; i++) {
                var box = projectBoxes[i];
                var boxRect = box.getBoundingClientRect();

                if (boxRect.top <= sidebarMidpoint && boxRect.bottom >= sidebarMidpoint) {
                  mapCenterIndex = i;
                  break;
                }
              }
            }
       
            if (mapCenterIndex !== -1) {
                var targetProject = projects[mapCenterIndex];
                map2.flyTo({
                    center: targetProject.coordinates,
                    zoom: targetProject.zoomLevel,
                    essential: true
                });
            }
        });
       
        fadeInFadeOut(document.getElementById('sidebar2'));
    });
  })

function scrollToProjectBox(projectName, sidebarId) {
  var sidebar = document.getElementById(sidebarId);
  var projectBoxes = sidebar.getElementsByClassName('project-box');
  var targetIndex = -1;

  // Find the target project box by name
  for (var i = 0; i < projectBoxes.length; i++) {
    if (projectBoxes[i].getAttribute('name') === projectName) {
      targetIndex = i;
      break;
    }
  }

  if (targetIndex !== -1) {
    var isMobile = window.matchMedia("(max-width: 768px)").matches;
    var sidebarSize = isMobile ? sidebar.clientWidth : sidebar.clientHeight;
    var targetScrollPos;
    
    // Define the offset and box dimensions for each layout
    var mobileOffset = 600;
    var desktopOffset = 600;
    var boxWidth = 600;
    var boxHeight = 600;

    if (isMobile) {
      // Calculate horizontal scroll position on mobile
      targetScrollPos = (targetIndex * boxWidth) + mobileOffset + (sidebarSize/2) - (boxWidth);
      console.log(targetScrollPos);
      sidebar.scrollTo({
        left: targetScrollPos,
        behavior: 'smooth'
      });
    } else {
      // Calculate vertical scroll position on desktop
      targetScrollPos = (targetIndex * boxHeight) + desktopOffset + (sidebarSize/2) - (boxHeight/2);
      sidebar.scrollTo({
        top: targetScrollPos,
        behavior: 'smooth'
      });
    }
  } else {
    console.warn("Project box not found for name:", projectName);
  }
}

function fadeInFadeOut(sidebar) {
  const projectBoxes = sidebar.querySelectorAll('.project-box');
  const sidebarHeight = sidebar.clientHeight;

  for (const projectBox of projectBoxes) {
    const boxRect = projectBox.getBoundingClientRect();
    const distanceToTop = boxRect.top - sidebar.getBoundingClientRect().top + (projectBox.clientHeight / 2);
    const distanceFromBottom = sidebarHeight - distanceToTop;

    let opacity = 1;
    let scale = 1;
    if (distanceToTop < 50) {
      opacity = Math.min(1, Math.max(0, distanceToTop / 50));
      scale = Math.min(1, Math.max(0.5, distanceToTop / 50));
    } else if (distanceFromBottom < 50) {
      opacity = Math.min(1, Math.max(0, distanceFromBottom / 50));
      scale = Math.min(1, Math.max(0.5, distanceFromBottom / 50));
    } else {
      opacity = 1;
      scale = 1;
    }

    projectBox.style.opacity = opacity;
    projectBox.style.transform = `scale(${scale})`;
    projectBox.style.transition = 'opacity 0.3s, transform 0.3s';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById("header");
  const navButtons = document.querySelector('.nav-bar');
  const sidebar2 = document.getElementById('sidebar2');

  function handleVisibility() {
    const sidebarScrolled = sidebar2.scrollTop > 0;
    const mapZoomed = map2 && map2.getZoom() > 1.5;

    if (sidebarScrolled || mapZoomed) {
      header.classList.add('visible');
      navButtons.classList.add('fade-in');
      userInteraction = true;
    } else {
      header.classList.remove('visible');
      navButtons.classList.remove('fade-in');
    }
  }

  sidebar2.addEventListener('scroll', handleVisibility);

  map2.on('zoom', handleVisibility);

  handleVisibility();
});

document.getElementById("globe-button").addEventListener('click', () =>{
  const sidebar = document.getElementById("sidebar2");
  map2.setZoom(1);
  sidebar.scrollTop = 0;
  window.scrollTo(0, 0);
});
