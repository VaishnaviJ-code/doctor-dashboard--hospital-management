// Lab Results Page - Complete Functionality
console.log('🚀 Loading Lab Results Page...');

// Global variables
let sidebarOpen = false;
let currentTheme = localStorage.getItem('medicare-doctor-theme') || 'light';
let currentView = 'table';
let selectedResults = new Set();
let currentFilter = {
    patient: '',
    dateFrom: '',
    dateTo: '',
    testType: '',
    status: '',
    tab: 'all'
};

// Sample data
const sampleResults = [
    {
        id: 'LAB001',
        patientId: 'P001',
        patientName: 'John Smith',
        patientAge: 45,
        patientGender: 'Male',
        testType: 'blood',
        testName: 'Complete Blood Count (CBC)',
        dateOrdered: '2024-01-15',
        dateCompleted: '2024-01-16',
        status: 'normal',
        orderedBy: 'Dr. Rajesh Kumar',
        lab: 'Central Lab',
        values: [
            { parameter: 'Hemoglobin', result: '14.5', normalRange: '12.0-16.0', unit: 'g/dL', status: 'normal' },
            { parameter: 'WBC Count', result: '7200', normalRange: '4000-11000', unit: '/μL', status: 'normal' },
            { parameter: 'Platelet Count', result: '280000', normalRange: '150000-450000', unit: '/μL', status: 'normal' }
        ],
        attachments: [
            { name: 'CBC_Report.pdf', type: 'pdf', size: '245 KB' }
        ],
        notes: 'All values within normal limits. Patient is healthy.',
        trend: [
            { date: '2024-01-01', value: 14.2 },
            { date: '2024-01-16', value: 14.5 }
        ]
    },
    {
        id: 'LAB002',
        patientId: 'P002',
        patientName: 'Sarah Johnson',
        patientAge: 32,
        patientGender: 'Female',
        testType: 'blood',
        testName: 'Lipid Profile',
        dateOrdered: '2024-01-14',
        dateCompleted: '2024-01-15',
        status: 'abnormal',
        orderedBy: 'Dr. Rajesh Kumar',
        lab: 'Central Lab',
        values: [
            { parameter: 'Total Cholesterol', result: '265', normalRange: '<200', unit: 'mg/dL', status: 'abnormal' },
            { parameter: 'HDL Cholesterol', result: '35', normalRange: '>40', unit: 'mg/dL', status: 'abnormal' },
            { parameter: 'LDL Cholesterol', result: '180', normalRange: '<100', unit: 'mg/dL', status: 'abnormal' }
        ],
        attachments: [
            { name: 'Lipid_Profile.pdf', type: 'pdf', size: '198 KB' }
        ],
        notes: 'Elevated cholesterol levels. Recommend dietary changes and follow-up in 3 months.',
        trend: [
            { date: '2023-12-01', value: 240 },
            { date: '2024-01-15', value: 265 }
        ]
    },
    {
        id: 'LAB003',
        patientId: 'P003',
        patientName: 'Michael Davis',
        patientAge: 28,
        patientGender: 'Male',
        testType: 'urine',
        testName: 'Urinalysis',
        dateOrdered: '2024-01-13',
        dateCompleted: '2024-01-14',
        status: 'pending',
        orderedBy: 'Dr. Rajesh Kumar',
        lab: 'Central Lab',
        values: [],
        attachments: [],
        notes: '',
        trend: []
    },
    {
        id: 'LAB004',
        patientId: 'P004',
        patientName: 'Emily Wilson',
        patientAge: 55,
        patientGender: 'Female',
        testType: 'xray',
        testName: 'Chest X-Ray',
        dateOrdered: '2024-01-12',
        dateCompleted: '2024-01-13',
        status: 'normal',
        orderedBy: 'Dr. Rajesh Kumar',
        lab: 'Imaging Center',
        values: [
            { parameter: 'Lung Fields', result: 'Clear', normalRange: 'Clear', unit: '', status: 'normal' },
            { parameter: 'Heart Size', result: 'Normal', normalRange: 'Normal', unit: '', status: 'normal' },
            { parameter: 'Bone Structure', result: 'Intact', normalRange: 'Intact', unit: '', status: 'normal' }
        ],
        attachments: [
            { name: 'Chest_XRay.jpg', type: 'image', size: '1.2 MB' },
            { name: 'Radiology_Report.pdf', type: 'pdf', size: '156 KB' }
        ],
        notes: 'No acute cardiopulmonary abnormalities detected.',
        trend: []
    },
    {
        id: 'LAB005',
        patientId: 'P005',
        patientName: 'Robert Brown',
        patientAge: 62,
        patientGender: 'Male',
        testType: 'blood',
        testName: 'HbA1c Test',
        dateOrdered: '2024-01-11',
        dateCompleted: '2024-01-12',
        status: 'abnormal',
        orderedBy: 'Dr. Rajesh Kumar',
        lab: 'Central Lab',
        values: [
            { parameter: 'HbA1c', result: '8.2', normalRange: '<7.0', unit: '%', status: 'abnormal' },
            { parameter: 'Glucose', result: '185', normalRange: '70-100', unit: 'mg/dL', status: 'abnormal' }
        ],
        attachments: [
            { name: 'HbA1c_Report.pdf', type: 'pdf', size: '178 KB' }
        ],
        notes: 'Diabetes poorly controlled. Adjust medication and lifestyle counseling needed.',
        trend: [
            { date: '2023-10-01', value: 7.8 },
            { date: '2023-12-01', value: 8.0 },
            { date: '2024-01-12', value: 8.2 }
        ]
    }
];

