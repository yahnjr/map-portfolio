const infoButton = document.getElementById('infoButton');
const infoBox = document.getElementById('infoBox');

document.addEventListener('DOMContentLoaded', () => {
    const infoBox = document.getElementById('infoBox');
    const infoButton = document.getElementById('infoButton');

    infoButton.addEventListener('click', () => {
        infoBox.classList.toggle('open');

        if (infoBox.classList.contains('open')) {
            infoBox.classList.add('animate');
        } else {
            infoBox.classList.remove('animate');
        }
    });
});

document.addEventListener('click', (e) => {
    if (!infoBox.contains(e.target) && !infoButton.contains(e.target)) {
        infoBox.classList.remove('open');
    }
});

async function populateSkills() {
    const jsonFile = "../../resources/projects.json";
    const response = await fetch(jsonFile);
    const projects = await response.json();

    const projectTitle = document.querySelector('meta[name="project-title"]').content;

    const currentProject = projects.find(p => p.name === projectTitle);
    if (!currentProject) {
        console.error("Project not found:", projectTitle);
        return;
    }

    const popup = document.createElement('div');
    popup.id = 'relatedProjectsPopup';
    document.body.appendChild(popup);

    const skillsContainer = document.getElementById('skillsContainer');

    currentProject.skills.forEach(skill => {
        const skillBubble = document.createElement('span');
        skillBubble.textContent = skill;
        skillBubble.classList.add('skill-bubble');

        skillBubble.addEventListener('mouseenter', (event) => {
            showRelatedProjectsPopup(skill, projects, popup, event);
        });

        skillBubble.addEventListener('mousemove', (event) => {
            positionPopup(event, popup);
        });

        skillBubble.addEventListener('mouseleave', () => {
            hidePopup(popup);
        });

        skillsContainer.appendChild(skillBubble);
    });
}

function showRelatedProjectsPopup(skill, projects, popup, event) {
    const filteredProjects = projects.filter(project => project.skills.includes(skill));

    let popupContent = `<h3>Projects utilizing this skill</h3>`

    if (filteredProjects.length === 0) {
        popupContent += '<p>No related projects found.</p>';
    } else {
        popupContent += '<ul>' + 
            filteredProjects.map(project => `<li><a href="${project.link}">${project.name}</a></li>`).join('') +
            '</ul>';
    }

    popup.innerHTML = popupContent;

    popup.style.display = 'block';
    positionPopup(event, popup);
}

function positionPopup(event, popup) {
    const offset = 10;
    popup.style.left = `${event.pageX + offset}px`;
    popup.style.top = `${event.pageY + offset}px`;
}

function hidePopup(popup) {
    popup.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", populateSkills);