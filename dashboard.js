// Function to show a specific section and hide others
function showSection(sectionId) {
  // Hide all sections first
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  }
}

// Initialize the dashboard by showing the default section
document.addEventListener('DOMContentLoaded', function() {
  // Show the first section by default (adjust as needed)
  const defaultSection = document.querySelector('.dashboard-section');
  if (defaultSection) {
    const defaultSectionId = defaultSection.id;
    showSection(defaultSectionId);
  }
});