let trendChart = null;

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
    
    // LAB RESULTS SPECIFIC FUNCTIONALITY
    initializeLabResultsFeatures();
    
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
        const dateToInput = document.getElementById('dateTo');
        if (dateToInput) {
            dateToInput.value = new Date().toISOString().split('T')[0];
        }
        
        // Load results data
        loadResultsData();
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 1000);
        }
        
        console.log('✅ Page initialized successfully');
        showToast('Lab Results page loaded!', 'success');
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

// LAB RESULTS SPECIFIC FEATURES
function initializeLabResultsFeatures() {
    console.log('🧪 Initializing lab results features...');
    
    // View toggle
    initializeViewToggle();
    
    // Filters
    initializeFilters();
    
    // Selection functionality
    initializeSelection();
    
    // Modal functionality
    initializeModal();
    
    // Bulk actions
    initializeBulkActions();
    
    // Tab functionality
    initializeTabs();
    
    // Search functionality
    initializeSearch();
    
    // Refresh functionality
    initializeRefresh();
}

// VIEW TOGGLE
function initializeViewToggle() {
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    
    if (tableViewBtn && cardViewBtn) {
        tableViewBtn.addEventListener('click', function() {
            currentView = 'table';
            tableViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
            if (tableView && cardView) {
                tableView.style.display = 'block';
                cardView.style.display = 'none';
            }
            showToast('Switched to table view', 'info');
        });
        
        cardViewBtn.addEventListener('click', function() {
            currentView = 'card';
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            if (tableView && cardView) {
                tableView.style.display = 'none';
                cardView.style.display = 'block';
            }
            loadCardView();
            showToast('Switched to card view', 'info');
        });
    }
}

// FILTERS
function initializeFilters() {
    const patientSearch = document.getElementById('patientSearch');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const testTypeFilter = document.getElementById('testTypeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            currentFilter = {
                patient: patientSearch?.value || '',
                dateFrom: dateFrom?.value || '',
                dateTo: dateTo?.value || '',
                testType: testTypeFilter?.value || '',
                status: statusFilter?.value || '',
                tab: currentFilter.tab
            };
            
            loadResultsData();
            showToast('Filters applied!', 'success');
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (patientSearch) patientSearch.value = '';
            if (dateFrom) dateFrom.value = '';
            if (dateTo) dateTo.value = '';
            if (testTypeFilter) testTypeFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            
            currentFilter = {
                patient: '',
                dateFrom: '',
                dateTo: '',
                testType: '',
                status: '',
                tab: currentFilter.tab
            };
            
            loadResultsData();
            showToast('Filters cleared!', 'info');
        });
    }
    
    // Real-time patient search
    if (patientSearch) {
        let searchTimeout;
        patientSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 2 || this.value.length === 0) {
                    currentFilter.patient = this.value;
                    loadResultsData();
                }
            }, 300);
        });
    }
}

