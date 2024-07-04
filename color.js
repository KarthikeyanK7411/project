document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('color-form');
  const colorInput = document.getElementById('color-input');
  const colorsContainer = document.getElementById('colors');

  // Named color mapping
  const namedColors = {
    red: '#ff0000',
    green: '#008000',
    blue: '#0000ff',
    white: '#ffffff',
    black: '#000000',
    // Add more named colors as needed
  };

  // Function to convert various color formats to RGB
  const convertToRGB = (color) => {
    color = color.toLowerCase();
    if (namedColors[color]) { // Named colors
      return hexToRGB(namedColors[color]);
    } else if (/^#[0-9A-F]{3}$/i.test(color)) { // Shorthand Hex
      return shorthandHexToRGB(color);
    } else if (/^#[0-9A-F]{6}$/i.test(color)) { // Full Hex
      return hexToRGB(color);
    } else if (/^rgb/i.test(color)) { // RGB
      return parseRGB(color);
    } else if (/^hsl/i.test(color)) { // HSL
      return hslToRGB(color);
    } else {
      throw new Error('Invalid color format');
    }
  };

  // Convert full-length hex to RGB
  const hexToRGB = (hex) => {
    let R = parseInt(hex.slice(1, 3), 16);
    let G = parseInt(hex.slice(3, 5), 16);
    let B = parseInt(hex.slice(5, 7), 16);
    return [R, G, B];
  };

  // Convert shorthand hex (#rgb) to full-length hex (#rrggbb) and then to RGB
  const shorthandHexToRGB = (hex) => {
    let R = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    let G = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    let B = parseInt(hex.charAt(3) + hex.charAt(3), 16);
    return [R, G, B];
  };

  // Parse RGB string
  const parseRGB = (rgb) => {
    let values = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
    return [parseInt(values[1]), parseInt(values[2]), parseInt(values[3])];
  };

  // Convert HSL to RGB
  const hslToRGB = (hsl) => {
    let [h, s, l] = hsl.match(/(\d+),\s*(\d+)%,\s*(\d+)%/).slice(1).map(Number);
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let [r, g, b] = h < 60 ? [c, x, 0] :
                    h < 120 ? [x, c, 0] :
                    h < 180 ? [0, c, x] :
                    h < 240 ? [0, x, c] :
                    h < 300 ? [x, 0, c] :
                              [c, 0, x];
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return [r, g, b];
  };

  // Function to generate color variations
  const generateColors = (baseColor) => {
    const rgb = convertToRGB(baseColor);
    const shades = [];
    for (let i = 0; i < 20; i++) {
      shades.push(shadeColor(rgb, (i - 10) * 10));
    }
    return shades;
  };

  // Function to shade or tint the color
  const shadeColor = (rgb, percent) => {
    let [R, G, B] = rgb;
    R = Math.min(Math.max(0, R * (100 + percent) / 100), 255);
    G = Math.min(Math.max(0, G * (100 + percent) / 100), 255);
    B = Math.min(Math.max(0, B * (100 + percent) / 100), 255);
    return `rgb(${Math.round(R)}, ${Math.round(G)}, ${Math.round(B)})`;
  };

  // Function to create color elements
  const createColorElements = (colors) => {
    colorsContainer.innerHTML = '';
    colors.forEach((color, index) => {
      const article = document.createElement('article');
      article.className = 'color';
      article.style.backgroundColor = color;
      article.innerHTML = `
        <p class="percent-value">${index * 5 - 50}%</p>
        <p class="color-value">${color}</p>`;
      colorsContainer.appendChild(article);
    });
  };

  // Form submit event handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const colorCode = colorInput.value.trim();
    try {
      const colors = generateColors(colorCode);
      createColorElements(colors);
    } catch (error) {
      alert('Invalid color code! Please enter a valid hex, rgb, hsl, or named color code.');
    }
  });

  // Initial generation
  form.dispatchEvent(new Event('submit'));
});
