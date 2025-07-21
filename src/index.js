// Import styles
import "./styles/main.css";

// Import modules
import { ModernBratGenerator } from "./js/App.js";
import "./js/textFit.js";

// Theme toggle functionality
function toggleTheme() {
  const memeContainer = document.getElementById("memeContainer");
  const generator = window.bratGenerator;

  if (memeContainer.classList.contains("green-theme")) {
    memeContainer.classList.remove("green-theme");
    generator.isGreenTheme = false;
  } else {
    memeContainer.classList.add("green-theme");
    generator.isGreenTheme = true;
  }
}

// Global functions for button events
function downloadImage() {
  window.bratGenerator.downloadImage();
}

function previewImage() {
  window.bratGenerator.previewImage();
}

// Make functions globally available
window.toggleTheme = toggleTheme;
window.downloadImage = downloadImage;
window.previewImage = previewImage;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.bratGenerator = new ModernBratGenerator();
});
