// Prescription Management JavaScript - Complete Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('💊 Initializing Prescription Management...');
    
    // Wait for all elements to be available
    setTimeout(() => {
        initializePrescriptionSystem();
    }, 100);
    
    function initializePrescriptionSystem() {
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
        
        // Global state management
        let sidebarOpen = false;
        let currentTheme = 'light';
        let prescriptionData = {
            currentPrescription: null,
            medications: [],
            templates: [],
            patients: []
        };
        
        // Prescription-specific elements
        const createPrescriptionBtn = document.getElementById('createPrescriptionBtn');
        const prescriptionModal = document.getElementById('prescriptionModal');
        const prescriptionForm = document.getElementById('prescriptionForm');
        const addMedicationBtn = document.getElementById('addMedicationBtn');
        const medicationsList = document.getElementById('medicationsList');
        const savePrescriptionBtn = document.getElementById('savePrescriptionBtn');
        const previewPrescriptionBtn = document.getElementById('previewPrescriptionBtn');
        const prescriptionPreviewModal = document.getElementById('prescriptionPreviewModal');
        const templatesModal = document.getElementById('templatesModal');
        const globalSearch = document.getElementById('globalSearch');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        // THEME TOGGLE FUNCTION (Same as dashboard)
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
        
        // SIDEBAR TOGGLE FUNCTIONS (Same as dashboard)
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
        
        // PRESCRIPTION MANAGEMENT FUNCTIONS
        
        // Initialize prescription data
        function initializePrescriptionData() {
            console.log('📋 Initializing prescription data...');
            
            // Demo patients data
            prescriptionData.patients = [
                { id: 'P001', name: 'Ananya Menon', age: 28, gender: 'Female', phone: '+91 98765 43210', email: 'ananya.menon@email.com' },
                { id: 'P002', name: 'Ravi Kumar', age: 45, gender: 'Male', phone: '+91 98765 43211', email: 'ravi.kumar@email.com' },
                { id: 'P003', name: 'Priya Sharma', age: 35, gender: 'Female', phone: '+91 98765 43212', email: 'priya.sharma@email.com' },
                { id: 'P004', name: 'Arjun Patel', age: 52, gender: 'Male', phone: '+91 98765 43213', email: 'arjun.patel@email.com' },
                { id: 'P005', name: 'Sneha Reddy', age: 29, gender: 'Female', phone: '+91 98765 43214', email: 'sneha.reddy@email.com' }
            ];
            
            // Demo templates
            prescriptionData.templates = [
                {
                    id: 'T001',
                    name: 'Common Cold Treatment',
                    description: 'Standard treatment for common cold symptoms',
                    medications: [
                        { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: '3 times daily', duration: '5 days' },
                        { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '5 days' }
                    ]
                },
                {
                    id: 'T002',
                    name: 'Hypertension Management',
                    description: 'Standard medication for hypertension control',
                    medications: [
                        { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days' },
                        { name: 'Metoprolol 50mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '30 days' }
                    ]
                },
                {
                    id: 'T003',
                    name: 'Diabetic Care',
                    description: 'Diabetes management medication',
                    medications: [
                        { name: 'Metformin 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '30 days' },
                        { name: 'Glimepiride 2mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days' }
                    ]
                }
            ];
            
            // Populate patient dropdown
            populatePatientDropdown();
            
            // Load prescriptions table
            loadPrescriptionsTable();
            
            console.log('✅ Prescription data initialized');
        }
        
        // Populate patient dropdown
        function populatePatientDropdown() {
            const patientSelect = document.getElementById('selectedPatient');
            const patientFilter = document.getElementById('patientFilter');
            
            if (patientSelect) {
                patientSelect.innerHTML = '<option value="">Choose a patient...</option>';
                prescriptionData.patients.forEach(patient => {
                    const option = document.createElement('option');
                    option.value = patient.id;
                    option.textContent = `${patient.name} (${patient.id})`;
                    patientSelect.appendChild(option);
                });
            }
            
            if (patientFilter) {
                patientFilter.innerHTML = '<option value="">All Patients</option>';
                prescriptionData.patients.forEach(patient => {
                    const option = document.createElement('option');
                    option.value = patient.id;
                    option.textContent = patient.name;
                    patientFilter.appendChild(option);
                });
            }
        }
        
        // Load prescriptions table with demo data
        function loadPrescriptionsTable() {
            const tableBody = document.getElementById('prescriptionsTableBody');
            if (!tableBody) return;
            
            // Demo prescription data
            const demoData = [
                {
                    id: 'RX001',
                    patient: 'Ananya Menon',
                    date: '2024-01-15',
                    medications: 'Paracetamol 650mg, Cetirizine 10mg',
                    status: 'Active'
                },
                {
                    id: 'RX002',
                    patient: 'Ravi Kumar',
                    date: '2024-01-14',
                    medications: 'Amlodipine 5mg, Metoprolol 50mg',
                    status: 'Pending'
                },
                {
                    id: 'RX003',
                    patient: 'Priya Sharma',
                    date: '2024-01-13',
                    medications: 'Metformin 500mg, Glimepiride 2mg',
                    status: 'Completed'
                },
                {
                    id: 'RX004',
                    patient: 'Arjun Patel',
                    date: '2024-01-12',
                    medications: 'Atorvastatin 20mg',
                    status: 'Active'
                },
                {
                    id: 'RX005',
                    patient: 'Sneha Reddy',
                    date: '2024-01-11',
                    medications: 'Omeprazole 20mg, Domperidone 10mg',
                    status: 'Expired'
                }
            ];
            
            tableBody.innerHTML = '';
            demoData.forEach(prescription => {
                const row = document.createElement('tr');
                const statusClass = prescription.status.toLowerCase() === 'active' ? 'bg-success' :
                                  prescription.status.toLowerCase() === 'pending' ? 'bg-warning' :
                                  prescription.status.toLowerCase() === 'completed' ? 'bg-info' : 'bg-danger';
                
                row.innerHTML = `
                    <td>${prescription.id}</td>
                    <td>${prescription.patient}</td>
                    <td>${new Date(prescription.date).toLocaleDateString()}</td>
                    <td>${prescription.medications}</td>
                    <td><span class="badge ${statusClass}">${prescription.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewPrescription('${prescription.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="editPrescription('${prescription.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        // Create new prescription
        function createNewPrescription() {
            console.log('📝 Creating new prescription...');
            
            // Reset form
            if (prescriptionForm) {
                prescriptionForm.reset();
            }
            
            // Clear medications list
            if (medicationsList) {
                medicationsList.innerHTML = '';
            }
            
            // Reset prescription data
            prescriptionData.currentPrescription = null;
            prescriptionData.medications = [];
            
            // Set current date
            const prescriptionDate = document.getElementById('prescriptionDate');
            if (prescriptionDate) {
                prescriptionDate.value = new Date().toISOString().split('T')[0];
            }
            
            // Show modal
            if (prescriptionModal) {
                const modal = new bootstrap.Modal(prescriptionModal);
                modal.show();
            }
            
            showToast('Ready to create new prescription', 'info');
        }
        
        // Add medication to prescription
        function addMedication() {
            console.log('💊 Adding medication...');
            
            const medicationCount = prescriptionData.medications.length;
            const medicationItem = document.createElement('div');
            medicationItem.className = 'medication-item';
            medicationItem.setAttribute('data-medication-index', medicationCount);
            
            medicationItem.innerHTML = `
                <div class="medication-header">
                    <div class="medication-number">${medicationCount + 1}</div>
                    <h6>Medication ${medicationCount + 1}</h6>
                    <button type="button" class="remove-medication" onclick="removeMedication(${medicationCount})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Medication Name *</label>
                        <input type="text" class="form-control" name="medication_name_${medicationCount}" required placeholder="Enter medication name">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Strength/Dosage *</label>
                        <input type="text" class="form-control" name="medication_dosage_${medicationCount}" required placeholder="e.g., 500mg, 10ml">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Frequency *</label>
                        <select class="form-select" name="medication_frequency_${medicationCount}" required>
                            <option value="">Select frequency</option>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="Three times daily">Three times daily</option>
                            <option value="Four times daily">Four times daily</option>
                            <option value="Every 4 hours">Every 4 hours</option>
                            <option value="Every 6 hours">Every 6 hours</option>
                            <option value="Every 8 hours">Every 8 hours</option>
                            <option value="As needed">As needed</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Duration *</label>
                        <input type="text" class="form-control" name="medication_duration_${medicationCount}" required placeholder="e.g., 7 days, 2 weeks">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Route</label>
                        <select class="form-select" name="medication_route_${medicationCount}">
                            <option value="Oral">Oral</option>
                            <option value="Topical">Topical</option>
                            <option value="Injection">Injection</option>
                            <option value="Inhalation">Inhalation</option>
                            <option value="Eye drops">Eye drops</option>
                            <option value="Ear drops">Ear drops</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Special Instructions</label>
                        <textarea class="form-control" name="medication_instructions_${medicationCount}" rows="2" placeholder="Take with food, before meals, etc."></textarea>
                    </div>
                </div>
            `;
            
            if (medicationsList) {
                medicationsList.appendChild(medicationItem);
            }
            
            // Add to medications array
            prescriptionData.medications.push({
                index: medicationCount,
                name: '',
                dosage: '',
                frequency: '',
                duration: '',
                route: 'Oral',
                instructions: ''
            });
            
            showToast('Medication added successfully', 'success');
        }
        
        // Remove medication
        function removeMedication(index) {
            console.log('🗑️ Removing medication:', index);
            
            const medicationItem = document.querySelector(`[data-medication-index="${index}"]`);
            if (medicationItem) {
                medicationItem.remove();
            }
            
            // Remove from array
            prescriptionData.medications = prescriptionData.medications.filter(med => med.index !== index);
            
            // Renumber remaining medications
            renumberMedications();
            
            showToast('Medication removed', 'info');
        }
        
        // Renumber medications after removal
        function renumberMedications() {
            const medicationItems = document.querySelectorAll('.medication-item');
            medicationItems.forEach((item, index) => {
                const numberElement = item.querySelector('.medication-number');
                const headerElement = item.querySelector('.medication-header h6');
                
                if (numberElement) numberElement.textContent = index + 1;
                if (headerElement) headerElement.textContent = `Medication ${index + 1}`;
                
                item.setAttribute('data-medication-index', index);
            });
        }
        
        // Handle patient selection
        function handlePatientSelection() {
            const selectedPatient = document.getElementById('selectedPatient');
            const patientDetails = document.getElementById('patientDetails');
            
            if (!selectedPatient || !patientDetails) return;
            
            selectedPatient.addEventListener('change', function() {
                const patientId = this.value;
                const patient = prescriptionData.patients.find(p => p.id === patientId);
                
                if (patient) {
                    patientDetails.innerHTML = `
                        <div class="patient-selected-info">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Patient ID:</strong> ${patient.id}<br>
                                    <strong>Age:</strong> ${patient.age} years<br>
                                    <strong>Gender:</strong> ${patient.gender}
                                </div>
                                <div class="col-md-6">
                                    <strong>Phone:</strong> ${patient.phone}<br>
                                    <strong>Email:</strong> ${patient.email}
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    patientDetails.innerHTML = '';
                }
            });
        }
        
        // Handle follow-up requirement
        function handleFollowUpRequirement() {
            const followupRequired = document.getElementById('followupRequired');
            const followupDateContainer = document.getElementById('followupDateContainer');
            
            if (!followupRequired || !followupDateContainer) return;
            
            followupRequired.addEventListener('change', function() {
                if (this.value === 'yes') {
                    followupDateContainer.style.display = 'block';
                    
                    // Set default follow-up date to 1 week from now
                    const followupDate = document.getElementById('followupDate');
                    if (followupDate) {
                        const nextWeek = new Date();
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        followupDate.value = nextWeek.toISOString().split('T')[0];
                    }
                } else {
                    followupDateContainer.style.display = 'none';
                }
            });
        }
        
        // Validate prescription form
        function validatePrescriptionForm() {
            console.log('✅ Validating prescription form...');
            
            const selectedPatient = document.getElementById('selectedPatient');
            const prescriptionDate = document.getElementById('prescriptionDate');
            const diagnosis = document.getElementById('diagnosis');
            
            let isValid = true;
            let errors = [];
            
            // Check required fields
            if (!selectedPatient || !selectedPatient.value) {
                errors.push('Please select a patient');
                isValid = false;
            }
            
            if (!prescriptionDate || !prescriptionDate.value) {
                errors.push('Please select prescription date');
                isValid = false;
            }
            
            if (!diagnosis || !diagnosis.value.trim()) {
                errors.push('Please enter diagnosis');
                isValid = false;
            }
            
            // Check medications
            if (prescriptionData.medications.length === 0) {
                errors.push('Please add at least one medication');
                isValid = false;
            }
            
            // Validate medication details
            const medicationItems = document.querySelectorAll('.medication-item');
            medicationItems.forEach((item, index) => {
                const nameInput = item.querySelector(`[name^="medication_name_"]`);
                const dosageInput = item.querySelector(`[name^="medication_dosage_"]`);
                const frequencySelect = item.querySelector(`[name^="medication_frequency_"]`);
                const durationInput = item.querySelector(`[name^="medication_duration_"]`);
                
                if (!nameInput?.value.trim()) {
                    errors.push(`Medication ${index + 1}: Name is required`);
                    isValid = false;
                }
                
                if (!dosageInput?.value.trim()) {
                    errors.push(`Medication ${index + 1}: Dosage is required`);
                    isValid = false;
                }
                
                if (!frequencySelect?.value) {
                    errors.push(`Medication ${index + 1}: Frequency is required`);
                    isValid = false;
                }
                
                if (!durationInput?.value.trim()) {
                    errors.push(`Medication ${index + 1}: Duration is required`);
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showToast(`Validation errors:\n${errors.join('\n')}`, 'error');
            }
            
            return isValid;
        }
        
        // Save prescription
        function savePrescription() {
            console.log('💾 Saving prescription...');
            
            if (!validatePrescriptionForm()) {
                return;
            }
            
            showLoading(true);
            
            // Simulate API call
            setTimeout(() => {
                const prescriptionId = 'RX' + Date.now().toString().slice(-6);
                
                // Collect form data
                const formData = collectPrescriptionFormData();
                
                // Simulate saving to database
                console.log('📝 Prescription data:', formData);
                
                showLoading(false);
                showToast('Prescription saved successfully!', 'success');
                
                // Close modal
                if (prescriptionModal) {
                    const modal = bootstrap.Modal.getInstance(prescriptionModal);
                    if (modal) modal.hide();
                }
                
                // Refresh table
                loadPrescriptionsTable();
                
                // Update stats
                updatePrescriptionStats();
                
            }, 1500);
        }
        
        // Collect prescription form data
        function collectPrescriptionFormData() {
            const selectedPatient = document.getElementById('selectedPatient');
            const prescriptionDate = document.getElementById('prescriptionDate');
            const chiefComplaint = document.getElementById('chiefComplaint');
            const diagnosis = document.getElementById('diagnosis');
            const icdCode = document.getElementById('icdCode');
            const severity = document.getElementById('severity');
            const followupRequired = document.getElementById('followupRequired');
            const followupDate = document.getElementById('followupDate');
            const labTests = document.getElementById('labTests');
            const instructions = document.getElementById('instructions');
            
            // Collect medication data
            const medications = [];
            const medicationItems = document.querySelectorAll('.medication-item');
            
            medicationItems.forEach((item, index) => {
                const medication = {
                    name: item.querySelector(`[name^="medication_name_"]`)?.value || '',
                    dosage: item.querySelector(`[name^="medication_dosage_"]`)?.value || '',
                    frequency: item.querySelector(`[name^="medication_frequency_"]`)?.value || '',
                    duration: item.querySelector(`[name^="medication_duration_"]`)?.value || '',
                    route: item.querySelector(`[name^="medication_route_"]`)?.value || 'Oral',
                    instructions: item.querySelector(`[name^="medication_instructions_"]`)?.value || ''
                };
                medications.push(medication);
            });
            
            return {
                patient: {
                    id: selectedPatient?.value || '',
                    name: selectedPatient?.options[selectedPatient.selectedIndex]?.text || ''
                },
                date: prescriptionDate?.value || '',
                chiefComplaint: chiefComplaint?.value || '',
                diagnosis: diagnosis?.value || '',
                icdCode: icdCode?.value || '',
                severity: severity?.value || '',
                medications: medications,
                followup: {
                    required: followupRequired?.value === 'yes',
                    date: followupDate?.value || ''
                },
                labTests: labTests?.value || '',
                instructions: instructions?.value || '',
                createdAt: new Date().toISOString(),
                prescribedBy: 'Dr. Rajesh Kumar'
            };
        }
        
        // Preview prescription
        function previewPrescription() {
            console.log('👁️ Previewing prescription...');
            
            if (!validatePrescriptionForm()) {
                return;
            }
            
            const formData = collectPrescriptionFormData();
            const previewContent = document.getElementById('prescriptionPreview');
            
            if (previewContent) {
                previewContent.innerHTML = generatePrescriptionPreview(formData);
            }
            
            if (prescriptionPreviewModal) {
                const modal = new bootstrap.Modal(prescriptionPreviewModal);
                modal.show();
            }
        }
        
        // Generate prescription preview HTML
        function generatePrescriptionPreview(data) {
            const medicationsHtml = data.medications.map(med => `
                <div class="medication-entry">
                    <strong>${med.name}</strong> - ${med.dosage}<br>
                    <em>Frequency:</em> ${med.frequency}<br>
                    <em>Duration:</em> ${med.duration}<br>
                    <em>Route:</em> ${med.route}<br>
                    ${med.instructions ? `<em>Instructions:</em> ${med.instructions}<br>` : ''}
                </div>
            `).join('');
            
            return `
                <div class="prescription-header">
                    <h3>Medical Prescription</h3>
                    <p><strong>Dr. Rajesh Kumar</strong> - Cardiologist</p>
                    <p>MediCare Hospital | License: MD12345</p>
                </div>
                
                <div class="prescription-info">
                    <div>
                        <h5>Patient Information</h5>
                        <p><strong>Name:</strong> ${data.patient.name}</p>
                        <p><strong>Patient ID:</strong> ${data.patient.id}</p>
                        <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h5>Prescription Details</h5>
                        <p><strong>Prescription ID:</strong> RX${Date.now().toString().slice(-6)}</p>
                        <p><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                
                ${data.chiefComplaint ? `
                <div class="prescription-section">
                    <h5>Chief Complaint</h5>
                    <p>${data.chiefComplaint}</p>
                </div>` : ''}
                
                <div class="prescription-section">
                    <h5>Diagnosis</h5>
                    <p>${data.diagnosis}</p>
                    ${data.icdCode ? `<p><strong>ICD-10 Code:</strong> ${data.icdCode}</p>` : ''}
                    ${data.severity ? `<p><strong>Severity:</strong> ${data.severity}</p>` : ''}
                </div>
                
                <div class="prescription-medications">
                    <h5>Prescribed Medications</h5>
                    ${medicationsHtml}
                </div>
                
                ${data.labTests ? `
                <div class="prescription-section">
                    <h5>Recommended Lab Tests</h5>
                    <p>${data.labTests}</p>
                </div>` : ''}
                
                ${data.instructions ? `
                <div class="prescription-section">
                    <h5>Patient Instructions</h5>
                    <p>${data.instructions}</p>
                </div>` : ''}
                
                ${data.followup.required ? `
                <div class="prescription-section">
                    <h5>Follow-up</h5>
                    <p>Next appointment scheduled for: ${new Date(data.followup.date).toLocaleDateString()}</p>
                </div>` : ''}
                
                <div class="prescription-footer">
                    <p><strong>Doctor's Signature:</strong> Dr. Rajesh Kumar</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            `;
        }
        
        // Load templates
        function loadTemplates() {
            console.log('📋 Loading prescription templates...');
            
            const templatesGrid = document.getElementById('templatesGrid');
            if (!templatesGrid) return;
            
            templatesGrid.innerHTML = '';
            
            prescriptionData.templates.forEach(template => {
                const templateCard = document.createElement('div');
                templateCard.className = 'template-card';
                templateCard.innerHTML = `
                    <div class="template-title">${template.name}</div>
                    <div class="template-description">${template.description}</div>
                    <div class="template-meta">${template.medications.length} medication(s)</div>
                `;
                
                templateCard.addEventListener('click', () => {
                    useTemplate(template);
                });
                
                templatesGrid.appendChild(templateCard);
            });
            
            if (templatesModal) {
                const modal = new bootstrap.Modal(templatesModal);
                modal.show();
            }
        }
        
        // Use template
        function useTemplate(template) {
            console.log('📝 Using template:', template.name);
            
            // Clear existing medications
            if (medicationsList) {
                medicationsList.innerHTML = '';
            }
            prescriptionData.medications = [];
            
            // Add medications from template
            template.medications.forEach((medication, index) => {
                addMedication();
                
                // Populate the medication fields
                setTimeout(() => {
                    const medicationItem = document.querySelector(`[data-medication-index="${index}"]`);
                    if (medicationItem) {
                        const nameInput = medicationItem.querySelector(`[name^="medication_name_"]`);
                        const dosageInput = medicationItem.querySelector(`[name^="medication_dosage_"]`);
                        const frequencySelect = medicationItem.querySelector(`[name^="medication_frequency_"]`);
                        const durationInput = medicationItem.querySelector(`[name^="medication_duration_"]`);
                        
                        if (nameInput) nameInput.value = medication.name;
                        if (dosageInput) dosageInput.value = medication.dosage;
                        if (frequencySelect) frequencySelect.value = medication.frequency;
                        if (durationInput) durationInput.value = medication.duration;
                    }
                }, 100);
            });
            
            // Close templates modal
            if (templatesModal) {
                const modal = bootstrap.Modal.getInstance(templatesModal);
                if (modal) modal.hide();
            }
            
            showToast(`Template "${template.name}" applied successfully`, 'success');
        }
        
        // Update prescription stats
        function updatePrescriptionStats() {
            const stats = {
                total: 158,
                today: 9,
                pending: 2,
                templates: 12
            };
            
            // Update stat cards with animation
            Object.keys(stats).forEach(key => {
                const element = document.getElementById(`${key}Prescriptions`) || document.getElementById(`saved${key.charAt(0).toUpperCase() + key.slice(1)}`);
                if (element) {
                    animateCounter(element, stats[key]);
                }
            });
        }
        
        // Search functionality
        function initializeSearch() {
            if (globalSearch) {
                globalSearch.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    console.log('🔍 Searching for:', searchTerm);
                    
                    // Filter table rows
                    const tableRows = document.querySelectorAll('#prescriptionsTableBody tr');
                    tableRows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        if (text.includes(searchTerm)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            }
        }
        
        // Filter functionality
        function initializeFilters() {
            const dateFilter = document.getElementById('dateFilter');
            const statusFilter = document.getElementById('statusFilter');
            const patientFilter = document.getElementById('patientFilter');
            const departmentFilter = document.getElementById('departmentFilter');
            const resetFilters = document.getElementById('resetFilters');
            
            [dateFilter, statusFilter, patientFilter, departmentFilter].forEach(filter => {
                if (filter) {
                    filter.addEventListener('change', applyFilters);
                }
            });
            
            if (resetFilters) {
                resetFilters.addEventListener('click', function() {
                    [dateFilter, statusFilter, patientFilter, departmentFilter].forEach(filter => {
                        if (filter) filter.value = '';
                    });
                    applyFilters();
                    showToast('Filters reset', 'info');
                });
            }
        }
        
        function applyFilters() {
            console.log('🔧 Applying filters...');
            // Add filter logic here
            showToast('Filters applied', 'success');
        }
        
        // Export functionality
        function initializeExport() {
            const exportBtn = document.getElementById('exportBtn');
            const downloadPdfBtn = document.getElementById('downloadPdfBtn');
            const emailPrescriptionBtn = document.getElementById('emailPrescriptionBtn');
            
            if (exportBtn) {
                exportBtn.addEventListener('click', function() {
                    console.log('📤 Exporting prescriptions...');
                    showToast('Export started...', 'info');
                    
                    // Simulate export
                    setTimeout(() => {
                        showToast('Prescriptions exported successfully', 'success');
                    }, 2000);
                });
            }
            
            if (downloadPdfBtn) {
                downloadPdfBtn.addEventListener('click', function() {
                    console.log('📄 Downloading PDF...');
                    showToast('PDF download started...', 'info');
                });
            }
            
            if (emailPrescriptionBtn) {
                emailPrescriptionBtn.addEventListener('click', function() {
                    console.log('📧 Emailing prescription...');
                    showToast('Prescription sent via email', 'success');
                });
            }
        }
        
        // Utility functions
        function showLoading(show) {
            if (loadingOverlay) {
                if (show) {
                    loadingOverlay.classList.add('show');
                } else {
                    loadingOverlay.classList.remove('show');
                }
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
        
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
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
                max-width: 300px;
                white-space: pre-line;
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
        
        // Initialize theme and sidebar (same as dashboard)
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
            
            console.log('🏗️ Sidebar initialized');
        }
        
        // EVENT LISTENERS (Same as dashboard)
        if (themeToggle) {
            themeToggle.removeEventListener('click', toggleTheme);
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Theme button clicked directly');
                toggleTheme();
            });
            console.log('✅ Theme toggle listener attached');
        }
        
        if (sidebarToggle) {
            sidebarToggle.removeEventListener('click', toggleSidebar);
            sidebarToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Hamburger button clicked directly');
                toggleSidebar();
            });
            console.log('✅ Sidebar toggle listener attached');
        }
        
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🎭 Backdrop clicked');
                closeSidebar();
            });
        }
        
        // Prescription-specific event listeners
        if (createPrescriptionBtn) {
            createPrescriptionBtn.addEventListener('click', createNewPrescription);
        }
        
        if (addMedicationBtn) {
            addMedicationBtn.addEventListener('click', addMedication);
        }
        
        if (savePrescriptionBtn) {
            savePrescriptionBtn.addEventListener('click', savePrescription);
        }
        
        if (previewPrescriptionBtn) {
            previewPrescriptionBtn.addEventListener('click', previewPrescription);
        }
        
        // Window resize handler
        window.addEventListener('resize', function() {
            console.log('📱 Window resized to:', window.innerWidth);
            
            if (window.innerWidth > 768) {
                closeSidebar();
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
        
        // Initialize everything
        initializeTheme();
        initializeSidebar();
        initializePrescriptionData();
        handlePatientSelection();
        handleFollowUpRequirement();
        initializeSearch();
        initializeFilters();
        initializeExport();
        updatePrescriptionStats();
        
        console.log('🎉 Prescription Management fully initialized!');
    }
});

