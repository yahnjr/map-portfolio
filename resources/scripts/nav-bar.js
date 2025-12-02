async function populateNavbar() {
    const jsonFile = "../../resources/projects.json";
    const response = await fetch(jsonFile);
    const projects = await response.json();
    
    const projectTitle = document.querySelector('meta[name="project-title"]') ? document.querySelector('meta[name="project-title"]').content : null;
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        console.error("Dropdown content not found");
        return;
    }
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        if (project.name !== projectTitle) {
            const link = document.createElement('a');
            const projectImage = document.createElement('img');
            const navProjectBox = document.createElement('div');
            const projectTitle = document.createElement('h3');
            const projectDescription = document.createElement('p');

            link.href = `https://yahnjr.github.io/map-portfolio/projects/${project.link.split('/').pop()}`;
            projectTitle.textContent = project.name;
            projectDescription.textContent = project.description;
            projectImage.src = project.imageUrl;

            projectsGrid.appendChild(link);
            link.appendChild(navProjectBox);
            navProjectBox.style.backgroundImage = `url(${project.imageUrl})`;
            navProjectBox.appendChild(projectTitle);
            navProjectBox.appendChild(projectDescription);
            navProjectBox.className = 'nav-project-box';
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateNavbar();
    const projectsModal = document.getElementById('projects-modal');
    const projectsButton = document.querySelector('.projects-button');
    const closeButton = document.getElementById('close-projects');
    
    const openModal = (e) => {
        e.preventDefault();
        projectsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    
    const closeModal = () => {
        projectsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };
    
    projectsButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    
    projectsModal.addEventListener('click', (e) => {
        if (e.target === projectsModal) {
            closeModal();
        }
    });
});