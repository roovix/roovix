// Open model
document.getElementById("openProfileShareModel").addEventListener("click", function(){
    // Show the share UI (you'll need to implement this based on your UI structure)
    document.getElementById('share-model-bg').style.display = 'flex';
});

// Add event listener for close button
document.getElementById('closeShareUI').addEventListener('click', function() {
    // Hide the share UI (you'll need to implement this based on your UI structure)
    document.getElementById('share-model-bg').style.display = 'none';
});
document.getElementById('share-model-bg').addEventListener('click', function() {
    // Hide the share UI (you'll need to implement this based on your UI structure)
    document.getElementById('share-model-bg').style.display = 'none';
});

// Prevent background click from hiding modal
document.getElementById("share-modal").addEventListener('click', function(event) {
    event.stopPropagation(); // Stops the click event from reaching 'share-model-bg'
});

// Add event listener for copy button
document.getElementById('share-copy').addEventListener('click', function() {
    const linkText = document.querySelector('#share-link-text').textContent;
    navigator.clipboard.writeText(linkText)
        .then(() => {
            document.getElementById('copyBtn').textContent = 'Copied!';
            setTimeout(() => {
                document.getElementById('copyBtn').textContent = 'Copy Link';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
});