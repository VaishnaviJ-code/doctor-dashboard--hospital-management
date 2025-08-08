// Patients Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializePatients();
});

// Sample patient data
let patientsData = [
    {
        id: 'P001234',
        firstName: 'Ananya',
        lastName: 'Menon',
        dateOfBirth: '1985-03-15',
        gender: 'female',
        phone: '+91 98765 43210',
        email: 'ananya.menon@email.com',
        address: '123 MG Road, Bangalore, Karnataka 560001',
        bloodType: 'A+',
        department: 'cardiology',
        status: 'active',
        lastVisit: '2024-11-20',
        emergencyContactName: 'Raj Menon',
        emergencyContactPhone: '+91 98765 43211',
        allergies: 'Penicillin, Shellfish',
        medicalHistory: 'Hypertension, Diabetes Type 2'
    },
    {
        id: 'P001235',
        firstName: 'Ravi',
        lastName: 'Kumar',
        dateOfBirth: '1978-07-22',
        gender: 'male',
        phone: '+91 98765 43212',
        email: 'ravi.kumar@email.com',
        address: '456 Brigade Road, Bangalore, Karnataka 560025',
        bloodType: 'O+',
        department: 'orthopedics',
        status: 'critical',
        lastVisit: '2024-11-18',
        emergencyContactName: 'Priya Kumar',
        emergencyContactPhone: '+91 98765 43213',
        allergies: 'None',
        medicalHistory: 'Previous knee surgery, Arthritis'
    },
    {
        id: 'P001236',
        firstName: 'Priya',
        lastName: 'Sharma',
        dateOfBirth: '1992-11-08',
        gender: 'female',
        phone: '+91 98765 43214',
        email: 'priya.sharma@email.com',
        address: '789 Commercial Street, Bangalore, Karnataka 560001',
        bloodType: 'B+',
        department: 'pediatrics',
        status: 'active',
        lastVisit: '2024-11-15',
        emergencyContactName: 'Amit Sharma',
        emergencyContactPhone: '+91 98765 43215',
        allergies: 'Dust, Pollen',
        medicalHistory: 'Asthma, Regular checkups'
    },
    {
        id: 'P001237',
        firstName: 'Arjun',
        lastName: 'Patel',
        dateOfBirth: '1965-05-12',
        gender: 'male',
        phone: '+91 98765 43216',
        email: 'arjun.patel@email.com',
        address: '321 Residency Road, Bangalore, Karnataka 560025',
        bloodType: 'AB+',
        department: 'neurology',
        status: 'inactive',
        lastVisit: '2024-10-28',
        emergencyContactName: 'Meera Patel',
        emergencyContactPhone: '+91 98765 43217',
        allergies: 'Latex',
        medicalHistory: 'Migraine, Sleep apnea'
    },
    {
        id: 'P001238',
        firstName: 'Kavya',
        lastName: 'Reddy',
        dateOfBirth: '1988-12-03',
        gender: 'female',
        phone: '+91 98765 43218',
        email: 'kavya.reddy@email.com',
        address: '567 Koramangala, Bangalore, Karnataka 560034',
        bloodType: 'O-',
        department: 'oncology',
        status: 'active',
        lastVisit: '2024-11-22',
        emergencyContactName: 'Vikram Reddy',
        emergencyContactPhone: '+91 98765 43219',
        allergies: 'Morphine, Codeine',
        medicalHistory: 'Breast cancer survivor, Regular follow-ups'
    },
    {
        id: 'P001239',
        firstName: 'Suresh',
        lastName: 'Iyer',
        dateOfBirth: '1970-09-18',
        gender: 'male',
        phone: '+91 98765 43220',
        email: 'suresh.iyer@email.com',
        address: '890 Indiranagar, Bangalore, Karnataka 560038',
        bloodType: 'A-',
        department: 'cardiology',
        status: 'discharged',
        lastVisit: '2024-11-10',
        emergencyContactName: 'Lakshmi Iyer',
        emergencyContactPhone: '+91 98765 43221',
        allergies: 'Aspirin',
        medicalHistory: 'Bypass surgery, Recovering well'
    }
];

let filteredPatients = [...patientsData];
let currentEditingPatient = null;

// Initialize patients page
function initializePatients() {
    setupEventListeners();
    loadPatients();
    updateStats();
    setupTheme();
    setupSidebar();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('globalSearch').addEventListener('input', handleSearch);
    
    // Filter functionality
    document.getElementById('departmentFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('ageFilter').addEventListener('change', applyFilters);
    document.getElementById('genderFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // View toggle
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', toggleView);
    });
    
    // Modal buttons
    document.getElementById('addPatientBtn').addEventListener('click', openAddPatientModal);
    document.getElementById('savePatientBtn').addEventListener('click', savePatient);
    document.getElementById('editPatientBtn').addEventListener('click', editCurrentPatient);
    document.getElementById('confirmDelete').addEventListener('click', confirmDeletePatient);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportPatients);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Form validation
    document.getElementById('patientForm').addEventListener('submit', handleFormSubmit);
}