// SELECTION FUNCTIONALITY
function initializeSelection() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.result-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                if (this.checked) {
                    selectedResults.add(checkbox.value);
                } else {
                    selectedResults.delete(checkbox.value);
                }
            });
            updateBulkSelectionHeader();
        });
    }
}

function updateBulkSelectionHeader() {
    const bulkSelectionHeader = document.getElementById('bulkSelectionHeader');
    const selectedCount = document.getElementById('selectedCount');
    
    if (bulkSelectionHeader && selectedCount) {
        if (selectedResults.size > 0) {
            bulkSelectionHeader.style.display = 'flex';
            selectedCount.textContent = selectedResults.size;
        } else {
            bulkSelectionHeader.style.display = 'none';
        }
    }
}

// MODAL FUNCTIONALITY
function initializeModal() {
    // Modal action buttons
    const printResultBtn = document.getElementById('printResultBtn');
    const shareResultBtn = document.getElementById('shareResultBtn');
    const approveResultBtn = document.getElementById('approveResultBtn');
    
    if (printResultBtn) {
        printResultBtn.addEventListener('click', function() {
            showToast('Preparing result for printing...', 'info');
            setTimeout(() => {
                window.print();
            }, 1000);
        });
    }
    
    if (shareResultBtn) {
        shareResultBtn.addEventListener('click', function() {
            showToast('Sharing result with patient...', 'info');
            // Simulate sharing process
            setTimeout(() => {
                showToast('Result shared successfully!', 'success');
            }, 2000);
        });
    }
    
    if (approveResultBtn) {
        approveResultBtn.addEventListener('click', function() {
            showToast('Result approved and signed!', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('resultDetailModal'));
            modal.hide();
        });
    }
}

// BULK ACTIONS
function initializeBulkActions() {
    const bulkApproveBtn = document.getElementById('bulkApproveBtn');
    const bulkNotifyBtn = document.getElementById('bulkNotifyBtn');
    const bulkExportBtn = document.getElementById('bulkExportBtn');
    const exportResultsBtn = document.getElementById('exportResultsBtn');
    const bulkActionsBtn = document.getElementById('bulkActionsBtn');
    
    if (bulkApproveBtn) {
        bulkApproveBtn.addEventListener('click', function() {
            if (selectedResults.size > 0) {
                showToast(`Approved ${selectedResults.size} results!`, 'success');
                selectedResults.clear();
                updateBulkSelectionHeader();
                loadResultsData(); // Refresh data
            }
        });
    }
    
    if (bulkNotifyBtn) {
        bulkNotifyBtn.addEventListener('click', function() {
            if (selectedResults.size > 0) {
                showToast(`Sending notifications for ${selectedResults.size} results...`, 'info');
                setTimeout(() => {
                    showToast(`Notifications sent successfully!`, 'success');
                }, 2000);
            }
        });
    }
    
    if (bulkExportBtn) {
        bulkExportBtn.addEventListener('click', function() {
            if (selectedResults.size > 0) {
                exportResults(Array.from(selectedResults));
            }
        });
    }
    
    if (exportResultsBtn) {
        exportResultsBtn.addEventListener('click', function() {
            showToast('Exporting all results...', 'info');
            exportResults();
        });
    }
    
    if (bulkActionsBtn) {
        bulkActionsBtn.addEventListener('click', function() {
            showToast('Bulk actions menu', 'info');
        });
    }
}

// TAB FUNCTIONALITY
function initializeTabs() {
    const tabs = document.querySelectorAll('[data-bs-toggle="pill"]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-bs-target');
            currentFilter.tab = target.replace('#', '').replace('-results', '');
            loadResultsData();
            
            // Update tab badges
            updateTabBadges();
        });
    });
}

// SEARCH FUNCTIONALITY
function initializeSearch() {
    const globalSearch = document.getElementById('globalSearch');
    
    if (globalSearch) {
        let searchTimeout;
        globalSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length >= 2 || searchTerm.length === 0) {
                    performGlobalSearch(searchTerm);
                }
            }, 300);
        });
    }
}

