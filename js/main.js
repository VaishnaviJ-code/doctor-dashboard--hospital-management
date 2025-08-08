// Shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Dark mode toggle
const toggle = document.getElementById('modeToggle');
const mobileMenu = document.getElementById('mobileMenu');
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  navbar.classList.toggle('navbar-dark-mode');
  mobileMenu.classList.toggle('dark-mode');
});

// Mobile menu toggle
const openMenu = document.getElementById('openMenu');
const closeMenu = document.getElementById('closeMenu');
const hamburgerIcon = document.getElementById('hamburgerIcon');
let isMenuOpen = false;

// Open menu
openMenu.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;
  mobileMenu.classList.toggle('active');

  if (isMenuOpen) {
    hamburgerIcon.classList.remove('fa-bars', 'text-success');
    hamburgerIcon.classList.add('fa-times', 'text-danger');
  } else {
    hamburgerIcon.classList.remove('fa-times', 'text-danger');
    hamburgerIcon.classList.add('fa-bars', 'text-success');
  }
});

// Close menu
closeMenu.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  isMenuOpen = false;
  hamburgerIcon.classList.remove('fa-times', 'text-danger');
  hamburgerIcon.classList.add('fa-bars', 'text-success');
});

// Mobile dropdown toggle
const mobileAboutToggle = document.getElementById('mobileAboutToggle');
const mobileDropdown = document.getElementById('mobileDropdown');
let isMobileDropdownOpen = false;

mobileAboutToggle.addEventListener('click', (e) => {
  e.preventDefault();
  isMobileDropdownOpen = !isMobileDropdownOpen;
  
  if (isMobileDropdownOpen) {
    mobileDropdown.style.display = 'block';
    mobileAboutToggle.style.color = '#2e7d32';
  } else {
    mobileDropdown.style.display = 'none';
    mobileAboutToggle.style.color = '#43a047';
  }
});

// Close mobile menu when clicking on dropdown items
const mobileDropdownItems = document.querySelectorAll('.mobile-dropdown-item');
mobileDropdownItems.forEach(item => {
  item.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    isMenuOpen = false;
    isMobileDropdownOpen = false;
    mobileDropdown.style.display = 'none';
    hamburgerIcon.classList.remove('fa-times', 'text-danger');
    hamburgerIcon.classList.add('fa-bars', 'text-success');
  });
});

// Close mobile menu when clicking on regular nav items
const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-link:not(#mobileAboutToggle)');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    isMenuOpen = false;
    hamburgerIcon.classList.remove('fa-times', 'text-danger');
    hamburgerIcon.classList.add('fa-bars', 'text-success');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Close desktop dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.dropdown');
  
  if (dropdown && !dropdown.contains(e.target)) {
    const bootstrapDropdown = bootstrap.Dropdown.getInstance(document.getElementById('aboutDropdown'));
    if (bootstrapDropdown) {
      bootstrapDropdown.hide();
    }
  }
});

// Services Carousel Auto-play and Hover Controls
document.addEventListener('DOMContentLoaded', function() {
  // Auto-play pause on hover
  const carousel = document.getElementById('servicesCarousel');
  
  if (carousel) {
    const carouselInstance = new bootstrap.Carousel(carousel, {
      interval: 4000, // 4 seconds
      wrap: true,
      pause: 'hover'
    });
    
    // Pause carousel on hover
    carousel.addEventListener('mouseenter', () => {
      carouselInstance.pause();
    });
    
    // Resume carousel when mouse leaves
    carousel.addEventListener('mouseleave', () => {
      carouselInstance.cycle();
    });

    // Optional: Pause on focus (for accessibility)
    carousel.addEventListener('focusin', () => {
      carouselInstance.pause();
    });

    carousel.addEventListener('focusout', () => {
      carouselInstance.cycle();
    });
  }
});