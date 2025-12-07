// ===== CURSOR ANIMATION =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, label');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2, .fade-in-delay-3').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

// ===== FILE UPLOAD HANDLING =====
const fileUpload = document.getElementById('fileUpload');
const fileList = document.getElementById('fileList');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const projectGallery = document.getElementById('projectGallery');

let uploadedFiles = [];
let uploadedImages = [];
let galleryImages = []; // Images with descriptions for gallery

// Load from localStorage on page load
if (fileList || imagePreview || projectGallery) {
    loadFromStorage();
}

// Load gallery images on gallery page
const galleryDisplay = document.getElementById('galleryDisplay');
if (galleryDisplay) {
    loadGalleryFromStorage();
}

// File upload handler
if (fileUpload) {
    fileUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                return;
            }
            
            uploadedFiles.push({
                name: file.name,
                size: file.size,
                type: file.type,
                file: file
            });
            
            displayFile(file);
            saveToStorage();
        });
        
        e.target.value = '';
    });
}

// Image upload handler
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file.`);
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert(`Image ${file.name} is too large. Maximum size is 5MB.`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = {
                    name: file.name,
                    size: file.size,
                    dataUrl: event.target.result
                };
                
                uploadedImages.push(imageData);
                displayImagePreview(imageData);
                addToGallery(imageData);
                saveToStorage();
            };
            reader.readAsDataURL(file);
        });
        
        e.target.value = '';
    });
}

// Display uploaded file
function displayFile(file) {
    if (!fileList) return;
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <span>📄 ${file.name} (${formatFileSize(file.size)})</span>
        <button onclick="removeFile('${file.name}')">Remove</button>
    `;
    fileList.appendChild(fileItem);
}

// Display image preview
function displayImagePreview(imageData) {
    if (!imagePreview) return;
    
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.innerHTML = `
        <img src="${imageData.dataUrl}" alt="${imageData.name}">
        <button onclick="removeImagePreview('${imageData.name}')">×</button>
    `;
    imagePreview.appendChild(previewItem);
}

// Add to project gallery
function addToGallery(imageData) {
    if (!projectGallery) return;
    
    // Remove empty message if exists
    const emptyMsg = projectGallery.querySelector('.empty-gallery');
    if (emptyMsg) {
        emptyMsg.remove();
    }
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item fade-in';
    galleryItem.dataset.id = imageData.id || Date.now().toString();
    galleryItem.innerHTML = `
        <img src="${imageData.dataUrl}" alt="${imageData.name}">
        <div class="gallery-item-info">
            <h3>${imageData.name}</h3>
            ${imageData.description ? `<p class="gallery-description">${imageData.description}</p>` : ''}
            <p class="gallery-meta">${formatFileSize(imageData.size)}${imageData.date ? ' • ' + formatDate(imageData.date) : ''}</p>
            <button onclick="removeProjectImage('${imageData.id || imageData.name}')" class="btn-remove">Remove</button>
        </div>
    `;
    projectGallery.appendChild(galleryItem);
}

// Remove project image
function removeProjectImage(imageIdOrName) {
    uploadedImages = uploadedImages.filter(img => {
        return (img.id && img.id !== imageIdOrName) || (!img.id && img.name !== imageIdOrName);
    });
    saveToStorage();
    loadFromStorage();
}

// Make removeProjectImage globally available
window.removeProjectImage = removeProjectImage;

// Remove file
function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    saveToStorage();
    loadFromStorage();
}

// Remove image preview
function removeImagePreview(fileName) {
    uploadedImages = uploadedImages.filter(img => img.name !== fileName);
    saveToStorage();
    loadFromStorage();
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem('mmEngineeringFiles', JSON.stringify(uploadedFiles.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
    }))));
    // Save images with all their properties including description
    localStorage.setItem('mmEngineeringImages', JSON.stringify(uploadedImages.map(img => ({
        id: img.id || Date.now().toString(),
        name: img.name,
        size: img.size,
        dataUrl: img.dataUrl,
        description: img.description || '',
        date: img.date || new Date().toISOString()
    }))));
}

