const fileInput = document.querySelector('#file-input');
const dropZone = document.querySelector('#drop-zone');
const result = document.querySelector('#result');
const previewImage = document.querySelector('#preview-image');
const fileName = document.querySelector('#file-name');
const changeImage = document.querySelector('#change-image');
const shuffleButton = document.querySelector('#shuffle-palette');
const downloadButton = document.querySelector('#download-palette');
const swatches = document.querySelector('#swatches');
const canvas = document.querySelector('#analysis-canvas');
const toast = document.querySelector('#toast');
const uploadError = document.querySelector('#upload-error');

let palette = [];
let sourcePixels = [];
let shuffleSeed = 0;
let objectUrl = null;
let toastTimer = null;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rgbToHex = ([r, g, b]) => `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
const distance = (a, b) => Math.sqrt(a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0));
const luminance = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

function getPixels(image) {
  const maxSide = 320;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixels = [];
  for (let i = 0; i < data.length; i += 16) {
    if (data[i + 3] < 220) continue;
    const color = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(...color);
    const min = Math.min(...color);
    if ((max < 10 || min > 247) && max - min < 4) continue;
    pixels.push(color);
  }
  return pixels;
}

function extractPalette(pixels, seed = 0) {
  const step = seed % 3 === 0 ? 32 : seed % 3 === 1 ? 40 : 24;
  const buckets = new Map();
  pixels.forEach((pixel, index) => {
    if ((index + seed) % (seed % 4 + 1) !== 0) return;
    const key = pixel.map(v => Math.round(v / step) * step).join(',');
    const item = buckets.get(key) || { count: 0, sum: [0, 0, 0] };
    item.count++;
    item.sum[0] += pixel[0]; item.sum[1] += pixel[1]; item.sum[2] += pixel[2];
    buckets.set(key, item);
  });

  const candidates = [...buckets.values()]
    .filter(item => item.count > 2)
    .map(item => ({ color: item.sum.map(v => v / item.count), count: item.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 80);

  const selected = [];
  while (selected.length < 5 && candidates.length) {
    let bestIndex = 0;
    let bestScore = -1;
    candidates.forEach((candidate, index) => {
      const diversity = selected.length ? Math.min(...selected.map(item => distance(candidate.color, item.color))) : 110;
      const popularity = Math.log(candidate.count + 1) * 18;
      const colorfulness = Math.max(...candidate.color) - Math.min(...candidate.color);
      const score = popularity + diversity * 1.35 + colorfulness * .18 + ((index + seed * 7) % 11);
      if (score > bestScore) { bestScore = score; bestIndex = index; }
    });
    selected.push(candidates.splice(bestIndex, 1)[0]);
  }

  const fallback = [[17,17,17], [255,92,53], [93,95,239], [242,191,36], [244,241,232]];
  while (selected.length < 5) selected.push({ color: fallback[selected.length], count: 1 });
  return selected.map(item => item.color.map(value => clamp(Math.round(value), 0, 255)));
}

function colorName([r, g, b]) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const light = (max + min) / 510;
  const delta = max - min;
  if (delta < 15) return light < .18 ? 'INK' : light > .86 ? 'CHALK' : light > .58 ? 'MIST' : 'SLATE';
  let hue = 0;
  if (max === r) hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
  else if (max === g) hue = ((b - r) / delta + 2) * 60;
  else hue = ((r - g) / delta + 4) * 60;
  if (light < .2) return 'MIDNIGHT';
  if (light > .87) return 'PORCELAIN';
  if (hue < 18 || hue >= 345) return light > .62 ? 'BLUSH' : 'CRIMSON';
  if (hue < 45) return light > .62 ? 'APRICOT' : 'RUST';
  if (hue < 68) return light > .7 ? 'BUTTER' : 'OCHRE';
  if (hue < 155) return light > .68 ? 'MINT' : 'FERN';
  if (hue < 195) return light > .68 ? 'AQUA' : 'TEAL';
  if (hue < 255) return light > .68 ? 'SKY' : 'COBALT';
  if (hue < 290) return light > .68 ? 'LILAC' : 'VIOLET';
  if (hue < 345) return light > .68 ? 'ROSE' : 'MAGENTA';
  return 'COLOR';
}

function renderPalette() {
  swatches.innerHTML = '';
  palette.forEach((color, index) => {
    const hex = rgbToHex(color);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `swatch${luminance(color) > .61 ? ' is-light' : ''}`;
    button.style.backgroundColor = hex;
    button.setAttribute('aria-label', `Copy ${hex}`);
    button.title = `Copy ${hex}`;
    button.innerHTML = `<span class="swatch-label">${String(index + 1).padStart(2, '0')} · ${colorName(color)} · ${hex}</span>`;
    button.addEventListener('click', () => copyColor(hex));
    swatches.append(button);
  });
  const dominant = palette[0];
  const mixed = dominant.map(v => Math.round(v * .1 + 244 * .9));
  document.body.style.backgroundColor = rgbToHex(mixed);
}

async function copyColor(hex) {
  try {
    await navigator.clipboard.writeText(hex);
  } catch {
    const input = document.createElement('textarea');
    input.value = hex; document.body.append(input); input.select(); document.execCommand('copy'); input.remove();
  }
  toast.querySelector('span').textContent = hex;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1500);
}

function handleFile(file) {
  if (!file) return;
  uploadError.hidden = true;
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
    uploadError.textContent = 'Please choose a JPG, PNG, WEBP or GIF image.';
    uploadError.hidden = false;
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    uploadError.textContent = 'Please choose an image smaller than 15 MB.';
    uploadError.hidden = false;
    return;
  }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  previewImage.onload = () => {
    try { sourcePixels = getPixels(previewImage); }
    catch {
      uploadError.textContent = 'This image could not be read. Please try another one.';
      uploadError.hidden = false;
      return;
    }
    shuffleSeed = 0;
    palette = extractPalette(sourcePixels, shuffleSeed);
    renderPalette();
    dropZone.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  previewImage.onerror = () => {
    uploadError.textContent = 'This image could not be opened. Please try another one.';
    uploadError.hidden = false;
  };
  previewImage.src = objectUrl;
  fileName.textContent = file.name.toUpperCase().slice(0, 36);
  fileInput.value = '';
}

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', event => handleFile(event.target.files[0]));
changeImage.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover'].forEach(type => dropZone.addEventListener(type, event => {
  event.preventDefault(); dropZone.classList.add('is-dragging');
}));
['dragleave', 'drop'].forEach(type => dropZone.addEventListener(type, event => {
  event.preventDefault(); dropZone.classList.remove('is-dragging');
}));
dropZone.addEventListener('drop', event => handleFile(event.dataTransfer.files[0]));

shuffleButton.addEventListener('click', () => {
  shuffleSeed++;
  palette = extractPalette(sourcePixels, shuffleSeed);
  renderPalette();
});

downloadButton.addEventListener('click', () => {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = 1400; exportCanvas.height = 900;
  const ctx = exportCanvas.getContext('2d');
  ctx.fillStyle = '#F4F1E8'; ctx.fillRect(0, 0, 1400, 900);
  ctx.fillStyle = '#111'; ctx.font = '700 76px Arial'; ctx.fillText('CHROMASNAP', 80, 110);
  ctx.font = '30px monospace'; ctx.fillText('YOUR IMAGE PALETTE', 82, 170);
  const width = 248;
  palette.forEach((color, index) => {
    const hex = rgbToHex(color); const x = 80 + index * width;
    ctx.fillStyle = hex; ctx.fillRect(x, 250, width, 430);
    ctx.fillStyle = '#111'; ctx.font = '700 25px monospace'; ctx.fillText(hex, x, 735);
    ctx.font = '22px monospace'; ctx.fillText(colorName(color), x, 775);
  });
  ctx.font = '18px monospace'; ctx.fillText('MADE WITH CHROMASNAP', 80, 850);
  exportCanvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'chromasnap-palette.png';
    link.href = url;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
});

function registerPageTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  try {
    Promise.resolve(context.registerTool({
      name: 'read_current_palette',
      title: 'Read current palette',
      description: 'Return the five colors currently extracted from the image in ChromaSnap.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        if (!palette.length) throw new Error('Upload an image before reading the palette.');
        return {
          colors: palette.map(color => ({ name: colorName(color), hex: rgbToHex(color) }))
        };
      }
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch {}
}

registerPageTools();
