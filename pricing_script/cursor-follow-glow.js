// Get all pricing cards
const pricingCards = document.querySelectorAll('.pricing-card');

// Add event listeners to each card
pricingCards.forEach(card => {
  const glowContainer = card.querySelector('.glow-container');
  const glowEffect = card.querySelector('.glow-effect');
  
  // Track mouse movement inside the card
  card.addEventListener('mousemove', (e) => {
    // Get the position of the mouse relative to the card
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update the position of the glow effect
    glowEffect.style.left = `${x}px`;
    glowEffect.style.top = `${y}px`;
  });
  
  // Show glow effect when mouse enters the card
  card.addEventListener('mouseenter', () => {
    glowContainer.style.opacity = '1';
  });
  
  // Hide glow effect when mouse leaves the card
  card.addEventListener('mouseleave', () => {
    glowContainer.style.opacity = '0';
  });
});