// Handle search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredPatients = [...patientsData];
    } else {
        filteredPatients = patientsData.filter(patient => {
            return patient.firstName.toLowerCase().includes(searchTerm) ||
                   patient.lastName.toLowerCase().includes(searchTerm) ||
                   patient.id.toLowerCase().includes(searchTerm) ||
                   patient.phone.includes(searchTerm) ||
                   (patient.email && patient.email.toLowerCase().includes(searchTerm));
        });
    }
    
    loadPatients();
    updateStats();
}

// Apply filters
function applyFilters() {
    const department = document.getElementById('departmentFilter').value;
    const status = document.getElementById('statusFilter').value;
    const ageGroup = document.getElementById('ageFilter').value;
    const gender = document.getElementById('genderFilter').value;
    
    filteredPatients = patientsData.filter(patient => {
        let matches = true;
        
        if (department && patient.department !== department) matches = false;
        if (status && patient.status !== status) matches = false;
        if (gender && patient.gender !== gender) matches = false;
        
        if (ageGroup) {
            const age = calculateAge(patient.dateOfBirth);
            switch (ageGroup) {
                case '0-18':
                    if (age < 0 || age > 18) matches = false;
                    break;
                case '19-35':
                    if (age < 19 || age > 35) matches = false;
                    break;
                case '36-60':
                    if (age < 36 || age > 60) matches = false;
                    break;
                case '60+':
                    if (age < 60) matches = false;
                    break;
            }
        }
        
        return matches;
    });
    
    loadPatients();
    updateStats();
}

// Reset filters
function resetFilters() {
    document.getElementById('departmentFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('ageFilter').value = '';
    document.getElementById('genderFilter').value = '';
    document.getElementById('globalSearch').value = '';
    
    filteredPatients = [...patientsData];
    loadPatients();
    updateStats();
}

// Toggle view between table and grid
function toggleView(e) {
    const viewType = e.currentTarget.getAttribute('data-view');
    
    // Update button states
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show/hide views
    document.getElementById('tableView').classList.remove('active');
    document.getElementById('gridView').classList.remove('active');
    
    if (viewType === 'table') {
        document.getElementById('tableView').classList.add('active');
    } else {
        document.getElementById('gridView').classList.add('active');
    }
}

// Load patients data
function loadPatients() {
    loadTableView();
    loadGridView();
}

// Load table view
function loadTableView() {
    const tbody = document.getElementById('patientsTableBody');
    tbody.innerHTML = '';
    
    filteredPatients.forEach(patient => {
        const row = createPatientTableRow(patient);
        tbody.appendChild(row);
    });
}

// Create patient table row
function createPatientTableRow(patient) {
    const row = document.createElement('tr');
    const age = calculateAge(patient.dateOfBirth);
    const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
    
    row.innerHTML = `
        <td>
            <div class="patient-info" onclick="viewPatientDetails('${patient.id}')">
                <div class="patient-avatar">${initials}</div>
                <div class="patient-details">
                    <h6>${patient.firstName} ${patient.lastName}</h6>
                    <span>Last visit: ${formatDate(patient.lastVisit)}</span>
                </div>
            </div>
        </td>
        <td><span class="patient-id">${patient.id}</span></td>
        <td>${age} / ${capitalizeFirst(patient.gender)}</td>
        <td>
            <div>${patient.phone}</div>
            <small class="text-muted">${patient.email || 'N/A'}</small>
        </td>
        <td><span class="badge bg-light text-dark">${capitalizeFirst(patient.department)}</span></td>
        <td>${formatDate(patient.lastVisit)}</td>
        <td><span class="status-badge ${patient.status}">${capitalizeFirst(patient.status)}</span></td>
        <td>
            <div class="action-buttons">
                <button class="action-btn view" onclick="viewPatientDetails('${patient.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editPatient('${patient.id}')" title="Edit Patient">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deletePatient('${patient.id}')" title="Delete Patient">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Load grid view
function loadGridView() {
    const grid = document.getElementById('patientsGrid');
    grid.innerHTML = '';
    
    filteredPatients.forEach(patient => {
        const card = createPatientCard(patient);
        grid.appendChild(card);
    });
}

// Create patient card
function createPatientCard(patient) {
    const card = document.createElement('div');
    card.className = 'patient-card';
    const age = calculateAge(patient.dateOfBirth);
    const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
    
    card.innerHTML = `
        <div class="patient-card-header">
            <div class="patient-card-avatar">${initials}</div>
            <div class="patient-card-info">
                <h6>${patient.firstName} ${patient.lastName}</h6>
                <span class="patient-id">${patient.id}</span>
            </div>
        </div>
        <div class="patient-card-details">
            <div class="detail-item">
                <span class="detail-label">Age</span>
                <span class="detail-value">${age} years</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Gender</span>
                <span class="detail-value">${capitalizeFirst(patient.gender)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Department</span>
                <span class="detail-value">${capitalizeFirst(patient.department)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Last Visit</span>
                <span class="detail-value">${formatDate(patient.lastVisit)}</span>
            </div>
        </div>
        <div class="patient-card-footer">
            <span class="status-badge ${patient.status}">${capitalizeFirst(patient.status)}</span>
            <div class="action-buttons">
                <button class="action-btn view" onclick="viewPatientDetails('${patient.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editPatient('${patient.id}')" title="Edit Patient">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deletePatient('${patient.id}')" title="Delete Patient">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.action-buttons')) {
            viewPatientDetails(patient.id);
        }
    });
    
    return card;
}

