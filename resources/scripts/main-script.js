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
    'horizon-blend': 0.01, // Atmosphere thickness 
    'space-color': 'rgb(0, 0, 0)', // Background color
    'star-intensity': 0.6 // Background star brightness
  });
});

let projectsData = null;
const secondsPerRevolution = 120;
const maxSpinZoom = 3;
let userInteraction = false;
let spinEnabled = true;
let lastTime = 0;

function spinGlobe(currentTime) {
  if (!lastTime) lastTime = currentTime;
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  if (spinEnabled && !userInteraction && map2.getZoom() < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution;
    let distance = distancePerSecond * (deltaTime / 1000);
    
    const center = map2.getCenter();
    center.lng -= distance;
    
    map2.jumpTo({center});
  }
  
  requestAnimationFrame(spinGlobe);
}

map2.on('mousedown', () => {
  userInteraction = true;
});

map2.on('mouseup', () => {
  userInteraction = false;
  requestAnimationFrame(spinGlobe);
});

map2.on('style.load', () => {
  requestAnimationFrame(spinGlobe);
});

map2.on('load', () => {
  if (projectsData) {
    initializeClustering(projectsData);
  }
});

function createProjectBoxSection2(project, index, sidebarId, mapInstance) {
    var ProjectBox = document.createElement('div');
    ProjectBox.className = 'project-box';
    ProjectBox.setAttribute('name', project.name); 
    ProjectBox.innerHTML = `
        <h3>${project.title}</h3>
        <a href = "${project.link}"> <img src="${project.imageUrl}" alt="${project.name}"> </a>
        <p>${project.description}</p>
    `;

    document.getElementById(sidebarId).appendChild(ProjectBox);
}

function initializeClustering(projects) {
  map2.addSource('projects', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    },
    cluster: true,
    clusterMaxZoom: 6, 
    clusterRadius: 40
  });

  map2.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'projects',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#38adca',
      'circle-radius': 22
    }
  });

  map2.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'projects',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14
    },
    paint: {
      'text-color': '#ffffff'
    }
  });

  map2.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'projects',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#f78247',
      'circle-radius': 8,
      'circle-stroke-width': 0.5,
      'circle-stroke-color': '#fff'
    }
  });

  map2.addLayer({
    id: 'highlighted-point',
    type: 'circle',
    source: 'projects',
    filter: ['==', ['get', 'name'], ''],
    paint: {
      'circle-color': '#ffff00',
      'circle-radius': 12,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#000'
    }
  });

  map2.on('click', 'clusters', (e) => {
    const features = map2.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map2.getSource('projects').getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
        if (err) return;

        map2.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      }
    );
  });

  map2.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;
    
    scrollToProjectBox(properties.name, JSON.parse(properties.projectData), 'sidebar2');
  });

  map2.on('mouseenter', 'clusters', () => {
    map2.getCanvas().style.cursor = 'pointer';
  });
  map2.on('mouseleave', 'clusters', () => {
    map2.getCanvas().style.cursor = '';
  });
  map2.on('mouseenter', 'unclustered-point', () => {
    map2.getCanvas().style.cursor = 'pointer';
  });
  map2.on('mouseleave', 'unclustered-point', () => {
    map2.getCanvas().style.cursor = '';
  });

  const geojsonData = {
    type: 'FeatureCollection',
    features: projects.map(project => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: project.coordinates
      },
      properties: {
        name: project.name,
        title: project.title,
        cluster: project.cluster || 'default',
        projectData: JSON.stringify(project)
      }
    }))
  };

  map2.getSource('projects').setData(geojsonData);
}

fetch('resources/projects.json')
  .then(response => response.json())
  .then(data => {
    const projects = data;
    projectsData = projects;

    if (map2.loaded()) {
      initializeClustering(projects);
    } else {
      console.log("Map not loaded yet, waiting for load event.");
    }

    projects.forEach(function(project, index) {
      createProjectBoxSection2(project, index, 'sidebar2', map2);
      
      document.getElementById('sidebar2').addEventListener('scroll', () => {
        flyToBoxCoord(document.getElementById('sidebar2'), projects);
        fadeInFadeOut(document.getElementById('sidebar2'));
      });
    });
})

function flyToBoxCoord(sidebar, projects) {
  var projectBoxes = sidebar.getElementsByClassName('project-box');
  var mapCenterIndex = -1;
  var sidebarRect = sidebar.getBoundingClientRect();
  var sidebarMidpoint = sidebarRect.top + sidebarRect.height / 2;

  fadeInFadeOut(sidebar);

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
    const targetProject = projects[mapCenterIndex];
    const targetProjectName = targetProject.name;

    map2.setFilter('highlighted-point', ['==', ['get', 'name'], targetProjectName]);
    
    map2.stop();
    map2.flyTo({
      center: targetProject.coordinates,
      zoom: targetProject.zoomLevel,
      essential: true,
      duration: 2500
    });
  }
}

function scrollToProjectBox(projectName, projects, sidebarId) {
  const sidebar = document.getElementById(sidebarId);
  const projectBoxes = sidebar.getElementsByClassName('project-box');
  let targetIndex = -1;

  for (let i = 0; i < projectBoxes.length; i++) {
    if (projectBoxes[i].getAttribute('name') === projectName) {
      targetIndex = i;
      break;
    }
  }

  if (targetIndex !== -1) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const sidebarSize = isMobile ? sidebar.clientWidth : sidebar.clientHeight;
    const offset = 600;
    const boxSize = 600;
    const targetScrollPos = isMobile ? 
      ((targetIndex * boxSize) + offset + (sidebarSize / 2)) - (boxSize / 2):
      ((targetIndex * boxSize) + offset + (sidebarSize / 2)) - (boxSize / 2);

    sidebar.scrollTo({
      [isMobile ? 'left' : 'top']: targetScrollPos,
      behavior: 'smooth'
    });

    map2.flyTo({
      center: projects[targetIndex].coordinates,
      zoom: 10,
      essential: true
    });
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

  function handleVisibility() {
    const mapZoomed = map2 && map2.getZoom() > 1.5;

    if (mapZoomed) {
      header.classList.add('visible');
      navButtons.classList.add('fade-in');
      userInteraction = true;
    } else {
      header.classList.remove('visible');
      navButtons.classList.remove('fade-in');
    }
  }

  map2.on('zoom', handleVisibility);

  handleVisibility();
});

document.getElementById("globe-button").addEventListener('click', () =>{
  const sidebar = document.getElementById("sidebar2");
  map2.setZoom(1);
  sidebar.scrollTop = 0;
  sidebar.scrollLeft = 0;
  window.scrollTo(0, 0);
});