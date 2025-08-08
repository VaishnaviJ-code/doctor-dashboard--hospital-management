// Prescriptions Page - OPTIMIZED VERSION
console.log('🚀 Loading Prescriptions Page...');

// Global variables
let sidebarOpen = false;
let currentTheme = localStorage.getItem('medicare-doctor-theme') || 'light';

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
    
    // EVENT LISTENERS - Single, clean approach
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
            // Restore desktop collapsed state
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
        
        // Set today's date
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.value = new Date().toISOString().split('T')[0];
        }
        
        // Load demo data
        loadDemoData();
        
        console.log('✅ Page initialized successfully');
        showToast('Prescriptions page loaded!', 'success');
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
    
    // Demo data function
    function loadDemoData() {
        // Animate stats
        const stats = [
            { id: 'totalPrescriptions', value: 156 },
            { id: 'todayPrescriptions', value: 8 },
            { id: 'pendingPrescriptions', value: 3 },
            { id: 'savedTemplates', value: 12 }
        ];
        
        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (element) {
                let current = 0;
                const timer = setInterval(() => {
                    current += Math.ceil(stat.value / 20);
                    if (current >= stat.value) {
                        element.textContent = stat.value;
                        clearInterval(timer);
                    } else {
                        element.textContent = current;
                    }
                }, 50);
            }
        });
    }
    
    // Make functions global
    window.showToast = showToast;
    
    // Initialize everything
    initializePage();
}

// Global functions for quick actions
window.createNewPrescription = function() {
    console.log('💊 Creating prescription...');
    window.showToast && window.showToast('Opening prescription form...', 'info');
};

window.useTemplate = function() {
    console.log('📋 Using template...');
    window.showToast && window.showToast('Loading templates...', 'info');
};

window.viewPendingPrescriptions = function() {
    console.log('⏳ Viewing pending...');
    window.showToast && window.showToast('Filtering pending prescriptions...', 'info');
};

window.manageTemplates = function() {
    console.log('🔧 Managing templates...');
    window.showToast && window.showToast('Opening template manager...', 'info');
};

window.viewPrescription = function(id) {
    console.log('👁️ Viewing:', id);
    window.showToast && window.showToast(`Loading prescription ${id}...`, 'info');
};

window.editPrescription = function(id) {
    console.log('✏️ Editing:', id);
    window.showToast && window.showToast(`Opening editor for ${id}...`, 'info');
};