// Open add patient modal
function openAddPatientModal() {
    currentEditingPatient = null;
    document.getElementById('patientModalTitle').textContent = 'Add New Patient';
    document.getElementById('patientForm').reset();
    document.getElementById('patientForm').classList.remove('was-validated');
    new bootstrap.Modal(document.getElementById('patientModal')).show();
}

// Edit patient
function editPatient(patientId) {
    const patient = patientsData.find(p => p.id === patientId);
    if (!patient) return;
    
    currentEditingPatient = patient;
    document.getElementById('patientModalTitle').textContent = 'Edit Patient';
    
    // Fill form with patient data
    document.getElementById('firstName').value = patient.firstName;
    document.getElementById('lastName').value = patient.lastName;
    document.getElementById('dateOfBirth').value = patient.dateOfBirth;
    document.getElementById('gender').value = patient.gender;
    document.getElementById('phone').value = patient.phone;
    document.getElementById('email').value = patient.email || '';
    document.getElementById('address').value = patient.address || '';
    document.getElementById('bloodType').value = patient.bloodType || '';
    document.getElementById('emergencyContactName').value = patient.emergencyContactName || '';
    document.getElementById('emergencyContactPhone').value = patient.emergencyContactPhone || '';
    document.getElementById('allergies').value = patient.allergies || '';
    document.getElementById('medicalHistory').value = patient.medicalHistory || '';
    
    new bootstrap.Modal(document.getElementById('patientModal')).show();
}

// Edit current patient from details modal
function editCurrentPatient() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('patientDetailsModal'));
    modal.hide();
    
    setTimeout(() => {
        if (currentEditingPatient) {
            editPatient(currentEditingPatient.id);
        }
    }, 300);
}

// Save patient
function savePatient() {
    const form = document.getElementById('patientForm');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const formData = new FormData(form);
    const patientData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        bloodType: document.getElementById('bloodType').value,
        emergencyContactName: document.getElementById('emergencyContactName').value.trim(),
        emergencyContactPhone: document.getElementById('emergencyContactPhone').value.trim(),
        allergies: document.getElementById('allergies').value.trim(),
        medicalHistory: document.getElementById('medicalHistory').value.trim()
    };
    
    // Validate required fields
    if (!patientData.firstName || !patientData.lastName || !patientData.dateOfBirth || 
        !patientData.gender || !patientData.phone) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }
    
    // Validate email if provided
    if (patientData.email && !isValidEmail(patientData.email)) {
        showAlert('Please enter a valid email address.', 'danger');
        return;
    }
    
    // Validate phone number
    if (!isValidPhone(patientData.phone)) {
        showAlert('Please enter a valid phone number.', 'danger');
        return;
    }
    
    if (currentEditingPatient) {
        // Update existing patient
        const index = patientsData.findIndex(p => p.id === currentEditingPatient.id);
        if (index !== -1) {
            patientsData[index] = { ...patientsData[index], ...patientData };
            showAlert('Patient updated successfully!', 'success');
        }
    } else {
        // Add new patient
        const newPatient = {
            id: generatePatientId(),
            ...patientData,
            department: 'cardiology', // Default department
            status: 'active',
            lastVisit: new Date().toISOString().split('T')[0]
        };
        patientsData.push(newPatient);
        showAlert('New patient added successfully!', 'success');
    }
    
    // Close modal and refresh
    const modal = bootstrap.Modal.getInstance(document.getElementById('patientModal'));
    modal.hide();
    
    filteredPatients = [...patientsData];
    loadPatients();
    updateStats();
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    savePatient();
}

