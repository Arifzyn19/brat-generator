import html2canvas from "html2canvas";

export class BratGenerator {
  constructor() {
    this.isGreenTheme = false;
    this.currentFontSize = 200;
    this.friedLevel = 80;
    
    this.fontFamily = '"Archivo Narrow", Arial, sans-serif';

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
    this.textInput.addEventListener("input", () => {
      this.updateText();
      this.fitText();
    });

    this.fontSizeSlider.addEventListener("input", (e) => {
      this.currentFontSize = parseInt(e.target.value);
      this.fontSizeValue.textContent = this.currentFontSize + "px";
      this.fitText();
    });

    this.friedLevelSlider.addEventListener("input", (e) => {
      this.friedLevel = parseInt(e.target.value);
      this.friedValue.textContent = this.friedLevel + "%";

      const blurAmount = (this.friedLevel / 100) * 3;
      this.textOverlay.style.filter = `blur(${blurAmount}px)`;
    });

    window.addEventListener("resize", () => {
      setTimeout(() => this.fitText(), 100);
    });
  }

  updateText() {
    const text = this.textInput.value.toLowerCase() || "brat";
    this.textOverlay.textContent = text;

    this.textOverlay.style.textAlign = "left";
    this.textOverlay.style.display = "block";
    this.textOverlay.style.position = "absolute";
    this.textOverlay.style.top = "2rem";
    this.textOverlay.style.left = "2rem";
    this.textOverlay.style.width = "calc(100% - 4rem)";
    this.textOverlay.style.transform = "none";

    const blurAmount = (this.friedLevel / 100) * 3;
    this.textOverlay.style.filter = `blur(${blurAmount}px)`;
    
    this.textOverlay.style.fontFamily = this.fontFamily;
    this.textOverlay.style.fontWeight = "900";
    this.textOverlay.style.lineHeight = "0.9";
  }

  setupTextFit() {
    this.fitText = () => {
      const container = this.memeContainer;
      const textElement = this.textOverlay;
      const text = textElement.textContent;

      if (!text || !container) return;

      const containerRect = container.getBoundingClientRect();
      const maxWidth = containerRect.width - 64;
      const maxHeight = containerRect.height - 64;

      let fontSize = this.currentFontSize;
      textElement.style.fontSize = fontSize + "px";
      textElement.style.fontWeight = "200";

      while (fontSize > 20) {
        textElement.style.fontSize = fontSize + "px";

        const textRect = textElement.getBoundingClientRect();
        const textHeight = textElement.scrollHeight;

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

  async createCanvasWithBackground() {
    const container = this.memeContainer;
    const containerRect = container.getBoundingClientRect();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const size = 600;
    canvas.width = size;
    canvas.height = size;

    const bgColor = this.isGreenTheme ? "#00d4ff" : "#FFFFFF";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    try {
      const bgImage = new Image();
      bgImage.crossOrigin = "anonymous";

      const imagePromise = new Promise((resolve, reject) => {
        bgImage.onload = resolve;
        bgImage.onerror = () => resolve();
        
        bgImage.src = "../images/brat-deluxe.png";
      });

      await imagePromise;

      ctx.drawImage(bgImage, 0, 0, size, size);
    } catch (error) {
      console.warn("Background image failed to load, using solid color");
    }

    const text = this.textOverlay.textContent;
    const maxWidth = size - 64;
    const maxHeight = size - 64;
    const baseFontSize = Math.min(this.currentFontSize, size / 3);

    ctx.fillStyle = "#000000";
    ctx.textBaseline = "top";

    const { fontSize, lines } = this.calculateOptimalFontSize(
      ctx,
      text,
      maxWidth,
      maxHeight,
      baseFontSize,
    );

    const blurAmount = (this.friedLevel / 100) * 3;
    ctx.filter = `blur(${blurAmount}px)`;

    // Gunakan font family yang sama dengan tampilan
    ctx.font = `900 ${fontSize}px ${this.fontFamily}`;

    let y = 32;
    const lineHeight = fontSize * 0.9;

    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    lines.forEach((line) => {
      ctx.fillText(line, 32, y);
      y += lineHeight;
    });

    ctx.filter = "none";
    ctx.shadowColor = "transparent";

    return canvas;
  }

  calculateOptimalFontSize(ctx, text, maxWidth, maxHeight, baseFontSize) {
    let fontSize = baseFontSize;
    let lines = [];

    for (let size = fontSize; size >= 20; size -= 5) {
      // Gunakan font family yang konsisten
      ctx.font = `900 ${size}px ${this.fontFamily}`;
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

  wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];

    if (words.length === 1) {
      const width = ctx.measureText(text).width;
      if (width <= maxWidth) {
        lines.push(text);
      } else {
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

  async downloadImage() {
    const button = event.target;
    button.classList.add("loading");
    button.textContent = "Generating...";

    try {
      const canvas = await this.createCanvasWithBackground();

      const quality = Math.max(0.1, 1 - this.friedLevel / 100);
      const dataURL = canvas.toDataURL("image/jpeg", quality);

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

  async previewImage() {
    const button = event.target;
    button.classList.add("loading");
    button.textContent = "Previewing...";

    try {
      const canvas = await this.createCanvasWithBackground();

      const quality = Math.max(0.1, 1 - this.friedLevel / 100);
      const dataURL = canvas.toDataURL("image/jpeg", quality);

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