// Load from localStorage
function loadFromStorage() {
    // Load files
    const savedFiles = localStorage.getItem('mmEngineeringFiles');
    if (savedFiles && fileList) {
        uploadedFiles = JSON.parse(savedFiles);
        fileList.innerHTML = '';
        uploadedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>📄 ${file.name} (${formatFileSize(file.size)})</span>
                <button onclick="removeFile('${file.name}')">Remove</button>
            `;
            fileList.appendChild(fileItem);
        });
    }
    
    // Load images
    const savedImages = localStorage.getItem('mmEngineeringImages');
    if (savedImages) {
        uploadedImages = JSON.parse(savedImages);
        
        if (imagePreview) {
            imagePreview.innerHTML = '';
            uploadedImages.forEach(imageData => {
                displayImagePreview(imageData);
            });
        }
        
        if (projectGallery) {
            projectGallery.innerHTML = '';
            if (uploadedImages.length === 0) {
                projectGallery.innerHTML = '<p class="empty-gallery">No project images uploaded yet. Upload an image with description above to see it here.</p>';
            } else {
                uploadedImages.forEach(imageData => {
                    addToGallery(imageData);
                });
            }
        }
    } else if (projectGallery && uploadedImages.length === 0) {
        projectGallery.innerHTML = '<p class="empty-gallery">No project images uploaded yet. Upload an image with description above to see it here.</p>';
    }
}

// Make functions globally available
window.removeFile = removeFile;
window.removeImagePreview = removeImagePreview;

// ===== IMAGE UPLOAD WITH DESCRIPTION (PROJECTS PAGE) =====
const imageForm = document.getElementById('imageForm');
const imageFile = document.getElementById('imageFile');
const imageDescription = document.getElementById('imageDescription');
const imageFormPreview = document.getElementById('imageFormPreview');

// Preview image before upload
if (imageFile) {
    imageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                e.target.value = '';
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image is too large. Maximum size is 5MB.');
                e.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                if (imageFormPreview) {
                    imageFormPreview.innerHTML = `
                        <div class="preview-container">
                            <img src="${event.target.result}" alt="Preview">
                            <p>Preview: ${file.name}</p>
                        </div>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Handle image form submission (Projects page)
if (imageForm) {
    imageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const file = imageFile.files[0];
        const description = imageDescription.value.trim();
        
        // Clear previous errors
        document.querySelectorAll('#imageForm .error-message').forEach(el => {
            el.textContent = '';
        });
        
        let isValid = true;
        
        if (!file) {
            showFormError('imageFile', 'Please select an image');
            isValid = false;
        }
        
        if (description === '') {
            showFormError('imageDescription', 'Description is required');
            isValid = false;
        } else if (description.length < 10) {
            showFormError('imageDescription', 'Description must be at least 10 characters');
            isValid = false;
        }
        
        if (isValid) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = {
                    id: Date.now().toString(),
                    name: file.name,
                    size: file.size,
                    dataUrl: event.target.result,
                    description: description,
                    date: new Date().toISOString()
                };
                
                uploadedImages.push(imageData);
                addToGallery(imageData);
                saveToStorage();
                
                // Reset form
                imageForm.reset();
                if (imageFormPreview) {
                    imageFormPreview.innerHTML = '';
                }
                
                // Show success message
                showFormSuccess('Image added to gallery successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// ===== IMAGE UPLOAD WITH DESCRIPTION (GALLERY PAGE) =====
const galleryImageForm = document.getElementById('galleryImageForm');
const galleryImageFile = document.getElementById('galleryImageFile');
const galleryImageDescription = document.getElementById('galleryImageDescription');
const galleryFormPreview = document.getElementById('galleryFormPreview');

// Preview image before upload (Gallery page)
if (galleryImageFile) {
    galleryImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                e.target.value = '';
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image is too large. Maximum size is 5MB.');
                e.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                if (galleryFormPreview) {
                    galleryFormPreview.innerHTML = `
                        <div class="preview-container">
                            <img src="${event.target.result}" alt="Preview">
                            <p>Preview: ${file.name}</p>
                        </div>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Handle gallery image form submission
if (galleryImageForm) {
    galleryImageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const file = galleryImageFile.files[0];
        const description = galleryImageDescription.value.trim();
        
        // Clear previous errors
        document.querySelectorAll('#galleryImageForm .error-message').forEach(el => {
            el.textContent = '';
        });
        
        let isValid = true;
        
        if (!file) {
            showFormError('galleryImageFile', 'Please select an image');
            isValid = false;
        }
        
        if (description === '') {
            showFormError('galleryImageDescription', 'Description is required');
            isValid = false;
        } else if (description.length < 10) {
            showFormError('galleryImageDescription', 'Description must be at least 10 characters');
            isValid = false;
        }
        
        if (isValid) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = {
                    id: Date.now().toString(),
                    name: file.name,
                    size: file.size,
                    dataUrl: event.target.result,
                    description: description,
                    date: new Date().toISOString()
                };
                
                galleryImages.push(imageData);
                addToGalleryDisplay(imageData);
                saveGalleryToStorage();
                
                // Reset form
                galleryImageForm.reset();
                if (galleryFormPreview) {
                    galleryFormPreview.innerHTML = '';
                }
                
                // Show success message
                showFormSuccess('Image added to gallery successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Add image to gallery display
function addToGalleryDisplay(imageData) {
    if (!galleryDisplay) return;
    
    // Remove empty message if exists
    const emptyMsg = galleryDisplay.querySelector('.empty-gallery');
    if (emptyMsg) {
        emptyMsg.remove();
    }
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item fade-in';
    galleryItem.dataset.id = imageData.id;
    galleryItem.innerHTML = `
        <img src="${imageData.dataUrl}" alt="${imageData.name}">
        <div class="gallery-item-info">
            <h3>${imageData.name}</h3>
            <p class="gallery-description">${imageData.description}</p>
            <p class="gallery-meta">${formatFileSize(imageData.size)} • ${formatDate(imageData.date)}</p>
            <button onclick="removeGalleryImage('${imageData.id}')" class="btn-remove">Remove</button>
        </div>
    `;
    galleryDisplay.appendChild(galleryItem);
}

// Remove gallery image
function removeGalleryImage(imageId) {
    galleryImages = galleryImages.filter(img => img.id !== imageId);
    saveGalleryToStorage();
    loadGalleryFromStorage();
}

// Load gallery from storage
function loadGalleryFromStorage() {
    if (!galleryDisplay) return;
    
    const savedGallery = localStorage.getItem('mmEngineeringGallery');
    if (savedGallery) {
        galleryImages = JSON.parse(savedGallery);
    }
    
    galleryDisplay.innerHTML = '';
    if (galleryImages.length === 0) {
        galleryDisplay.innerHTML = '<p class="empty-gallery">No images uploaded yet. Upload images above to see them here.</p>';
    } else {
        galleryImages.forEach(imageData => {
            addToGalleryDisplay(imageData);
        });
    }
}

// Save gallery to storage
function saveGalleryToStorage() {
    localStorage.setItem('mmEngineeringGallery', JSON.stringify(galleryImages));
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Show form error
function showFormError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

// Show form success message
function showFormSuccess(message) {
    // Create or update success message
    let successMsg = document.getElementById('formSuccessMessage');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.id = 'formSuccessMessage';
        successMsg.className = 'form-success-message';
        const form = document.getElementById('imageForm') || document.getElementById('galleryImageForm');
        if (form) {
            form.appendChild(successMsg);
        }
    }
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

// Make removeGalleryImage globally available
window.removeGalleryImage = removeGalleryImage;

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        // Validate name
        if (name === '') {
            showError('name', 'Name is required');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (message === '') {
            showError('message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = 'Thank you! Your message has been sent successfully.';
            formMessage.className = 'form-message success';
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 5000);
        }
    });
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Real-time validation
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            if (nameInput.value.trim() === '') {
                showError('name', 'Name is required');
            } else {
                clearError('name');
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                showError('email', 'Email is required');
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError('email', 'Please enter a valid email address');
            } else {
                clearError('email');
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            if (messageInput.value.trim() === '') {
                showError('message', 'Message is required');
            } else if (messageInput.value.trim().length < 10) {
                showError('message', 'Message must be at least 10 characters long');
            } else {
                clearError('message');
            }
        });
    }
}

// Clear error message
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

