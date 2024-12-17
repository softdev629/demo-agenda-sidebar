window.addEventListener('message', function(event) {
    if (event.data.type === 'keypress') {
        if (event.data.key === 'ArrowRight') {
            handleNext();
        } else if (event.data.key === 'ArrowLeft') {
            handlePrevious();
        }
    }
});

let currentStep = -1;
let currentSubStep = -1;

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') {
        handleNext();
    } else if (e.code === 'ArrowLeft') {
        handlePrevious();
    }
});

function handleNext() {
    const steps = document.querySelectorAll('.agenda-list > li');
    
    if (currentStep === -1) {
        // Start presentation
        currentStep = 0;
        currentSubStep = 0;
        updateUI();
        return;
    }

    if(currentStep === steps.length) {
        return;
    }

    const currentStepElement = steps[currentStep];
    const subSteps = currentStepElement.querySelectorAll('.agenda-sub-list > li');

    if (subSteps.length === 0) {
        // No substeps, complete step and move to next
        currentStepElement.classList.remove('current');
        currentStepElement.classList.add('done');
        currentStep++;
        currentSubStep = 0;
    } else if (currentSubStep < subSteps.length - 1) {
        // Move to next substep
        subSteps[currentSubStep].classList.remove('current');
        subSteps[currentSubStep].classList.add('done');
        currentSubStep++;
    } else {
        // Complete current step and move to next
        subSteps[currentSubStep].classList.remove('current');
        subSteps[currentSubStep].classList.add('done');
        currentStepElement.classList.remove('current');
        currentStepElement.classList.add('done');
        currentStep++;
        currentSubStep = 0;
    }

    updateUI();
}

function handlePrevious() {
    // Similar to handleNext but in reverse
    // Implement as needed
    const steps = document.querySelectorAll('.agenda-list > li');
    
    if(currentStep === -1) {
        return;
    }

    if (currentStep === 0 && currentSubStep === 0) {
        currentStep = -1;
        currentSubStep = 0;
        updateUI();
        // At beginning, can't go back further
        return;
    }

    if(currentStep === steps.length) {
      currentStep = steps.length - 1;
      currentSubStep = steps[currentStep].querySelectorAll('.agenda-sub-list > li').length - 1;
      updateUI();
      return;
    }

    const currentStepElement = steps[currentStep];
    const subSteps = currentStepElement.querySelectorAll('.agenda-sub-list > li');

    if (subSteps.length === 0) {
        // No substeps, go back to previous step
        currentStepElement.classList.remove('current');
        currentStepElement.classList.add('undone');
        currentStep--;
        // Set substep to last position of previous step's substeps if they exist
        const prevStepSubSteps = steps[currentStep].querySelectorAll('.agenda-sub-list > li');
        currentSubStep = prevStepSubSteps.length > 0 ? prevStepSubSteps.length - 1 : 0;
    } else if (currentSubStep > 0) {
        // Move to previous substep
        subSteps[currentSubStep].classList.remove('current');
        subSteps[currentSubStep].classList.add('undone');
        currentSubStep--;
        subSteps[currentSubStep].classList.remove('done');
        subSteps[currentSubStep].classList.add('current');
    } else {
        // At first substep, move to previous step
        subSteps[currentSubStep].classList.remove('current');
        subSteps[currentSubStep].classList.add('undone');
        currentStepElement.classList.remove('current');
        currentStepElement.classList.add('undone');
        currentStep--;
        // Set substep to last position of previous step's substeps if they exist
        const prevStepSubSteps = steps[currentStep].querySelectorAll('.agenda-sub-list > li');
        currentSubStep = prevStepSubSteps.length > 0 ? prevStepSubSteps.length - 1 : 0;
    }

    updateUI();
}

function scrollToActiveStep() {
    const activeStep = document.querySelector('.agenda-list > li.current');
    if (!activeStep) return;

    const container = document.querySelector('.sidebar-content');
    const containerHeight = container.clientHeight;
    const stepPosition = activeStep.offsetTop;
    const scrollPosition = stepPosition - (containerHeight / 2) + (activeStep.clientHeight / 2);
    
    container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
    });
}

function updateUI() {
    const steps = document.querySelectorAll('.agenda-list > li');
    
    steps.forEach((step, stepIndex) => {
        if (stepIndex === currentStep) {
            step.classList.remove('undone', 'done');
            step.classList.add('current');
            
            const subSteps = step.querySelectorAll('.agenda-sub-list > li');
            subSteps.forEach((subStep, subStepIndex) => {
                if (subStepIndex === currentSubStep) {
                    subStep.classList.remove('undone', 'done');
                    subStep.classList.add('current');
                } else if (subStepIndex < currentSubStep) {
                    subStep.classList.remove('undone', 'current');
                    subStep.classList.add('done');
                } else {
                    subStep.classList.remove('current', 'done');
                    subStep.classList.add('undone');
                }
            });
        } else if (stepIndex < currentStep) {
            step.classList.remove('undone', 'current');
            step.classList.add('done');
            step.querySelectorAll('.agenda-sub-list > li').forEach(subStep => {
                subStep.classList.remove('undone', 'current');
                subStep.classList.add('done');
            });
        } else {
            step.classList.remove('current', 'done');
            step.classList.add('undone');
            step.querySelectorAll('.agenda-sub-list > li').forEach(subStep => {
                subStep.classList.remove('current', 'done');
                subStep.classList.add('undone');
            });
        }
    });

    // Send current state to content script
    window.parent.postMessage({
        type: 'updateState',
        currentStep: currentStep,
        currentSubStep: currentSubStep
    }, '*');

    scrollToActiveStep();
}

// Fetch and initialize content
fetch("configuration.json")
    .then((response) => response.json())
    .then((data) => {
        const siderContentDom = document.querySelector(".sidebar-content");
        
        // Only add logo if configured to display
        if (data.logo && data.logo.display) {
            siderContentDom.innerHTML += `
                <div class="sidebar-logo">
                    <img height="${data.logo.height || 89}" 
                         src=${data.logo.url} 
                         alt="Logo" />
                </div>
            `;
        }

        siderContentDom.innerHTML += `
            <ul class="agenda-list">
            </ul>
        `;

        const agendaListDom = document.querySelector(".agenda-list");

        data.steps.forEach((step, index) => {
            agendaListDom.innerHTML += `
                <li id="step-${index}" class="undone">
                    <div class="agenda-header">
                        <h2><div><span class="dot"></span></div>${step.title}</h2>
                        <div class="agenda-person">
                            <img class="avatar" width="50" src=${step.img} alt="Avatar ${index + 1}" />
                            <span class="agenda-person-name">${step.name}</span>
                            <span class="agenda-person-role">${step.role}</span>
                        </div>
                    </div>
                    <ul class="agenda-sub-list">
                        ${step.subSteps.map((subStep, subStepIndex) =>
                            `<li id="sub-step-${index}-${subStepIndex}" class="undone">
                                <div><span class="dot"></span></div>
                                <span>${subStep}</span>
                            </li>`
                        ).join("")}
                    </ul>
                </li>
            `;
        });
    });
