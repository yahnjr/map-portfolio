document.addEventListener('DOMContentLoaded', () => {
    const starBackground = document.querySelector('.star-background');
    const numberOfStars = 75;
    const stars = [];
  
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.width = `${Math.random() * 2 + 1}px`;
      star.style.height = star.style.width;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      starBackground.appendChild(star);
      stars.push(star);
    }
  
    function animateStars() {
      stars.forEach(star => {
        let left = parseFloat(star.style.left);
        left -= 0.02;
        if (left < -2) {
          left = 100;
          star.style.top = `${Math.random() * 100}%`;
        }
        star.style.left = `${left}%`;
      });
      requestAnimationFrame(animateStars);
    }
  
    animateStars();
  });