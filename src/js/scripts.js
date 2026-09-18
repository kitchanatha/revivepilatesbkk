//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // GA4 event tracking for conversion actions (calls, LINE chats, CTAs).
    // Reads the event name + location off data-gtag-* attributes so pug
    // templates stay declarative and this stays a single generic handler.
    // No-ops safely if gtag isn't loaded (GA4 not yet configured, or an
    // ad-blocker dropped it).
    document.querySelectorAll('[data-gtag-event]').forEach(el => {
        el.addEventListener('click', () => {
            if (typeof gtag !== 'function') {
                return;
            }
            gtag('event', el.dataset.gtagEvent, {
                cta_location: el.dataset.gtagLocation || 'unknown'
            });
        });
    });

});
