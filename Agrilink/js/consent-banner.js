/**
 * Privacy Consent Banner Management
 * Handles cookie/privacy consent for AgrilinkEthiopia
 */

(function() {
    'use strict';
    
    const CONSENT_KEY = 'agrilink_privacy_consent';
    const CONSENT_TIMESTAMP_KEY = 'agrilink_consent_timestamp';
    
    /**
     * Check if user has already given consent
     */
    function hasConsent() {
        return localStorage.getItem(CONSENT_KEY) !== null;
    }
    
    /**
     * Get user's consent preference
     */
    function getConsentPreference() {
        return localStorage.getItem(CONSENT_KEY);
    }
    
    /**
     * Save user's consent preference
     */
    function saveConsent(preference) {
        localStorage.setItem(CONSENT_KEY, preference);
        localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    }
    
    /**
     * Show the consent banner with animation
     */
    function showBanner() {
        const banner = document.querySelector('.consent-banner');
        if (banner) {
            // Small delay for smooth animation
            setTimeout(function() {
                banner.classList.add('show');
            }, 500);
        }
    }
    
    /**
     * Hide the consent banner with animation
     */
    function hideBanner() {
        const banner = document.querySelector('.consent-banner');
        if (banner) {
            banner.classList.remove('show');
            // Remove from DOM after animation completes
            setTimeout(function() {
                banner.style.display = 'none';
            }, 400);
        }
    }
    
    /**
     * Handle Accept All button click
     */
    function handleAcceptAll() {
        saveConsent('accepted');
        hideBanner();
        console.log('User accepted all cookies');
        // You can add analytics or other tracking code here
    }
    
    /**
     * Handle Accept Necessary button click
     */
    function handleAcceptNecessary() {
        saveConsent('necessary');
        hideBanner();
        console.log('User accepted necessary cookies only');
        // You can add code to disable non-essential cookies here
    }
    
    /**
     * Handle Reject All button click
     */
    function handleRejectAll() {
        saveConsent('rejected');
        hideBanner();
        console.log('User rejected all cookies');
        // You can add code to disable all non-essential cookies here
    }
    
    /**
     * Initialize the consent banner
     */
    function initConsentBanner() {
        // Check if consent has already been given
        if (hasConsent()) {
            const preference = getConsentPreference();
            console.log('User consent preference:', preference);
            // Hide banner if consent already exists
            const banner = document.querySelector('.consent-banner');
            if (banner) {
                banner.style.display = 'none';
            }
            return;
        }
        
        // Attach event listeners to buttons
        const acceptBtn = document.getElementById('consent-accept');
        const necessaryBtn = document.getElementById('consent-necessary');
        const rejectBtn = document.getElementById('consent-reject');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', handleAcceptAll);
        }
        
        if (necessaryBtn) {
            necessaryBtn.addEventListener('click', handleAcceptNecessary);
        }
        
        if (rejectBtn) {
            rejectBtn.addEventListener('click', handleRejectAll);
        }
        
        // Show the banner
        showBanner();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConsentBanner);
    } else {
        initConsentBanner();
    }
    
    // Export functions for external use if needed
    window.AgrilinkConsent = {
        hasConsent: hasConsent,
        getPreference: getConsentPreference,
        resetConsent: function() {
            localStorage.removeItem(CONSENT_KEY);
            localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
            location.reload();
        }
    };
})();
