// Import html2canvas dynamically or use it from global scope
import html2canvas from "html2canvas";

export class ModernBratGenerator {
  constructor() {
    this.isGreenTheme = false;
    this.currentFontSize = 120;
    this.friedLevel = 80;

    this.initializeElements();
    this.bindEvents();
    this.setupTextFit();
    this.render();
  }

  initializeElements() {
    this.textInput = document.getElementById("textInput");
    this.textOverlay = document.getElementById("textOverlay");
    this.fontSizeSlider = document.getElementById("fontSizeSlider");
    this.fontSizeValue = document.getElementById("fontSizeValue");
    this.friedLevelSlider = document.getElementById("friedLevel");
    this.friedValue = document.getElementById("friedValue");
    this.memeContainer = document.getElementById("memeContainer");
    this.memeImage = document.getElementById("memeImage");
  }

  bindEvents() {
    // Text input events
    this.textInput.addEventListener("input", () => {
      this.updateText();
      this.fitText();
    });

    // Font size slider
    this.fontSizeSlider.addEventListener("input", (e) => {
      this.currentFontSize = parseInt(e.target.value);
      this.fontSizeValue.textContent = this.currentFontSize + "px";
      this.fitText();
    });

    // Fried level slider
    this.friedLevelSlider.addEventListener("input", (e) => {
      this.friedLevel = parseInt(e.target.value);
      this.friedValue.textContent = this.friedLevel + "%";

      // Update blur effect in real-time
      const blurAmount = (this.friedLevel / 100) * 3;
      this.textOverlay.style.filter = `blur(${blurAmount}px)`;
    });

    // Auto-resize on window resize
    window.addEventListener("resize", () => {
      setTimeout(() => this.fitText(), 100);
    });
  }

  updateText() {
    const text = this.textInput.value.toLowerCase() || "brat";
    this.textOverlay.textContent = text;

    // Text mulai dari kiri atas
    this.textOverlay.style.textAlign = "left";
    this.textOverlay.style.display = "block";
    this.textOverlay.style.position = "absolute";
    this.textOverlay.style.top = "2rem";
    this.textOverlay.style.left = "2rem";
    this.textOverlay.style.width = "calc(100% - 4rem)";
    this.textOverlay.style.transform = "none";

    // Apply blur effect based on fried level for preview
    const blurAmount = (this.friedLevel / 100) * 3;
    this.textOverlay.style.filter = `blur(${blurAmount}px)`;

    // Update font family for better brat look
    this.textOverlay.style.fontFamily =
      '"Arial Black", "Helvetica", Arial, Impact, sans-serif';
    this.textOverlay.style.lineHeight = "0.9";
  }

  setupTextFit() {
    // Enhanced text fitting for preview
    this.fitText = () => {
      const container = this.memeContainer;
      const textElement = this.textOverlay;
      const text = textElement.textContent;

      if (!text || !container) return;

      const containerRect = container.getBoundingClientRect();
      const maxWidth = containerRect.width - 64; // Account for padding
      const maxHeight = containerRect.height - 64;

      // Start with current font size and reduce if necessary
      let fontSize = this.currentFontSize;
      textElement.style.fontSize = fontSize + "px";

      // Check if text overflows and reduce font size accordingly
      while (fontSize > 20) {
        textElement.style.fontSize = fontSize + "px";

        const textRect = textElement.getBoundingClientRect();
        const textHeight = textElement.scrollHeight;

        // Check if text fits within container bounds
        if (textHeight <= maxHeight && textElement.scrollWidth <= maxWidth) {
          break;
        }

        fontSize -= 5;
      }

      textElement.style.fontSize = fontSize + "px";
    };
  }

  render() {
    this.updateText();
    this.fitText();
  }

