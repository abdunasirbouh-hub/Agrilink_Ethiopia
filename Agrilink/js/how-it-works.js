// How It Works Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.role-tab');
    const contents = document.querySelectorAll('.role-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetRole = tab.dataset.role;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all content
            contents.forEach(content => content.classList.remove('active'));
            
            // Show target content
            const targetContent = document.getElementById(`${targetRole}-steps`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});
