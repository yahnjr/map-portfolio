function createSlide(slide, sidebarId) {
    var sidebarSlide = document.createElement('div');
    sidebarSlide.className = 'slide';
    sidebarSlide.setAttribute('name', slide.title);
    slideID = "slide" + slide.id
    sidebarSlide.setAttribute('id', slideID);
    sidebarSlide.setAttribute('background-image', slide.image1);
    sidebarSlide.innerHTML = `
        <h2>${slide.title}</h2>
        <p>${slide.description}</p>
    `;

    if (slide.sidebarPosition === "center") {
        sidebarSlide.style.left = "50%";
        sidebarSlide.style.transform = "translateX(-50%)";
    } else if (slide.sidebarPosition === "right") {
        sidebarSlide.style.left = "";
        sidebarSlide.style.right = "-65%"; 
    } else {
        sidebarSlide.style.right = "";
        sidebarSlide.style.left = "5%";  
    }

    document.getElementById(sidebarId).appendChild(sidebarSlide);
}

function changeBackground(sidebarID, mapID) {
    const sidebar = document.getElementById(sidebarID);
    const map = document.getElementById(mapID);
    const slides = sidebar.getElementsByClassName('slide');
  
    sidebar.addEventListener('scroll', () => {
      for (var i = 0; i < slides.length; i++) {
        var slide = slides[i];
        var slideBox = slide.getBoundingClientRect();
        var sidebarRect = sidebar.getBoundingClientRect();
  
        var visiblePercentage = (
          Math.min(slideBox.bottom, sidebarRect.bottom) -
          Math.max(slideBox.top, sidebarRect.top)
        ) / slideBox.height;
  
        if (visiblePercentage >= 0.8) {
          const backgroundImage = slide.getAttribute('background-image');
          map.style.backgroundImage = `url(${backgroundImage})`;
          break;
        }
      }
    });
}

function populateSection1(data) {
    data.forEach(function(slide) {
        const sidebarID = "sidebar1";
        const mapID = "map1";
        
        createSlide(slide, sidebarID);
        console.log(`Slide ${slide.id} created`);

        changeBackground(sidebarID, mapID);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('section1.json')
        .then(response => response.json())
        .then(data => {
            populateSection1(data);
        })
        .catch(error => console.error('Error fetching or parsing JSON:', error));
});