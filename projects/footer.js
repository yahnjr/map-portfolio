const profileImages = [
    "../../resources/pictures/profile/profile1.jpg",
    "../../resources/pictures/profile/profile2.jpg",
    "../../resources/pictures/profile/profile3.jpg",
    "../../resources/pictures/profile/profile4.jpg",
    "../../resources/pictures/profile/profile5.jpg",
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