// Doctor Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const loginForm = document.getElementById('doctorLoginForm');
  const emailInput = document.getElementById('doctorEmail');
  const passwordInput = document.getElementById('doctorPassword');
  const togglePassword = document.getElementById('togglePassword');
  const loginMessage = document.getElementById('loginMessage');
  const loginBtn = loginForm.querySelector('.btn-login');
  const loginBtnContent = loginBtn.querySelector('.login-btn-content');
  const loginSpinner = loginBtn.querySelector('.login-spinner');
  const copyButtons = document.querySelectorAll('.copy-btn');

  // Demo credentials
  const DEMO_EMAIL = 'doctor@medicare.com';
  const DEMO_PASSWORD = 'MediCare2024!';

  // Theme Management
  function initializeTheme() {
    const savedTheme = localStorage.getItem('medicare-doctor-theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && systemDarkMode);
    
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('medicare-doctor-theme', 'light');
    } else {
      document.body.classList.add('dark-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('medicare-doctor-theme', 'dark');
    }
  }

  // Copy to Clipboard Functionality
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      return new Promise((resolve, reject) => {
        document.execCommand('copy') ? resolve() : reject();
        textArea.remove();
      });
    }
  }

  function showCopyFeedback(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#28a745';
    button.style.color = 'white';
    
    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.style.background = '';
      button.style.color = '';
    }, 2000);
  }

  // Password Toggle Functionality
  function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  }

  // Validation Functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 5;
  }

  function validatePassword(password) {
    return password.length >= 8;
  }

  function showFieldValidation(input, isValid) {
    input.classList.remove('is-invalid', 'is-valid');
    if (input.value.trim()) {
      input.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
  }

  function showMessage(message, type, duration = 5000) {
    loginMessage.textContent = message;
    loginMessage.className = `login-message ${type}`;
    loginMessage.classList.remove('d-none');
    
    setTimeout(() => {
      loginMessage.classList.add('d-none');
    }, duration);
  }

  function setLoadingState(loading) {
    loginBtn.disabled = loading;
    if (loading) {
      loginBtnContent.classList.add('d-none');
      loginSpinner.classList.remove('d-none');
    } else {
      loginBtnContent.classList.remove('d-none');
      loginSpinner.classList.add('d-none');
    }
  }

  function showSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Start progress bar animation
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.width = '100%';
    }, 100);
    
    // Auto close and redirect after 3 seconds
    setTimeout(() => {
      successModal.hide();
      // In a real application, redirect to dashboard
      window.location.href = '../html/doctor-dashboard.html';
    }, 3000);
  }

  function resetForm() {
    loginForm.reset();
    emailInput.classList.remove('is-invalid', 'is-valid');
    passwordInput.classList.remove('is-invalid', 'is-valid');
    loginMessage.classList.add('d-none');
    
    // Reset password visibility
    passwordInput.setAttribute('type', 'password');
    const icon = togglePassword.querySelector('i');
    icon.classList.add('fa-eye');
    icon.classList.remove('fa-eye-slash');
  }

  function simulateLogin(email, password) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          resolve({ success: true, message: 'Login successful!' });
        } else {
          resolve({ 
            success: false, 
            message: 'Invalid email or password. Please check your credentials and try again.' 
          });
        }
      }, 1500);
    });
  }

  // Auto-fill demo credentials
  function fillDemoCredentials() {
    emailInput.value = DEMO_EMAIL;
    passwordInput.value = DEMO_PASSWORD;
    showFieldValidation(emailInput, true);
    showFieldValidation(passwordInput, true);
  }

  // Event Listeners
  themeToggle.addEventListener('click', toggleTheme);
  togglePassword.addEventListener('click', togglePasswordVisibility);

  // Copy button functionality
  copyButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const textToCopy = this.getAttribute('data-copy');
      
      try {
        await copyToClipboard(textToCopy);
        showCopyFeedback(this);
        
        // Auto-fill if copying credentials
        if (textToCopy === DEMO_EMAIL || textToCopy === DEMO_PASSWORD) {
          setTimeout(() => {
            fillDemoCredentials();
          }, 500);
        }
      } catch (err) {
        console.error('Failed to copy: ', err);
        showMessage('Failed to copy to clipboard', 'error', 2000);
      }
    });
  });

  // Real-time validation
  emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email) {
      showFieldValidation(this, validateEmail(email));
    }
  });

  emailInput.addEventListener('input', function() {
    const email = this.value.trim();
    if (email && this.classList.contains('is-invalid')) {
      if (validateEmail(email)) {
        showFieldValidation(this, true);
      }
    }
  });

  passwordInput.addEventListener('blur', function() {
    const password = this.value;
    if (password) {
      showFieldValidation(this, validatePassword(password));
    }
  });

  passwordInput.addEventListener('input', function() {
    const password = this.value;
    if (password && this.classList.contains('is-invalid')) {
      if (validatePassword(password)) {
        showFieldValidation(this, true);
      }
    }
  });

  // Form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Reset previous states
    emailInput.classList.remove('is-invalid', 'is-valid');
    passwordInput.classList.remove('is-invalid', 'is-valid');
    loginMessage.classList.add('d-none');

    let isValid = true;

    // Validate email
    if (!email) {
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else if (!validateEmail(email)) {
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else {
      emailInput.classList.add('is-valid');
    }

    // Validate password
    if (!password) {
      passwordInput.classList.add('is-invalid');
      isValid = false;
    } else if (!validatePassword(password)) {
      passwordInput.classList.add('is-invalid');
      isValid = false;
    } else {
      passwordInput.classList.add('is-valid');
    }

    if (!isValid) {
      showMessage('Please correct the errors above and try again.', 'error');
      // Focus on first invalid field
      const firstInvalid = document.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Start loading state
    setLoadingState(true);

    try {
      const result = await simulateLogin(email, password);
      
      if (result.success) {
        showMessage(result.message, 'success', 2000);
        
        // Show success modal after short delay
        setTimeout(() => {
          showSuccessModal();
        }, 1000);
      } else {
        showMessage(result.message, 'error');
        setLoadingState(false);
        
        // Clear password on failed login
        passwordInput.value = '';
        passwordInput.classList.remove('is-valid');
        passwordInput.focus();
      }
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', 'error');
      setLoadingState(false);
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D to fill demo credentials
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      fillDemoCredentials();
      showMessage('Demo credentials filled!', 'success', 2000);
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
      resetForm();
    }
  });

  // System theme change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    const savedTheme = localStorage.getItem('medicare-doctor-theme');
    if (!savedTheme) {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      } else {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  });

  // Initialize theme on page load
  initializeTheme();

  // Add smooth scrolling for any anchor links
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

  // Prevent form submission on Enter in certain fields
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Enhanced security: Clear sensitive data on page unload
  window.addEventListener('beforeunload', function() {
    if (passwordInput.value) {
      passwordInput.value = '';
    }
  });

  // Add visual feedback for button interactions
  document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    btn.addEventListener('mouseup', function() {
      this.style.transform = '';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // Console welcome message
  console.log('%c🏥 MediCare Doctor Portal', 'color: #43a047; font-size: 16px; font-weight: bold;');
  console.log('%cDemo Credentials:', 'color: #666; font-size: 12px;');
  console.log('%cEmail: doctor@medicare.com', 'color: #666; font-size: 12px;');
  console.log('%cPassword: MediCare2024!', 'color: #666; font-size: 12px;');
  console.log('%cTip: Press Ctrl+D to auto-fill demo credentials', 'color: #43a047; font-size: 12px;');

});