// REFRESH FUNCTIONALITY
function initializeRefresh() {
    const refreshResultsBtn = document.getElementById('refreshResultsBtn');
    
    if (refreshResultsBtn) {
        refreshResultsBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spin fa-spinner"></i> Refreshing...';
            this.disabled = true;
            
            setTimeout(() => {
                loadResultsData();
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
                this.disabled = false;
                showToast('Results refreshed!', 'success');
            }, 1500);
        });
    }
}

// PERFORM GLOBAL SEARCH
function performGlobalSearch(searchTerm) {
    if (!searchTerm) {
        loadResultsData();
        return;
    }
    
    const filteredResults = sampleResults.filter(result => 
        result.patientName.toLowerCase().includes(searchTerm) ||
        result.patientId.toLowerCase().includes(searchTerm) ||
        result.testName.toLowerCase().includes(searchTerm) ||
        result.testType.toLowerCase().includes(searchTerm)
    );
    
    loadTableView(filteredResults);
    if (currentView === 'card') {
        loadCardView(filteredResults);
    }
    updateCounts(filteredResults);
    showToast(`Found ${filteredResults.length} results`, 'info');
}

// LOAD RESULTS DATA
function loadResultsData() {
    console.log('📊 Loading results data...');
    
    // Filter sample data based on current filters
    let filteredResults = sampleResults.filter(result => {
        if (currentFilter.patient && !result.patientName.toLowerCase().includes(currentFilter.patient.toLowerCase()) && !result.patientId.toLowerCase().includes(currentFilter.patient.toLowerCase())) {
            return false;
        }
        if (currentFilter.testType && result.testType !== currentFilter.testType) {
            return false;
        }
        if (currentFilter.status && result.status !== currentFilter.status) {
            return false;
        }
        if (currentFilter.tab !== 'all' && currentFilter.tab !== 'history' && result.status !== currentFilter.tab) {
            return false;
        }
        if (currentFilter.dateFrom && result.dateCompleted && result.dateCompleted < currentFilter.dateFrom) {
            return false;
        }
        if (currentFilter.dateTo && result.dateCompleted && result.dateCompleted > currentFilter.dateTo) {
            return false;
        }
        return true;
    });
    
    // Update stats
    updateStats(filteredResults);
    
    // Load table view
    loadTableView(filteredResults);
    
    // If card view is active, load card view
    if (currentView === 'card') {
        loadCardView(filteredResults);
    }
    
    // Update counts
    updateCounts(filteredResults);
    
    // Update tab badges
    updateTabBadges();
}

// UPDATE STATS
function updateStats(results) {
    const totalResults = document.getElementById('totalResults');
    const pendingResults = document.getElementById('pendingResults');
    const abnormalResults = document.getElementById('abnormalResults');
    const todayResults = document.getElementById('todayResults');
    
    const today = new Date().toISOString().split('T')[0];
    
    if (totalResults) {
        animateCounter(totalResults, sampleResults.length);
    }
    
    if (pendingResults) {
        const pending = sampleResults.filter(r => r.status === 'pending').length;
        animateCounter(pendingResults, pending);
    }
    
    if (abnormalResults) {
        const abnormal = sampleResults.filter(r => r.status === 'abnormal').length;
        animateCounter(abnormalResults, abnormal);
    }
    
    if (todayResults) {
        const todayCount = sampleResults.filter(r => r.dateCompleted === today).length;
        animateCounter(todayResults, todayCount);
    }
}

// ANIMATE COUNTER
function animateCounter(element, target) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / 20;
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

// UPDATE TAB BADGES
function updateTabBadges() {
    const allTab = document.querySelector('#all-tab .badge');
    const pendingTab = document.querySelector('#pending-tab .badge');
    const abnormalTab = document.querySelector('#abnormal-tab .badge');
    
    if (allTab) allTab.textContent = sampleResults.length;
    if (pendingTab) pendingTab.textContent = sampleResults.filter(r => r.status === 'pending').length;
    if (abnormalTab) abnormalTab.textContent = sampleResults.filter(r => r.status === 'abnormal').length;
}

