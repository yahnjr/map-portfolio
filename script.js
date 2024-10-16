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
            var ProjectBoxes = sidebar.getElementsByClassName('project-box');
            var mapCenterIndex = -1;
            var sidebarRect = sidebar.getBoundingClientRect();
            var sidebarMidpoint = sidebarRect.top + sidebarRect.height / 2;
       
            fadeInFadeOut(sidebar);
       
            for (var i = 0; i < ProjectBoxes.length; i++) {
                var box = ProjectBoxes[i];
                var boxRect = box.getBoundingClientRect();
               
                // Check if the midpoint of the sidebar is between the top and bottom of the box
                if (boxRect.top <= sidebarMidpoint && boxRect.bottom >= sidebarMidpoint) {
                    mapCenterIndex = i;
                    break;
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
  
    for (var i = 0; i < projectBoxes.length; i++) {
      if (projectBoxes[i].getAttribute('name') === projectName) {
        targetIndex = i;
        break;
      }
    }
  
    if (targetIndex !== -1) {
      var isMobile = window.matchMedia("(max-width: 768px)").matches;
  
      var desktopPositions = [];
      var mobilePositions = [];
  
      // Calculate mobile positions
      for (var i = 0; i < 10; i++) {
        mobilePositions.push(240 + (i * (200 + 60)));
        desktopPositions.push(600 + (i * (400 + 220)));
      }
  
      var positions = isMobile ? mobilePositions : desktopPositions;
      var targetScrollTop = positions[targetIndex];
     
      var sidebarHeight = sidebar.clientHeight;
      var boxHeight = isMobile ? 300 : 500;
      var offset = isMobile ? mobilePositions[0] : 237;
  
      targetScrollTop = Math.max(0, targetScrollTop - offset);
  
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
      console.warn("project box not found for name:", cityName);
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
});
