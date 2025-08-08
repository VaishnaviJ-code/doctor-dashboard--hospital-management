// Doctor Profile Page - Matching Functionality
console.log('🚀 Loading Doctor Profile Page...');

// Global variables
let sidebarOpen = false;
let currentTheme = localStorage.getItem('medicare-doctor-theme') || 'light';
let editMode = {
    personal: false,
    professional: false
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Ready - initializing...');
    setTimeout(initializeEverything, 100);
});

function initializeEverything() {
    console.log('🔧 Starting initialization...');
    
    // Get elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (!sidebar || !sidebarToggle || !themeToggle) {
        console.error('❌ Required elements not found');
        return;
    }
    
    // THEME FUNCTIONS
    function applyTheme(theme) {
        console.log(`🎨 Applying theme: ${theme}`);
        
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
        
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        currentTheme = theme;
        localStorage.setItem('medicare-doctor-theme', theme);
        console.log(`✅ Theme applied: ${theme}`);
    }
    
    // SIDEBAR FUNCTIONS
    function openSidebar() {
        if (window.innerWidth <= 768) {
            console.log('📱 Opening mobile sidebar');
            sidebar.classList.add('show', 'active');
            if (sidebarBackdrop) {
                sidebarBackdrop.classList.add('show', 'active');
            }
            document.body.classList.add('sidebar-open');
            sidebarOpen = true;
        }
    }
    
    function closeSidebar() {
        if (window.innerWidth <= 768) {
            console.log('📱 Closing mobile sidebar');
            sidebar.classList.remove('show', 'active');
            if (sidebarBackdrop) {
                sidebarBackdrop.classList.remove('show', 'active');
            }
            document.body.classList.remove('sidebar-open');
            sidebarOpen = false;
        }
    }
    
    function toggleSidebar() {
        console.log(`🍔 Toggle sidebar - Width: ${window.innerWidth}px`);
        
        if (window.innerWidth <= 768) {
            if (sidebarOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        } else {
            // Desktop toggle
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('medicare-sidebar-collapsed', isCollapsed);
            console.log(`💻 Desktop sidebar collapsed: ${isCollapsed}`);
        }
    }
    
    // EVENT LISTENERS
    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        showToast(`Switched to ${newTheme} mode!`, 'success');
    });
    
    // Backdrop click
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }
    
    // Window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
            const isCollapsed = localStorage.getItem('medicare-sidebar-collapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
            }
        } else {
            sidebar.classList.remove('collapsed');
        }
    });
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebarOpen) {
            closeSidebar();
        }
    });
    
    // PROFILE-SPECIFIC FUNCTIONALITY
    initializeProfileFeatures();
    
    // INITIALIZATION
    function initializePage() {
        // Apply saved theme
        applyTheme(currentTheme);
        
        // Initialize sidebar state
        if (window.innerWidth <= 768) {
            closeSidebar();
        } else {
            const isCollapsed = localStorage.getItem('medicare-sidebar-collapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
            }
        }
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 1000);
        }
        
        console.log('✅ Page initialized successfully');
        showToast('Profile page loaded!', 'success');
    }
    
    // Toast function
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = { 
            success: '#28a745', 
            warning: '#ffc107', 
            error: '#dc3545', 
            info: '#17a2b8' 
        };
        
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: ${colors[type]}; color: white; padding: 12px 20px;
            border-radius: 8px; font-family: 'Poppins', sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 14px;
            transform: translateX(400px); opacity: 0; 
            transition: all 0.3s ease; pointer-events: none;
        `;
        
        if (type === 'warning') toast.style.color = '#333';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Make functions global
    window.showToast = showToast;
    
    // Initialize everything
    initializePage();
}

// PROFILE-SPECIFIC FEATURES
function initializeProfileFeatures() {
    console.log('👤 Initializing profile features...');
    
    // Photo upload
    initializePhotoUpload();
    
    // Form editing
    initializeFormEditing();
    
    // Document upload
    initializeDocumentUpload();
    
    // Schedule editing
    initializeScheduleEditing();
    
    // Security settings
    initializeSecuritySettings();
    
    // Performance stats animation
    animateStats();
}

// PHOTO UPLOAD
function initializePhotoUpload() {
    const avatarUpload = document.getElementById('avatarUpload');
    const photoUpload = document.getElementById('photoUpload');
    const profilePhoto = document.getElementById('profilePhoto');
    const avatarPlaceholder = document.getElementById('avatarPlaceholder');
    
    if (avatarUpload && photoUpload) {
        avatarUpload.addEventListener('click', function() {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profilePhoto && avatarPlaceholder) {
                        profilePhoto.src = e.target.result;
                        profilePhoto.style.display = 'block';
                        avatarPlaceholder.style.display = 'none';
                        showToast('Profile photo updated!', 'success');
                    }
                };
                reader.readAsDataURL(file);
            } else {
                showToast('Please select a valid image file', 'error');
            }
        });
    }
}

// FORM EDITING
function initializeFormEditing() {
    // Personal info editing
    const editPersonalBtn = document.getElementById('editPersonalBtn');
    const personalForm = document.getElementById('personalInfoForm');
    const personalActions = document.getElementById('personalActions');
    const cancelPersonalBtn = document.getElementById('cancelPersonalBtn');
    
    if (editPersonalBtn && personalForm) {
        editPersonalBtn.addEventListener('click', function() {
            editMode.personal = !editMode.personal;
            toggleFormEdit('personal', personalForm, personalActions, editPersonalBtn);
        });
        
        if (cancelPersonalBtn) {
            cancelPersonalBtn.addEventListener('click', function() {
                editMode.personal = false;
                toggleFormEdit('personal', personalForm, personalActions, editPersonalBtn);
            });
        }
        
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Personal information updated!', 'success');
            editMode.personal = false;
            toggleFormEdit('personal', personalForm, personalActions, editPersonalBtn);
        });
    }
    
    // Professional info editing
    const editProfessionalBtn = document.getElementById('editProfessionalBtn');
    const professionalForm = document.getElementById('professionalForm');
    const professionalActions = document.getElementById('professionalActions');
    const cancelProfessionalBtn = document.getElementById('cancelProfessionalBtn');
    
    if (editProfessionalBtn && professionalForm) {
        editProfessionalBtn.addEventListener('click', function() {
            editMode.professional = !editMode.professional;
            toggleFormEdit('professional', professionalForm, professionalActions, editProfessionalBtn);
        });
        
        if (cancelProfessionalBtn) {
            cancelProfessionalBtn.addEventListener('click', function() {
                editMode.professional = false;
                toggleFormEdit('professional', professionalForm, professionalActions, editProfessionalBtn);
            });
        }
        
        professionalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Professional information updated!', 'success');
            editMode.professional = false;
            toggleFormEdit('professional', professionalForm, professionalActions, editProfessionalBtn);
        });
    }
}

function toggleFormEdit(type, form, actions, button) {
    const isEditing = editMode[type];
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (isEditing) {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.classList.remove('readonly');
        } else {
            input.setAttribute('readonly', 'true');
            input.setAttribute('disabled', 'true');
            input.classList.add('readonly');
        }
    });
    
    if (actions) {
        actions.style.display = isEditing ? 'flex' : 'none';
    }
    
    if (button) {
        button.innerHTML = isEditing ? 
            '<i class="fas fa-times"></i> Cancel' : 
            '<i class="fas fa-edit"></i> Edit';
        button.className = isEditing ? 
            'btn btn-outline-secondary btn-sm' : 
            'btn btn-outline-primary btn-sm';
    }
}

// DOCUMENT UPLOAD
function initializeDocumentUpload() {
    const uploadDocBtn = document.getElementById('uploadDocBtn');
    const uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));
    const uploadForm = document.getElementById('uploadForm');
    const uploadDocBtnModal = document.getElementById('uploadDocBtnModal');
    
    if (uploadDocBtn) {
        uploadDocBtn.addEventListener('click', function() {
            uploadModal.show();
        });
    }
    
    if (uploadDocBtnModal && uploadForm) {
        uploadDocBtnModal.addEventListener('click', function() {
            const docTitle = document.getElementById('docTitle').value;
            const docType = document.getElementById('docType').value;
            const docFile = document.getElementById('docFile').files[0];
            
            if (docTitle && docType && docFile) {
                // Simulate upload
                showToast('Document uploaded successfully!', 'success');
                uploadModal.hide();
                uploadForm.reset();
            } else {
                showToast('Please fill in all required fields', 'warning');
            }
        });
    }
}

// SCHEDULE EDITING
function initializeScheduleEditing() {
    const editScheduleBtn = document.getElementById('editScheduleBtn');
    const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    
    if (editScheduleBtn) {
        editScheduleBtn.addEventListener('click', function() {
            scheduleModal.show();
        });
    }
}

// SECURITY SETTINGS
function initializeSecuritySettings() {
    const passwordForm = document.getElementById('passwordForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showToast('Passwords do not match!', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showToast('Password must be at least 8 characters long!', 'warning');
                return;
            }
            
            showToast('Password updated successfully!', 'success');
            passwordForm.reset();
        });
    }
    
    // Two-factor authentication toggles
    const authToggles = document.querySelectorAll('[id$="Auth"]');
    authToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const authType = this.id.replace('Auth', '');
            const status = this.checked ? 'enabled' : 'disabled';
            showToast(`${authType.toUpperCase()} authentication ${status}!`, 'info');
        });
    });
}

// STATS ANIMATION
function animateStats() {
    const stats = [
        { element: document.querySelector('.stat-content h4'), target: 247 },
        { element: document.querySelectorAll('.stat-content h4')[1], target: 156 },
        { element: document.querySelectorAll('.stat-content h4')[2], target: 4.8 },
        { element: document.querySelectorAll('.stat-content h4')[3], target: 98 }
    ];
    
    stats.forEach((stat, index) => {
        if (stat.element) {
            let current = 0;
            const increment = stat.target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    stat.element.textContent = index === 2 ? stat.target.toFixed(1) : Math.round(stat.target);
                    clearInterval(timer);
                } else {
                    stat.element.textContent = index === 2 ? current.toFixed(1) : Math.round(current);
                }
            }, 40);
        }
    });
}

// GLOBAL FUNCTIONS FOR QUICK ACTIONS
window.updateAvailability = function() {
    showToast('Opening availability settings...', 'info');
    // Trigger schedule tab
    const scheduleTab = document.getElementById('schedule-tab');
    if (scheduleTab) {
        scheduleTab.click();
    }
};

window.requestLeave = function() {
    showToast('Opening leave request form...', 'info');
    // Here you could open a modal or redirect to leave request page
};

window.viewFeedback = function() {
    showToast('Loading patient feedback...', 'info');
    // Here you could load feedback data
};

window.updateProfile = function() {
    showToast('Switching to edit mode...', 'info');
    // Trigger personal info tab and edit mode
    const personalTab = document.getElementById('personal-tab');
    const editBtn = document.getElementById('editPersonalBtn');
    if (personalTab && editBtn) {
        personalTab.click();
        setTimeout(() => editBtn.click(), 300);
    }
};

// PROFILE HEADER ACTIONS
window.editProfile = function() {
    const personalTab = document.getElementById('personal-tab');
    if (personalTab) {
        personalTab.click();
    }
};

window.downloadCV = function() {
    showToast('Generating CV PDF...', 'info');
    // Simulate CV download
    setTimeout(() => {
        showToast('CV downloaded successfully!', 'success');
    }, 2000);
};

console.log('✅ Doctor Profile page initialized successfully!');