// LOAD TABLE VIEW
function loadTableView(results) {
    const tableBody = document.getElementById('resultsTableBody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (results.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" class="text-center py-4">
                <div class="empty-state">
                    <i class="fas fa-flask"></i>
                    <h4>No Results Found</h4>
                    <p>Try adjusting your filters or search criteria</p>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="form-check-input result-checkbox" value="${result.id}">
            </td>
            <td>
                <div class="patient-info">
                    <div class="patient-avatar-sm">
                        ${getPatientInitials(result.patientName)}
                    </div>
                    <div class="patient-details">
                        <h6><a href="#" onclick="openPatientProfile('${result.patientId}')">${result.patientName}</a></h6>
                        <span>ID: ${result.patientId} | ${result.patientAge}y, ${result.patientGender}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="test-type">
                    <div class="test-icon">
                        ${getTestIcon(result.testType)}
                    </div>
                    <div class="test-details">
                        <h6>${result.testName}</h6>
                        <span>${getTestTypeLabel(result.testType)}</span>
                    </div>
                </div>
            </td>
            <td>${formatDate(result.dateOrdered)}</td>
            <td>${result.dateCompleted ? formatDate(result.dateCompleted) : '-'}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(result.status)}">
                    ${getStatusIcon(result.status)} ${getStatusLabel(result.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewResult('${result.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="printResult('${result.id}')" title="Print Result">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="shareResult('${result.id}')" title="Share with Patient">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to checkboxes
    const checkboxes = tableBody.querySelectorAll('.result-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedResults.add(this.value);
            } else {
                selectedResults.delete(this.value);
            }
            updateBulkSelectionHeader();
        });
    });
}

// LOAD CARD VIEW
function loadCardView(results = sampleResults) {
    const cardGrid = document.getElementById('resultsGrid');
    
    if (!cardGrid) return;
    
    cardGrid.innerHTML = '';
    
    if (results.length === 0) {
        cardGrid.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-flask"></i>
                    <h4>No Results Found</h4>
                    <p>Try adjusting your filters or search criteria</p>
                </div>
            </div>
        `;
        return;
    }
    
    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <div class="result-card-header">
                <div class="result-card-patient">
                    <div class="patient-avatar-sm">
                        ${getPatientInitials(result.patientName)}
                    </div>
                    <div class="patient-details">
                        <h6>${result.patientName}</h6>
                        <span>${result.patientId} | ${result.patientAge}y</span>
                    </div>
                </div>
                <div class="result-card-status">
                    <span class="badge ${getStatusBadgeClass(result.status)}">
                        ${getStatusLabel(result.status)}
                    </span>
                </div>
            </div>
            <div class="result-card-body">
                <h6>${result.testName}</h6>
                <div class="result-card-meta">
                    <span><strong>Test Type:</strong> ${getTestTypeLabel(result.testType)}</span>
                    <span><strong>Lab:</strong> ${result.lab}</span>
                    <span><strong>Ordered:</strong> ${formatDate(result.dateOrdered)}</span>
                    <span><strong>Completed:</strong> ${result.dateCompleted ? formatDate(result.dateCompleted) : 'Pending'}</span>
                </div>
                ${result.notes ? `<p class="result-notes">${result.notes}</p>` : ''}
            </div>
            <div class="result-card-actions">
                <div class="form-check">
                    <input class="form-check-input result-checkbox" type="checkbox" value="${result.id}">
                    <label class="form-check-label">Select</label>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewResult('${result.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="printResult('${result.id}')" title="Print">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="shareResult('${result.id}')" title="Share">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `;
        
        cardGrid.appendChild(card);
    });
    
    // Add event listeners to checkboxes
    const checkboxes = cardGrid.querySelectorAll('.result-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedResults.add(this.value);
            } else {
                selectedResults.delete(this.value);
            }
            updateBulkSelectionHeader();
        });
    });
}

// UPDATE COUNTS
function updateCounts(results) {
    const currentCount = document.getElementById('currentCount');
    const totalCount = document.getElementById('totalCount');
    
    if (currentCount) currentCount.textContent = results.length;
    if (totalCount) totalCount.textContent = sampleResults.length;
}

