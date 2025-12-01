// Newsletter signup functionality
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput.value.trim();
            
            if (!email || !isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Get existing subscribers
            let subscribers = JSON.parse(localStorage.getItem('agrilinkNewsletterSubscribers') || '[]');
            
            // Check if already subscribed
            if (subscribers.find(sub => sub.email === email)) {
                showNotification('You are already subscribed to our newsletter!', 'info');
                emailInput.value = '';
                return;
            }
            
            // Add new subscriber
            subscribers.push({
                email: email,
                subscribedAt: new Date().toISOString(),
                active: true
            });
            
            // Save to localStorage
            localStorage.setItem('agrilinkNewsletterSubscribers', JSON.stringify(subscribers));
            
            // Show success message
            showNotification('🎉 Thank you for subscribing! Check your email for updates.', 'success');
            
            // Clear input
            emailInput.value = '';
            
            // Track subscription
            console.log(`New newsletter subscriber: ${email}`);
        });
    }
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
