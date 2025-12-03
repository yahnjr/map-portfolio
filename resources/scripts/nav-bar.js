let allProjects = [];
let currentFilters = {
    text: '',
    location: null,
    tag: null
};

async function populateNavbar() {
    const projectTitle = document.querySelector('meta[name="project-title"]') ? document.querySelector('meta[name="project-title"]').content : null;
    const jsonFile = (projectTitle == "Map Portfolio") ? "resources/projects.json" : "../../resources/projects.json";
    const response = await fetch(jsonFile);
    const projects = await response.json();
    
    allProjects = projects;
    
    const tags = Array.from(new Set(projects.flatMap(project => project.skills))).sort();
    const locations = Array.from(new Set(projects.flatMap(project => project.location))).sort();
    
    window.availableTags = tags;
    window.availableLocations = locations;
    
    displayProjects(projects, projectTitle);
}

function displayProjects(projects, currentProjectTitle) {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        console.error("Projects grid not found");
        return;
    }
    
    projectsGrid.innerHTML = '';
    
    const filteredProjects = projects.filter(project => project.name !== currentProjectTitle);
    
    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #999;">No projects found matching your criteria.</p>';
        return;
    }
    
    filteredProjects.forEach(project => {
        const link = document.createElement('a');
        const navProjectBox = document.createElement('div');
        const projectTitle = document.createElement('h3');
        const projectDescription = document.createElement('p');
        
        link.href = `https://yahnjr.github.io/map-portfolio/projects/${project.link.split('/').pop()}`;
        projectTitle.textContent = project.name;
        projectDescription.textContent = project.description;
        
        navProjectBox.style.backgroundImage = `url(${project.imageUrl})`;
        navProjectBox.appendChild(projectTitle);
        navProjectBox.appendChild(projectDescription);
        navProjectBox.className = 'nav-project-box';
        
        link.appendChild(navProjectBox);
        projectsGrid.appendChild(link);
    });
}

function filterProjects() {
    const projectTitle = document.querySelector('meta[name="project-title"]') ? document.querySelector('meta[name="project-title"]').content : null;
    
    let filtered = allProjects.filter(project => {
        if (currentFilters.text) {
            const searchText = currentFilters.text.toLowerCase();
            const matchesText = 
                project.name.toLowerCase().includes(searchText) ||
                project.description.toLowerCase().includes(searchText) ||
                project.location.some(location => location.toLowerCase().includes(searchText)) ||
                project.skills.some(skill => skill.toLowerCase().includes(searchText));
            
            if (!matchesText) return false;
        }
        
        if (currentFilters.location && !project.location.includes(currentFilters.location)) {
            return false;
        }

        if (currentFilters.tag && !project.skills.includes(currentFilters.tag)) {
            return false;
        }
        
        return true;
    });
    
    displayProjects(filtered, projectTitle);
}

function createFilterDropdown(items, type) {
    const dropdown = document.createElement('div');
    dropdown.className = 'filter-dropdown';
    
    items.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item;
        button.className = 'filter-option';
        
        if ((type === 'location' && currentFilters.location === item) ||
            (type === 'tag' && currentFilters.tag === item)) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            if (type === 'location') {
                currentFilters.location = currentFilters.location === item ? null : item;
            } else {
                currentFilters.tag = currentFilters.tag === item ? null : item;
            }
            filterProjects();
            dropdown.remove();
        });
        
        dropdown.appendChild(button);
    });
    
    return dropdown;
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        populateNavbar();
    }, 100);
    
    const projectsModal = document.getElementById('projects-modal');
    const projectsButton = document.querySelector('.projects-button');
    const closeButton = document.getElementById('close-projects');
    const searchInput = document.getElementById('projects-search');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-filters');
    const geographicButton = document.getElementById('search-geographic');
    const tagsButton = document.getElementById('search-tags');
    
    const openModal = (e) => {
        e.preventDefault();
        projectsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    
    const closeModal = () => {
        projectsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        document.querySelectorAll('.filter-dropdown').forEach(d => d.remove());
    };
    
    projectsButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    
    projectsModal.addEventListener('click', (e) => {
        if (e.target === projectsModal) {
            closeModal();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        currentFilters.text = e.target.value;
        filterProjects();
    });
    
    searchButton.addEventListener('click', () => {
        currentFilters.text = searchInput.value;
        filterProjects();
    });
    
    clearButton.addEventListener('click', () => {
        currentFilters.text = '';
        currentFilters.location = null;
        currentFilters.tag = null;
        searchInput.value = '';
        filterProjects();
    });
    
    geographicButton.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-dropdown').forEach(d => d.remove());
        
        const dropdown = createFilterDropdown(window.availableLocations, 'location');
        geographicButton.parentElement.appendChild(dropdown);
        
        const rect = geographicButton.getBoundingClientRect();
        const modalRect = projectsModal.querySelector('.projects-modal-content').getBoundingClientRect();
        dropdown.style.top = `${rect.bottom - modalRect.top + 5}px`;
        dropdown.style.left = `${rect.left - modalRect.left}px`;
    });
    
    tagsButton.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-dropdown').forEach(d => d.remove());
        
        const dropdown = createFilterDropdown(window.availableTags, 'tag');
        tagsButton.parentElement.appendChild(dropdown);
        
        const rect = tagsButton.getBoundingClientRect();
        const modalRect = projectsModal.querySelector('.projects-modal-content').getBoundingClientRect();
        dropdown.style.top = `${rect.bottom - modalRect.top + 5}px`;
        dropdown.style.left = `${rect.left - modalRect.left}px`;
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-filter') && !e.target.closest('.filter-dropdown')) {
            document.querySelectorAll('.filter-dropdown').forEach(d => d.remove());
        }
    });
});