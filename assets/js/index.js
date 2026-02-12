document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        once: true,
        offset: 50
    });

    // Initialize Video Thumbnails
    enhanceVideoThumbnails();

    // Navigation Scroll Effect
    const nav = document.getElementById('nav-bar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-active');
        } else {
            nav.classList.remove('nav-active');
        }
    });

    // Custom Cursor Glow effect (Subtle)
    const cursorGlow = document.getElementById('cursor-glow');

    // Add style for cursor glow if not in CSS
    if (cursorGlow) {
        Object.assign(cursorGlow.style, {
            position: 'fixed',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(44,138,255, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '-1',
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s ease',
            opacity: '0'
        });

        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars-staggered', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars-staggered');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars-staggered');
            });
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Mailto Logic
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            window.location.href = `mailto:mohammedelserrry@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    // Fullscreen Video Functionality
    const fullscreenButtons = document.querySelectorAll('.fullscreen-btn');

    fullscreenButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const videoItem = this.closest('.video-item');

            // Check if native fullscreen is supported on the element
            const isNativeSupported = videoItem.requestFullscreen ||
                videoItem.webkitRequestFullscreen ||
                videoItem.msRequestFullscreen;

            // iOS Safari specific check (it doesn't support fullscreen on non-video elements)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            if (isNativeSupported && !isIOS) {
                handleNativeFullscreen(videoItem, this);
            } else {
                handlePseudoFullscreen(videoItem, this);
            }
        });
    });

    function handleNativeFullscreen(element, button) {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            // Enter fullscreen
            if (element.requestFullscreen) {
                element.requestFullscreen().catch(err => {
                    console.warn('Native fullscreen failed, falling back', err);
                    handlePseudoFullscreen(element, button);
                });
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    function handlePseudoFullscreen(element, button) {
        const icon = button.querySelector('i');

        if (!element.classList.contains('pseudo-fullscreen')) {
            // Enter pseudo-fullscreen
            element.classList.add('pseudo-fullscreen');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');

            // Move element to end of body to ensure z-index works (optional but safer)
            // But doing so might reset iframe content. CSS fixed position usually works fine if z-index is high enough.
        } else {
            // Exit pseudo-fullscreen
            element.classList.remove('pseudo-fullscreen');
            document.body.style.overflow = ''; // Restore scrolling
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
    }

    // Listen for native ESC key or swipe to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const pseudoFullscreenElement = document.querySelector('.video-item.pseudo-fullscreen');
            if (pseudoFullscreenElement) {
                const btn = pseudoFullscreenElement.querySelector('.fullscreen-btn');
                handlePseudoFullscreen(pseudoFullscreenElement, btn);
            }
        }
    });

    // Listen for native fullscreen changes to update icon
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('msfullscreenchange', updateFullscreenIcon);

    function updateFullscreenIcon() {
        const buttons = document.querySelectorAll('.fullscreen-btn');
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

        buttons.forEach(button => {
            const icon = button.querySelector('i');
            // Reset all icons if not in fullscreen (unless pseudo-fullscreen is active)
            if (!isFullscreen) {
                // Only reset if NOT pseudo-fullscreen
                if (!button.closest('.video-item').classList.contains('pseudo-fullscreen')) {
                    icon.classList.remove('fa-compress');
                    icon.classList.add('fa-expand');
                }
            } else {
                // We are in native fullscreen. Find the active element's button and toggle it?
                // Actually the browser handles the "exit" UI usually, but our button is inside.
                // Just ensure the button inside the fullscreen element shows "compress"
                if (button.closest('.video-item') === isFullscreen) {
                    icon.classList.remove('fa-expand');
                    icon.classList.add('fa-compress');
                }
            }
        });
    }

    function enhanceVideoThumbnails() {
        const videoItems = document.querySelectorAll('.video-item');
        
        videoItems.forEach(item => {
            const iframe = item.querySelector('iframe');
            if (!iframe) return;

            const src = iframe.src;
            // Extract file ID from Google Drive URL
            // Format: https://drive.google.com/file/d/FILE_ID/preview
            const idMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)\//);
            
            if (idMatch && idMatch[1]) {
                const fileId = idMatch[1];
                const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;

                // Create facade container
                const facade = document.createElement('div');
                facade.className = 'video-facade';
                facade.style.backgroundImage = `url('${thumbnailUrl}')`;
                
                // Add play button
                const playBtn = document.createElement('div');
                playBtn.className = 'play-button';
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                facade.appendChild(playBtn);

                // Store original SRC
                facade.dataset.videoSrc = src;

                // Replace iframe with facade
                iframe.remove();
                item.insertBefore(facade, item.firstChild);

                // Add click event to load video
                facade.addEventListener('click', () => {
                    const newIframe = document.createElement('iframe');
                    newIframe.src = facade.dataset.videoSrc + '?autoplay=1'; // Try enabling autoplay
                    newIframe.allow = "autoplay; fullscreen";
                    // allow="autoplay" is standard, but some browsers block it.
                    
                    // Insert iframe
                    item.insertBefore(newIframe, facade);
                    
                    // Remove facade
                    facade.remove();
                });
            }
        });
    }
});
