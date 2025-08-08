// Appointments Page JavaScript - FULLY WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Appointments Page...');
    
    // Wait for all elements to be available
    setTimeout(() => {
        initializeAppointmentsPage();
    }, 100);
    
    function initializeAppointmentsPage() {
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
        let currentView = 'list';
        
        // Demo appointments data
        const appointmentsData = [
            {
                id: 1,
                time: '09:00 AM',
                patient: 'Mr. Rohan Sharma',
                patientId: 'P001234',
                type: 'Consultation',
                status: 'upcoming',
                priority: 'critical',
                date: new Date().toISOString().split('T')[0]
            },
            {
                id: 2,
                time: '10:30 AM',
                patient: 'Mrs. Neha Kapoor',
                patientId: 'P001235',
                type: 'Follow-up',
                status: 'completed',
                priority: 'normal',
                date: new Date().toISOString().split('T')[0]
            },
            {
                id: 3,
                time: '02:00 PM',
                patient: 'Mr. Anil Verma',
                patientId: 'P001236',
                type: 'Telehealth',
                status: 'cancelled',
                priority: 'urgent',
                date: new Date().toISOString().split('T')[0]
            },
            {
                id: 4,
                time: '03:30 PM',
                patient: 'Ms. Priya Singh',
                patientId: 'P001237',
                type: 'Surgery',
                status: 'upcoming',
                priority: 'critical',
                date: new Date().toISOString().split('T')[0]
            }
        ];
        
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
                sidebar.classList.add('show', 'active');
                sidebarBackdrop.classList.add('show', 'active');
                document.body.classList.add('sidebar-open');
                
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
        
        // View Management Functions
        function switchView(viewType) {
            console.log('🔄 Switching to view:', viewType);
            
            // Hide all view containers
            const viewContainers = document.querySelectorAll('.view-container');
            viewContainers.forEach(container => container.classList.remove('active'));
            
            // Show selected view
            const targetView = document.getElementById(viewType + 'View');
            if (targetView) {
                targetView.classList.add('active');
            }
            
            // Update view controls
            const viewButtons = document.querySelectorAll('[data-view]');
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            const activeButton = document.querySelector(`[data-view="${viewType}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
            
            currentView = viewType;
            
            // Load view-specific data
            loadViewData(viewType);
        }
        
        function loadViewData(viewType) {
            switch(viewType) {
                case 'list':
                    loadAppointmentsList();
                    break;
                case 'day':
                    loadDayView();
                    break;
                case 'week':
                    loadWeekView();
                    break;
                case 'month':
                    loadMonthView();
                    break;
            }
        }
        
        function loadAppointmentsList() {
            const tbody = document.getElementById('appointmentsTableBody');
            if (!tbody) return;
            
            tbody.innerHTML = '';
            
            appointmentsData.forEach(appointment => {
                const row = document.createElement('tr');
                
                const statusClass = {
                    'upcoming': 'bg-warning',
                    'completed': 'bg-success',
                    'cancelled': 'bg-danger',
                    'missed': 'bg-secondary'
                };
                
                const priorityClass = {
                    'critical': 'bg-danger',
                    'urgent': 'bg-warning',
                    'normal': 'bg-secondary'
                };
                
                row.innerHTML = `
                    <td>${appointment.time}</td>
                    <td>${appointment.patient}</td>
                    <td class="d-none d-md-table-cell">${appointment.type}</td>
                    <td><span class="badge ${statusClass[appointment.status]}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span></td>
                    <td class="d-none d-lg-table-cell"><span class="badge ${priorityClass[appointment.priority]}">${appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)}</span></td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewAppointment(${appointment.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editAppointment(${appointment.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            console.log('✅ Appointments list loaded');
        }
        
        function loadDayView() {
            const daySchedule = document.getElementById('daySchedule');
            const selectedDateElement = document.getElementById('selectedDate');
            
            if (daySchedule && selectedDateElement) {
                const today = new Date();
                selectedDateElement.textContent = today.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                daySchedule.innerHTML = `
                    <div class="day-appointments">
                        <div class="time-slot">
                            <div class="time-label">09:00 AM</div>
                            <div class="appointment-card">
                                <h6>Mr. Rohan Sharma</h6>
                                <p>Consultation - Critical Priority</p>
                                <span class="badge bg-warning">Upcoming</span>
                            </div>
                        </div>
                        <div class="time-slot">
                            <div class="time-label">10:30 AM</div>
                            <div class="appointment-card">
                                <h6>Mrs. Neha Kapoor</h6>
                                <p>Follow-up - Normal Priority</p>
                                <span class="badge bg-success">Completed</span>
                            </div>
                        </div>
                        <div class="time-slot">
                            <div class="time-label">02:00 PM</div>
                            <div class="appointment-card">
                                <h6>Mr. Anil Verma</h6>
                                <p>Telehealth - Urgent Priority</p>
                                <span class="badge bg-danger">Cancelled</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        function loadWeekView() {
            const weekCalendar = document.getElementById('weekCalendar');
            if (weekCalendar) {
                weekCalendar.innerHTML = `
                    <div class="week-grid">
                        <div class="week-header">
                            <div class="day-header">Mon</div>
                            <div class="day-header">Tue</div>
                            <div class="day-header">Wed</div>
                            <div class="day-header">Thu</div>
                            <div class="day-header">Fri</div>
                            <div class="day-header">Sat</div>
                            <div class="day-header">Sun</div>
                        </div>
                        <div class="week-body">
                            <div class="week-day">
                                <div class="appointment-mini">09:00 - Rohan S.</div>
                            </div>
                            <div class="week-day">
                                <div class="appointment-mini">10:30 - Neha K.</div>
                                <div class="appointment-mini">02:00 - Anil V.</div>
                            </div>
                            <div class="week-day"></div>
                            <div class="week-day">
                                <div class="appointment-mini">03:30 - Priya S.</div>
                            </div>
                            <div class="week-day"></div>
                            <div class="week-day"></div>
                            <div class="week-day"></div>
                        </div>
                    </div>
                `;
            }
        }
        
        function loadMonthView() {
            const monthCalendar = document.getElementById('monthCalendar');
            if (monthCalendar) {
                monthCalendar.innerHTML = `
                    <div class="month-calendar-grid">
                        <div class="calendar-header">
                            <div class="day-name">Sun</div>
                            <div class="day-name">Mon</div>
                            <div class="day-name">Tue</div>
                            <div class="day-name">Wed</div>
                            <div class="day-name">Thu</div>
                            <div class="day-name">Fri</div>
                            <div class="day-name">Sat</div>
                        </div>
                        <div class="calendar-body">
                            ${generateMonthDays()}
                        </div>
                    </div>
                `;
            }
        }
        
        function generateMonthDays() {
            const today = new Date();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
            
            let daysHTML = '';
            
            // Empty cells for days before month starts
            for (let i = 0; i < firstDay; i++) {
                daysHTML += '<div class="calendar-day empty"></div>';
            }
            
            // Days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = day === today.getDate();
                const hasAppointments = [1, 2, 15, 20, 25].includes(day); // Sample days with appointments
                
                daysHTML += `
                    <div class="calendar-day ${isToday ? 'today' : ''} ${hasAppointments ? 'has-appointments' : ''}">
                        <span class="day-number">${day}</span>
                        ${hasAppointments ? '<div class="appointment-indicator"></div>' : ''}
                    </div>
                `;
            }
            
            return daysHTML;
        }
        
        // Filter Functions
        function applyFilters() {
            const dateFilter = document.getElementById('dateFilter')?.value || '';
            const statusFilter = document.getElementById('statusFilter')?.value || '';
            const typeFilter = document.getElementById('typeFilter')?.value || '';
            const priorityFilter = document.getElementById('priorityFilter')?.value || '';
            
            console.log('🔍 Applying filters:', { dateFilter, statusFilter, typeFilter, priorityFilter });
            
            // Apply filters to current view
            if (currentView === 'list') {
                loadAppointmentsList(); // Reload with filters (in real app, would filter data)
            }
            
            showToast('Filters applied successfully', 'success');
        }
        
        function resetFilters() {
            document.getElementById('dateFilter').value = '';
            document.getElementById('statusFilter').value = '';
            document.getElementById('typeFilter').value = '';
            document.getElementById('priorityFilter').value = '';
            
            loadViewData(currentView);
            showToast('Filters reset', 'info');
        }
        
        // Stats Update Function
        function updateStats() {
            const stats = {
                upcoming: appointmentsData.filter(apt => apt.status === 'upcoming').length,
                completed: appointmentsData.filter(apt => apt.status === 'completed').length,
                cancelled: appointmentsData.filter(apt => apt.status === 'cancelled').length,
                total: appointmentsData.length
            };
            
            animateCounter(document.getElementById('upcomingCount'), stats.upcoming);
            animateCounter(document.getElementById('completedCount'), stats.completed);
            animateCounter(document.getElementById('cancelledCount'), stats.cancelled);
            animateCounter(document.getElementById('totalCount'), stats.total);
        }
        
        function animateCounter(element, targetValue) {
            if (!element) return;
            
            let currentValue = 0;
            const increment = Math.ceil(targetValue / 20);
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    element.textContent = targetValue;
                    clearInterval(timer);
                } else {
                    element.textContent = currentValue;
                }
            }, 50);
        }
        
        // FIXED: Event Listeners
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
            });
            console.log('✅ Theme toggle listener attached');
        }
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
            });
            console.log('✅ Sidebar toggle listener attached');
        }
        
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', closeSidebar);
        }
        
        // View control buttons
        const viewButtons = document.querySelectorAll('[data-view]');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const viewType = this.getAttribute('data-view');
                switchView(viewType);
            });
        });
        
        // Filter controls
        const filterElements = ['dateFilter', 'statusFilter', 'typeFilter', 'priorityFilter'];
        filterElements.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', applyFilters);
            }
        });
        
        // Reset filters button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                showToast('Export functionality coming soon!', 'info');
            });
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                loadViewData(currentView);
                showToast('Data refreshed', 'success');
            });
        }
        
        // Window resize handler
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeSidebar();
                const isCollapsed = localStorage.getItem('medicare-sidebar-collapsed') === 'true';
                if (sidebar && isCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
        });
        
        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebarOpen && window.innerWidth <= 768) {
                closeSidebar();
            }
        });
        
        // Initialize functions
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
        
        function initializeSidebar() {
            if (window.innerWidth <= 768) {
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
                const isCollapsed = localStorage.getItem('medicare-sidebar-collapsed') === 'true';
                if (sidebar && isCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
        }
        
        // Toast notification function
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
                color: ${type === 'warning' ? '#333' : 'white'};
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
        loadViewData('list');
        updateStats();
        
        // Set today's date as default filter
        const today = new Date().toISOString().split('T')[0];
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.value = today;
        }
        
        console.log('🎉 Appointments page fully initialized!');
        
        // Make showToast globally available
        window.showToast = showToast;
    }
});

// Global functions for HTML onclick events
window.viewAppointment = function(appointmentId) {
    console.log('👁️ Viewing appointment:', appointmentId);
    window.showToast(`Loading appointment ${appointmentId} details...`, 'info');
};

window.editAppointment = function(appointmentId) {
    console.log('✏️ Editing appointment:', appointmentId);
    window.showToast(`Opening editor for appointment ${appointmentId}...`, 'info');
};

window.deleteAppointment = function(appointmentId) {
    console.log('🗑️ Deleting appointment:', appointmentId);
    if (confirm('Are you sure you want to delete this appointment?')) {
        window.showToast(`Appointment ${appointmentId} deleted successfully`, 'success');
    }
};

window.rescheduleAppointment = function(appointmentId) {
    console.log('📅 Rescheduling appointment:', appointmentId);
    window.showToast(`Opening reschedule dialog for appointment ${appointmentId}...`, 'info');
};

// Add this function to your appointments.js file
function ensureSidebarTheme() {
    const sidebar = document.getElementById('sidebar');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    if (sidebar) {
        // Force theme application to sidebar
        sidebar.setAttribute('data-theme', currentTheme);
        
        // Update all nav links
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.setAttribute('data-theme', currentTheme);
        });
    }
}

// Call this function in your theme toggle function
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
    
    // ADDED: Ensure sidebar theme consistency
    ensureSidebarTheme();
    
    // Show success message
    showToast(`Switched to ${newTheme} mode`, 'success');
    
    console.log('✅ Theme switched to:', newTheme);
}

// Also call it during initialization
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
    
    // ADDED: Ensure sidebar theme consistency
    ensureSidebarTheme();
    
    console.log('🎨 Theme initialized:', theme);
}

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
