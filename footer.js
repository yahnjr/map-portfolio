
window.addEventListener('DOMContentLoaded', () => {
  footerContent = `
  <div id="about-modal" class="modal">
        <div class="modal-content">
        <span class="close-button" id="close-about">&times;</span>
          <div class="profile-section">
            <div class="profile-section">
              <div class="carousel">
                <img id="current-image" src="https://yahnjr.github.io/map-portfolio/resources/pictures/profile/profile1.jpg" alt="Profile" class="profile-image" />
                <button class="carousel-button left-button" id="previous-image-button">&#9664;</button>
                <button class="carousel-button right-button" id="next-image-button">&#9654;</button>
              </div>
            </div>
        
            <div class="button-container">
              <a href="https://github.com/yahnjr" class="link-button" target="_blank" title="GitHub Profile">
                <img src="https://yahnjr.github.io/map-portfolio/resources/pictures/icons/github.png" alt="GitHub Icon" class="icon" />
              </a>
              <a href="https://soundcloud.com/snailzorz" class="link-button" target="_blank" title="SoundCloud">
                <img src="https://yahnjr.github.io/map-portfolio/resources/pictures/icons/soundcloud.png" alt="Soundcloud Icon" class="icon" />
              </a>
              <a href="https://iformaher.wixsite.com/yahnkui" class="link-button" target="_blank" title="Travel Blog">
                <img src="https://yahnjr.github.io/map-portfolio/resources/pictures/icons/plane.svg" alt="Plane Icon" class="icon" />
              </a>
              <a href="https://www.etsy.com/shop/Mappedoutshirts" class="link-button" target="_blank" title="Mapped Out Shirts">
                <img src="https://yahnjr.github.io/map-portfolio/resources/pictures/icons/etsy.webp" alt="Etsy Icon" class="icon" />
              </a>
              <a href="https://www.linkedin.com/in/ian-maher-012a72220/" class="link-button" target="_blank" title="LinkedIn Profile">
                <img src="https://yahnjr.github.io/map-portfolio/resources/pictures/icons/linkedin.png" alt="LinkedIn Icon" class="icon" />
              </a>
              <a href="https://yahnjr.github.io/map-portfolio/resources/MaherResume.pdf" class="link-button" target="_blank" title="Resume">
                <img src="https://yahnjr.github.io/map-portfolio/resources/pictures/icons/file.svg" alt="Resume Icon" class="icon" />
              </a>
            </div>
          </div>

          <div class="content-section">
            <h2 class="about-header">About Me</h2>
            <div class="about-content">
              <p>
                I’m Ian Maher, a GIS professional currently working at ESRI, where I work on application development SDKs. I have experience applying GIS in a wide variety of fields, including urban planning, public works, real estate, and environmental conservation. I’m passionate about making spatial data accessible and meaningful, combining cartography, application development, and communication to help people better understand and interact with the world around them.
              </p>
              <p>
                I love exploring the world at every scale. Some of my hobbies include scuba diving, coding, making music, hiking, reading, and traveling. I am passionate about animals and the environment, and I hope my work can one day bring about a better world. 
              </p>
              <footer class="contact-footer">
                <p>Contact information</p>
                <p><a href="mailto:iformaher@gmail.com" class="contact-link">iformaher@gmail.com</a></p>
                <p><a href="tel:9713876991" class="contact-link">(971) 387-6991</a></p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    `;

      document.getElementById('footer').innerHTML = footerContent;

      const profileImages = [
          "https://yahnjr.github.io/map-portfolio/resources/pictures/profile/profile1.jpg",
          "https://yahnjr.github.io/map-portfolio/resources/pictures/profile/profile2.jpg",
          "https://yahnjr.github.io/map-portfolio/resources/pictures/profile/profile3.jpg",
          "https://yahnjr.github.io/map-portfolio/resources/pictures/profile/profile4.jpg",
          "https://yahnjr.github.io/map-portfolio/resources/pictures/profile/profile5.jpg",
        ];
      
      let currentIndex = 0;
      const imageElement = document.getElementById("current-image");
      
      function updateImage() {
        imageElement.src = profileImages[currentIndex];
      }
      
      function nextImage() {
        currentIndex = (currentIndex + 1) % profileImages.length;
        updateImage();
      }
      
      function prevImage() {
        currentIndex = (currentIndex - 1 + profileImages.length) % profileImages.length;
        updateImage();
      }
      
      document.getElementById("previous-image-button").addEventListener("click", prevImage);
      document.getElementById("next-image-button").addEventListener("click", nextImage);
      
      setInterval(nextImage, 30000);
      
      const aboutModal = document.getElementById('about-modal');
      const aboutButton = document.querySelector('.nav-button i.fa-address-card').closest('button');
      const closeButton = document.querySelector('.close-button');
      
      aboutButton.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
      
      closeButton.addEventListener('click', () => {
        aboutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
      
      aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
          aboutModal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
});