// Delete patient
function deletePatient(patientId) {
    const patient = patientsData.find(p => p.id === patientId);
    if (!patient) return;
    
    document.getElementById('deletePatientSummary').innerHTML = `
        <div class="patient-summary">
            <strong>${patient.firstName} ${patient.lastName}</strong><br>
            <small>ID: ${patient.id}</small><br>
            <small>Phone: ${patient.phone}</small>
        </div>
    `;
    
    currentEditingPatient = patient;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

// Confirm delete patient
function confirmDeletePatient() {
    if (!currentEditingPatient) return;
    
    const index = patientsData.findIndex(p => p.id === currentEditingPatient.id);
    if (index !== -1) {
        patientsData.splice(index, 1);
        filteredPatients = [...patientsData];
        loadPatients();
        updateStats();
        showAlert('Patient deleted successfully!', 'success');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
    currentEditingPatient = null;
}

// View patient details
function viewPatientDetails(patientId) {
    const patient = patientsData.find(p => p.id === patientId);
    if (!patient) return;
    
    currentEditingPatient = patient;
    const age = calculateAge(patient.dateOfBirth);
    const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
    
    document.getElementById('patientDetailsContent').innerHTML = `
        <div class="patient-details-card">
            <div class="patient-header-large">
                <div class="patient-avatar-large">${initials}</div>
                <div class="patient-info-large">
                    <h3>${patient.firstName} ${patient.lastName}</h3>
                    <div class="patient-id-large">${patient.id}</div>
                    <div class="patient-meta">
                        <span><i class="fas fa-birthday-cake"></i> ${age} years old</span>
                        <span><i class="fas fa-venus-mars"></i> ${capitalizeFirst(patient.gender)}</span>
                        <span><i class="fas fa-tint"></i> ${patient.bloodType || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            ${patient.allergies ? `
            <div class="alert-card">
                <h6><i class="fas fa-exclamation-triangle"></i> Allergies</h6>
                <ul class="alert-list">
                    ${patient.allergies.split(',').map(allergy => `<li>${allergy.trim()}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="info-grid">
                <div class="info-section">
                    <h6>Contact Information</h6>
                    <div class="info-item">
                        <span class="info-label">Phone</span>
                        <span class="info-value">${patient.phone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email</span>
                        <span class="info-value">${patient.email || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Address</span>
                        <span class="info-value">${patient.address || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="info-section">
                    <h6>Medical Information</h6>
                    <div class="info-item">
                        <span class="info-label">Department</span>
                        <span class="info-value">${capitalizeFirst(patient.department)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="info-value">
                            <span class="status-badge ${patient.status}">${capitalizeFirst(patient.status)}</span>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Last Visit</span>
                        <span class="info-value">${formatDate(patient.lastVisit)}</span>
                    </div>
                </div>
                
                <div class="info-section">
                    <h6>Emergency Contact</h6>
                    <div class="info-item">
                        <span class="info-label">Name</span>
                        <span class="info-value">${patient.emergencyContactName || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone</span>
                        <span class="info-value">${patient.emergencyContactPhone || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="info-section">
                    <h6>Medical History</h6>
                    <div class="info-item">
                        <span class="info-value">${patient.medicalHistory || 'No medical history recorded'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    new bootstrap.Modal(document.getElementById('patientDetailsModal')).show();
}

// Update statistics
function updateStats() {
    const total = patientsData.length;
    const active = patientsData.filter(p => p.status === 'active').length;
    const critical = patientsData.filter(p => p.status === 'critical').length;
    
    // Calculate new patients this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = patientsData.filter(p => {
        const lastVisit = new Date(p.lastVisit);
        return lastVisit >= oneWeekAgo;
    }).length;
    
    document.getElementById('totalPatients').textContent = total;
    document.getElementById('activePatients').textContent = active;
    document.getElementById('criticalPatients').textContent = critical;
    document.getElementById('newPatients').textContent = newThisWeek;
}

// Export patients data
function exportPatients() {
    const csvContent = generateCSV(filteredPatients);
    downloadCSV(csvContent, 'patients_export.csv');
    showAlert('Patients data exported successfully!', 'success');
}

// Generate CSV content
function generateCSV(data) {
    const headers = ['ID', 'Name', 'Date of Birth', 'Age', 'Gender', 'Phone', 'Email', 'Department', 'Status', 'Last Visit'];
    const rows = data.map(patient => [
        patient.id,
        `${patient.firstName} ${patient.lastName}`,
        patient.dateOfBirth,
        calculateAge(patient.dateOfBirth),
        patient.gender,
        patient.phone,
        patient.email || '',
        patient.department,
        patient.status,
        patient.lastVisit
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Utility functions
function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generatePatientId() {
    const prefix = 'P';
    const number = (patientsData.length + 1).toString().padStart(6, '0');
    return prefix + number;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Theme management
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Sidebar management
function setupSidebar() {
    // Mobile sidebar functionality
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    backdrop.addEventListener('click', () => {
        sidebar.classList.remove('show');
        backdrop.classList.remove('show');
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show');
        backdrop.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
    }
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