  // Create canvas with proper background
  async createCanvasWithBackground() {
    const container = this.memeContainer;
    const containerRect = container.getBoundingClientRect();

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to match container
    const size = 600; // Fixed size for consistency
    canvas.width = size;
    canvas.height = size;

    // Fill background color first
    const bgColor = this.isGreenTheme ? "#00d4ff" : "#FFFFFF";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Try to load and draw background image
    try {
      const bgImage = new Image();
      bgImage.crossOrigin = "anonymous";

      const imagePromise = new Promise((resolve, reject) => {
        bgImage.onload = resolve;
        bgImage.onerror = () => resolve(); // Continue without image if failed
        
        bgImage.src = "../images/brat-deluxe.png";
      });

      await imagePromise;

      ctx.drawImage(bgImage, 0, 0, size, size);
    } catch (error) {
      console.warn("Background image failed to load, using solid color");
    }

    // Draw text with auto-resize and blur effect
    const text = this.textOverlay.textContent;
    const maxWidth = size - 64; // Padding left/right
    const maxHeight = size - 64; // Padding top/bottom
    const baseFontSize = Math.min(this.currentFontSize, size / 3);

    ctx.fillStyle = "#000000";
    ctx.textBaseline = "top";

    // Calculate optimal font size and get wrapped lines
    const { fontSize, lines } = this.calculateOptimalFontSize(
      ctx,
      text,
      maxWidth,
      maxHeight,
      baseFontSize,
    );

    // Apply blur effect based on fried level
    const blurAmount = (this.friedLevel / 100) * 3; // Max 3px blur
    ctx.filter = `blur(${blurAmount}px)`;

    // Set font with better styling for brat look
    ctx.font = `900 ${fontSize}px "Arial Black", "Helvetica", Arial, Impact, sans-serif`;

    let y = 32; // Start from top with padding
    const lineHeight = fontSize * 0.9; // Slightly tighter line spacing

    // Add multiple shadows for better effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    lines.forEach((line) => {
      ctx.fillText(line, 32, y);
      y += lineHeight;
    });

    // Reset filter and shadow
    ctx.filter = "none";
    ctx.shadowColor = "transparent";

    return canvas;
  }

  // Helper function to calculate optimal font size
  calculateOptimalFontSize(ctx, text, maxWidth, maxHeight, baseFontSize) {
    let fontSize = baseFontSize;
    let lines = [];

    // Start with base font size and reduce until text fits
    for (let size = fontSize; size >= 20; size -= 5) {
      ctx.font = `900 ${size}px ArialNarrow, Arial, Impact, sans-serif`;
      lines = this.wrapText(ctx, text, maxWidth);

      const lineHeight = size * 0.85;
      const totalHeight = lines.length * lineHeight;

      if (totalHeight <= maxHeight) {
        fontSize = size;
        break;
      }
    }

    return { fontSize, lines };
  }

  // Helper function to wrap text
  wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];

    if (words.length === 1) {
      // Single word - check if it fits
      const width = ctx.measureText(text).width;
      if (width <= maxWidth) {
        lines.push(text);
      } else {
        // Break long single word into characters if needed
        let currentLine = "";
        for (const char of text) {
          const testLine = currentLine + char;
          const testWidth = ctx.measureText(testLine).width;
          if (testWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = char;
          }
        }
        if (currentLine) lines.push(currentLine);
      }
      return lines;
    }

    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const width = ctx.measureText(testLine).width;

      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    return lines;
  }

  // Download image functionality - Fixed version
  async downloadImage() {
    const button = event.target;
    button.classList.add("loading");
    button.textContent = "Generating...";

    try {
      // Create canvas with proper background
      const canvas = await this.createCanvasWithBackground();

      // Apply fried effect by adjusting quality
      const quality = Math.max(0.1, 1 - this.friedLevel / 100);
      const dataURL = canvas.toDataURL("image/jpeg", quality);

      // Create download link
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `brat-${Date.now()}.jpg`;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      button.classList.remove("loading");
      button.textContent = "Download";
    }
  }

  // Preview image functionality - Fixed version
  async previewImage() {
    const button = event.target;
    button.classList.add("loading");
    button.textContent = "Previewing...";

    try {
      // Create canvas with proper background
      const canvas = await this.createCanvasWithBackground();

      // Apply fried effect by adjusting quality
      const quality = Math.max(0.1, 1 - this.friedLevel / 100);
      const dataURL = canvas.toDataURL("image/jpeg", quality);

      // Show in new window
      const newWindow = window.open("about:blank");
      const img = newWindow.document.createElement("img");
      img.src = dataURL;
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      newWindow.document.body.appendChild(img);
      newWindow.document.body.style.margin = "0";
      newWindow.document.body.style.padding = "20px";
      newWindow.document.body.style.background = "#000";
      newWindow.document.body.style.display = "flex";
      newWindow.document.body.style.justifyContent = "center";
      newWindow.document.body.style.alignItems = "center";
      newWindow.document.body.style.minHeight = "100vh";
    } catch (error) {
      console.error("Preview failed:", error);
    } finally {
      button.classList.remove("loading");
      button.textContent = "Preview";
    }
  }
}