// Global functions for HTML onclick events
window.createNewPrescription = function() {
    console.log('💊 Creating new prescription...');
    const event = new CustomEvent('createPrescription');
    document.dispatchEvent(event);
};

window.useTemplate = function() {
    console.log('📋 Opening templates...');
    const templatesGrid = document.getElementById('templatesGrid');
    if (templatesGrid) {
        // Load templates if not already loaded
        const templatesModal = document.getElementById('templatesModal');
        if (templatesModal) {
            const modal = new bootstrap.Modal(templatesModal);
            modal.show();
        }
    }
};

window.viewPendingPrescriptions = function() {
    console.log('⏳ Viewing pending prescriptions...');
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.value = 'pending';
        statusFilter.dispatchEvent(new Event('change'));
    }
};

window.manageTemplates = function() {
    console.log('🔧 Managing templates...');
    window.useTemplate();
};

window.viewPrescription = function(prescriptionId) {
    console.log('👁️ Viewing prescription:', prescriptionId);
    showToast(`Loading prescription ${prescriptionId}...`, 'info');
};

window.editPrescription = function(prescriptionId) {
    console.log('✏️ Editing prescription:', prescriptionId);
    showToast(`Opening prescription ${prescriptionId} for editing...`, 'info');
};

window.removeMedication = function(index) {
    console.log('🗑️ Removing medication at index:', index);
    const medicationItem = document.querySelector(`[data-medication-index="${index}"]`);
    if (medicationItem) {
        medicationItem.remove();
        showToast('Medication removed', 'info');
    }
};

// Listen for theme changes from other pages (same as dashboard)
window.addEventListener('storage', function(e) {
    if (e.key === 'medicare-doctor-theme') {
        console.log('🌍 Theme changed in another tab/page:', e.newValue);
        
        const newTheme = e.newValue || 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        
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

// Utility function for showing toast messages (shared with global scope)
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
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
        max-width: 300px;
        white-space: pre-line;
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
