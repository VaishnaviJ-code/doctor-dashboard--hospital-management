// Doctor Dashboard JavaScript - FULLY WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Dashboard...');
    
    // Wait for all elements to be available
    setTimeout(() => {
        initializeDashboard();
    }, 100);
    
    function initializeDashboard() {
        // Get all required elements with error checking
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        console.log('Elements found:', {
            sidebar: !!sidebar,
            sidebarToggle: !!sidebarToggle,
            sidebarBackdrop: !!sidebarBackdrop,
            themeToggle: !!themeToggle,
            themeIcon: !!themeIcon
        });
        
        // Global state
        let sidebarOpen = false;
        let currentTheme = 'light';
        
        // FIXED: Theme Toggle Function
        function toggleTheme() {
            console.log('🌓 Theme toggle clicked!');
            
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Set the new theme
            html.setAttribute('data-theme', newTheme);
            
            // Update icon
            if (themeIcon) {
                if (newTheme === 'dark') {
                    themeIcon.className = 'fas fa-sun';
                } else {
                    themeIcon.className = 'fas fa-moon';
                }
            }
            
            // Save preference
            localStorage.setItem('medicare-doctor-theme', newTheme);
            
            // Show success message
            showToast(`Switched to ${newTheme} mode`, 'success');
            
            console.log('✅ Theme switched to:', newTheme);
        }
        
        // FIXED: Hamburger Menu Functions
        function toggleSidebar() {
            console.log('🍔 Hamburger clicked! Screen width:', window.innerWidth);
            
            if (window.innerWidth <= 768) {
                // Mobile behavior
                if (sidebarOpen) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            } else {
                // Desktop behavior
                if (sidebar) {
                    sidebar.classList.toggle('collapsed');
                    const isCollapsed = sidebar.classList.contains('collapsed');
                    localStorage.setItem('medicare-sidebar-collapsed', isCollapsed);
                    console.log('💻 Desktop sidebar toggled, collapsed:', isCollapsed);
                }
            }
        }
        
        function openSidebar() {
            console.log('📱 Opening mobile sidebar...');
            
            if (sidebar && sidebarBackdrop) {
                // Add classes for mobile sidebar
                sidebar.classList.add('show', 'active');
                sidebarBackdrop.classList.add('show', 'active');
                document.body.classList.add('sidebar-open');
                
                // Force position for stubborn browsers
                sidebar.style.left = '0px';
                sidebar.style.transform = 'translateX(0)';
                
                sidebarOpen = true;
                console.log('✅ Mobile sidebar opened');
            }
        }
        
        function closeSidebar() {
            console.log('❌ Closing mobile sidebar...');
            
            if (sidebar && sidebarBackdrop) {
                sidebar.classList.remove('show', 'active');
                sidebarBackdrop.classList.remove('show', 'active');
                document.body.classList.remove('sidebar-open');
                
                // Reset position after animation
                setTimeout(() => {
                    if (sidebar) {
                        sidebar.style.left = '';
                        sidebar.style.transform = '';
                    }
                }, 300);
                
                sidebarOpen = false;
                console.log('✅ Mobile sidebar closed');
            }
        }
        
        // FIXED: Event Listeners with proper error handling
        if (themeToggle) {
            // Remove any existing listeners
            themeToggle.removeEventListener('click', toggleTheme);
            
            // Add new listener
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Theme button clicked directly');
                toggleTheme();
            });
            
            console.log('✅ Theme toggle listener attached');
        } else {
            console.error('❌ Theme toggle button not found!');
        }
        
        if (sidebarToggle) {
            // Remove any existing listeners
            sidebarToggle.removeEventListener('click', toggleSidebar);
            
            // Add new listener
            sidebarToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Hamburger button clicked directly');
                toggleSidebar();
            });
            
            console.log('✅ Sidebar toggle listener attached');
        } else {
            console.error('❌ Sidebar toggle button not found!');
        }
        
        // Backdrop click handler
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🎭 Backdrop clicked');
                closeSidebar();
            });
            console.log('✅ Backdrop listener attached');
        }
        
        // Window resize handler
        window.addEventListener('resize', function() {
            console.log('📱 Window resized to:', window.innerWidth);
            
            if (window.innerWidth > 768) {
                // Close mobile sidebar when switching to desktop
                closeSidebar();
                
                // Restore desktop sidebar state
                const isCollapsed = localStorage.getItem('medicare-sidebar-collapsed') === 'true';
                if (sidebar) {
                    if (isCollapsed) {
                        sidebar.classList.add('collapsed');
                    } else {
                        sidebar.classList.remove('collapsed');
                    }
                    sidebar.style.left = '';
                    sidebar.style.transform = '';
                }
            }
        });
        
        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebarOpen && window.innerWidth <= 768) {
                closeSidebar();
            }
        });
        
        // Initialize theme on load
        function initializeTheme() {
            const savedTheme = localStorage.getItem('medicare-doctor-theme');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (systemDark ? 'dark' : 'light');
            
            document.documentElement.setAttribute('data-theme', theme);
            
            if (themeIcon) {
                if (theme === 'dark') {
                    themeIcon.className = 'fas fa-sun';
                } else {
                    themeIcon.className = 'fas fa-moon';
                }
            }
            
            console.log('🎨 Theme initialized:', theme);
        }
        
        // Initialize sidebar state
        function initializeSidebar() {
            if (window.innerWidth <= 768) {
                // Mobile: ensure sidebar is hidden
                if (sidebar) {
                    sidebar.classList.remove('show', 'active');
                    sidebar.style.left = '-280px';
                }
                if (sidebarBackdrop) {
                    sidebarBackdrop.classList.remove('show', 'active');
                }
                document.body.classList.remove('sidebar-open');
                sidebarOpen = false;
            } else {
                // Desktop: restore collapsed state
                const isCollapsed = localStorage.getItem('medicare-sidebar-collapsed') === 'true';
                if (sidebar && isCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
            
            console.log('🏗️ Sidebar initialized');
        }
        
        // Toast notification function
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : '#17a2b8'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 9999;
                font-family: 'Poppins', sans-serif;
                font-size: 14px;
                transform: translateY(-100px);
                opacity: 0;
                transition: all 0.3s ease;
            `;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.transform = 'translateY(0)';
                toast.style.opacity = '1';
            }, 100);
            
            setTimeout(() => {
                toast.style.transform = 'translateY(-100px)';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        
        // Initialize everything
        initializeTheme();
        initializeSidebar();
        
        // Load demo data and other dashboard content
        loadDashboardData();
        updateDateAndGreeting();
        
        console.log('🎉 Dashboard fully initialized!');
        
        // Test buttons after initialization
        setTimeout(() => {
            console.log('🔍 Testing button availability...');
            console.log('Theme toggle exists:', !!document.getElementById('themeToggle'));
            console.log('Sidebar toggle exists:', !!document.getElementById('sidebarToggle'));
        }, 500);
    }
    
    // Additional helper functions (keeping from your original code)
    function loadDashboardData() {
        // Demo data loading
        const demoData = {
            appointments: [
                { id: 1, time: '9:00 AM', patient: 'Ananya Menon', patientId: 'P001234', type: 'Consultation', status: 'confirmed', avatar: 'AM' },
                { id: 2, time: '10:30 AM', patient: 'Ravi Kumar', patientId: 'P001235', type: 'Follow-up', status: 'urgent', avatar: 'RK' },
                { id: 3, time: '2:00 PM', patient: 'Priya Sharma', patientId: 'P001236', type: 'Check-up', status: 'pending', avatar: 'PS' }
            ],
            stats: {
                todayAppointments: 12,
                activePatients: 247,
                pendingResults: 5,
                urgentCases: 3
            }
        };
        
        // Update stats with animation
        Object.keys(demoData.stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                animateCounter(element, demoData.stats[key]);
            }
        });
        
        // Load appointments table
        const tbody = document.getElementById('appointmentsTableBody');
        if (tbody) {
            tbody.innerHTML = '';
            demoData.appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="appointment-time">${appointment.time}</td>
                    <td>
                        <div class="patient-info">
                            <div class="patient-avatar">${appointment.avatar}</div>
                            <div class="patient-details">
                                <h6>${appointment.patient}</h6>
                                <span>ID: ${appointment.patientId}</span>
                            </div>
                        </div>
                    </td>
                    <td>${appointment.type}</td>
                    <td><span class="status-badge ${appointment.status}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewPatient('${appointment.patientId}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    function animateCounter(element, targetValue) {
        let currentValue = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 20);
    }
    
    function updateDateAndGreeting() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        const currentDate = document.getElementById('currentDate');
        const greetingTime = document.getElementById('greetingTime');
        
        if (currentDate) {
            currentDate.textContent = now.toLocaleDateString('en-US', options);
        }
        
        if (greetingTime) {
            const hour = now.getHours();
            let greeting = 'Morning';
            if (hour >= 12 && hour < 17) greeting = 'Afternoon';
            else if (hour >= 17) greeting = 'Evening';
            greetingTime.textContent = greeting;
        }
    }
});

// Global functions for HTML onclick events
window.openNewPrescription = function() {
    console.log('💊 Opening prescription module...');
};

window.scheduleAppointment = function() {
    console.log('📅 Opening appointment scheduler...');
};

window.viewLabResults = function() {
    console.log('🧪 Loading lab results...');
};

window.emergencyProtocol = function() {
    console.log('🚨 Activating emergency protocol...');
};

window.viewPatient = function(patientId) {
    console.log('👤 Loading patient record:', patientId);
};

window.markAllAsRead = function() {
    console.log('✅ Marking all notifications as read...');
    const badges = document.querySelectorAll('.notification-badge');
    badges.forEach(badge => {
        badge.textContent = '0';
        badge.style.display = 'none';
    });
};

// Add this to ALL your page JavaScript files
// Listen for theme changes from other pages
window.addEventListener('storage', function(e) {
    if (e.key === 'medicare-doctor-theme') {
        console.log('🌍 Theme changed in another tab/page:', e.newValue);
        
        // Apply the new theme immediately
        const newTheme = e.newValue || 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update theme icon if it exists
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Force sidebar theme consistency
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            const navLinks = sidebar.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (newTheme === 'dark') {
                    if (link.classList.contains('active')) {
                        link.style.color = '#4dd0e1';
                    } else {
                        link.style.color = '#b0bec5';
                    }
                } else {
                    if (link.classList.contains('active')) {
                        link.style.color = '#43a047';
                    } else {
                        link.style.color = '#7f8c8d';
                    }
                }
            });
        }
        
        console.log('✅ Theme synchronized across pages');
    }
});