// EXPORT RESULTS
function exportResults(selectedIds = null) {
    const resultsToExport = selectedIds ? 
        sampleResults.filter(r => selectedIds.includes(r.id)) : 
        sampleResults;
    
    // Create CSV content
    const csvHeaders = ['Patient Name', 'Patient ID', 'Test Name', 'Test Type', 'Date Ordered', 'Date Completed', 'Status', 'Lab'];
    const csvRows = resultsToExport.map(result => [
        result.patientName,
        result.patientId,
        result.testName,
        getTestTypeLabel(result.testType),
        result.dateOrdered,
        result.dateCompleted || 'Pending',
        getStatusLabel(result.status),
        result.lab
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lab_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Exported ${resultsToExport.length} results to CSV`, 'success');
}

// UTILITY FUNCTIONS
function getPatientInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getTestIcon(testType) {
    const icons = {
        blood: '🩸',
        urine: '💧',
        mri: '🧠',
        xray: '🦴',
        ct: '📹',
        ecg: '❤️',
        ultrasound: '👶'
    };
    return icons[testType] || '🧪';
}

function getTestTypeLabel(testType) {
    const labels = {
        blood: 'Blood Test',
        urine: 'Urine Test',
        mri: 'MRI Scan',
        xray: 'X-Ray',
        ct: 'CT Scan',
        ecg: 'ECG',
        ultrasound: 'Ultrasound'
    };
    return labels[testType] || 'Lab Test';
}

function getStatusBadgeClass(status) {
    const classes = {
        normal: 'bg-success',
        abnormal: 'bg-danger',
        pending: 'bg-warning',
        critical: 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}

function getStatusIcon(status) {
    const icons = {
        normal: '✅',
        abnormal: '⚠️',
        pending: '⏳',
        critical: '🚨'
    };
    return icons[status] || '';
}

function getStatusLabel(status) {
    const labels = {
        normal: 'Normal',
        abnormal: 'Abnormal',
        pending: 'Pending',
        critical: 'Critical'
    };
    return labels[status] || status;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getAttachmentIcon(type) {
    const icons = {
        pdf: 'fas fa-file-pdf',
        image: 'fas fa-file-image',
        doc: 'fas fa-file-word',
        default: 'fas fa-file'
    };
    return icons[type] || icons.default;
}

// GLOBAL FUNCTIONS FOR ACTIONS
window.viewResult = function(resultId) {
    const result = sampleResults.find(r => r.id === resultId);
    if (result) {
        openResultModal(result);
    }
};

window.printResult = function(resultId) {
    const result = sampleResults.find(r => r.id === resultId);
    if (result) {
        showToast(`Printing result for ${result.patientName}...`, 'info');
        // Simulate print process
        setTimeout(() => {
            showToast('Result sent to printer!', 'success');
        }, 1500);
    }
};

window.shareResult = function(resultId) {
    const result = sampleResults.find(r => r.id === resultId);
    if (result) {
        showToast(`Sharing ${result.testName} with ${result.patientName}...`, 'info');
        // Simulate sharing process
        setTimeout(() => {
            showToast('Result shared successfully!', 'success');
        }, 2000);
    }
};

window.openPatientProfile = function(patientId) {
    showToast(`Opening profile for patient ${patientId}...`, 'info');
    // Redirect to patient profile page
    // window.location.href = `patient-profile.html?id=${patientId}`;
};

// OPEN RESULT MODAL
function openResultModal(result) {
    const modal = new bootstrap.Modal(document.getElementById('resultDetailModal'));
    
    // Populate modal with result data
    document.getElementById('resultModalTitle').textContent = `${result.testName} - ${result.patientName}`;
    document.getElementById('patientInitials').textContent = getPatientInitials(result.patientName);
    document.getElementById('patientName').textContent = result.patientName;
    document.getElementById('patientDetails').textContent = `ID: ${result.patientId} | Age: ${result.patientAge} | ${result.patientGender}`;
    document.getElementById('testStatusBadge').className = `badge ${getStatusBadgeClass(result.status)}`;
    document.getElementById('testStatusBadge').textContent = getStatusLabel(result.status);
    
    document.getElementById('testName').textContent = result.testName;
    document.getElementById('testType').textContent = getTestTypeLabel(result.testType);
    document.getElementById('orderedBy').textContent = result.orderedBy;
    document.getElementById('dateOrdered').textContent = formatDate(result.dateOrdered);
    document.getElementById('dateCompleted').textContent = result.dateCompleted ? formatDate(result.dateCompleted) : 'Pending';
    document.getElementById('labName').textContent = result.lab;
    
    // Populate result values
    const valuesTable = document.getElementById('resultValuesTable');
    if (valuesTable) {
        valuesTable.innerHTML = '';
        
        if (result.values && result.values.length > 0) {
            result.values.forEach(value => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${value.parameter}</td>
                    <td class="value-${value.status}">${value.result}</td>
                    <td>${value.normalRange}</td>
                    <td>${value.unit}</td>
                    <td>
                        <span class="badge ${getStatusBadgeClass(value.status)}">
                            ${getStatusLabel(value.status)}
                        </span>
                    </td>
                `;
                valuesTable.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" class="text-center">No detailed values available</td>';
            valuesTable.appendChild(row);
        }
    }
    
    // Populate attachments
    const attachmentList = document.getElementById('attachmentList');
    const attachmentsContainer = document.getElementById('attachmentsContainer');
    
    if (attachmentList && attachmentsContainer) {
        attachmentList.innerHTML = '';
        
        if (result.attachments && result.attachments.length > 0) {
            attachmentsContainer.style.display = 'block';
            
            result.attachments.forEach(attachment => {
                const attachmentDiv = document.createElement('div');
                attachmentDiv.className = 'attachment-item';
                attachmentDiv.innerHTML = `
                    <div class="attachment-icon">
                        <i class="${getAttachmentIcon(attachment.type)}"></i>
                    </div>
                    <div class="attachment-info">
                        <h6>${attachment.name}</h6>
                        <span>${attachment.size}</span>
                    </div>
                    <div class="attachment-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="downloadAttachment('${attachment.name}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="viewAttachment('${attachment.name}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                `;
                attachmentList.appendChild(attachmentDiv);
            });
        } else {
            attachmentsContainer.style.display = 'none';
        }
    }
    
    // Populate trend chart
    const trendChartContainer = document.getElementById('trendChartContainer');
    if (trendChartContainer) {
        if (result.trend && result.trend.length > 1) {
            trendChartContainer.style.display = 'block';
            createTrendChart(result.trend, result.testName);
        } else {
            trendChartContainer.style.display = 'none';
        }
    }
    
    // Populate doctor's notes
    const doctorNotes = document.getElementById('doctorNotes');
    if (doctorNotes) {
        doctorNotes.value = result.notes || '';
        
        // Auto-save notes on change
        doctorNotes.addEventListener('input', function() {
            // Update the result object
            result.notes = this.value;
            // In a real application, you would save this to the server
            console.log('Notes updated for result:', result.id);
        });
    }
    
    // Show the modal
    modal.show();
}

// CREATE TREND CHART
function createTrendChart(trendData, testName) {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (trendChart) {
        trendChart.destroy();
    }
    
    const labels = trendData.map(point => formatDate(point.date));
    const data = trendData.map(point => point.value);
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: testName,
                data: data,
                borderColor: currentTheme === 'dark' ? '#4dd0e1' : '#43a047',
                backgroundColor: currentTheme === 'dark' ? 'rgba(77, 208, 225, 0.1)' : 'rgba(67, 160, 71, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: currentTheme === 'dark' ? '#404040' : '#e9ecef'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#b0bec5' : '#7f8c8d'
                    }
                },
                x: {
                    grid: {
                        color: currentTheme === 'dark' ? '#404040' : '#e9ecef'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#b0bec5' : '#7f8c8d'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: currentTheme === 'dark' ? '#ffffff' : '#2c3e50'
                    }
                }
            }
        }
    });
}

// ATTACHMENT FUNCTIONS
window.downloadAttachment = function(filename) {
    showToast(`Downloading ${filename}...`, 'info');
    // Simulate download
    setTimeout(() => {
        showToast('Download completed!', 'success');
    }, 1500);
};

window.viewAttachment = function(filename) {
    showToast(`Opening ${filename}...`, 'info');
    // Simulate viewing attachment
};

console.log('✅ Lab Results page JavaScript loaded successfully!');
