// Simple Image Uploader - File upload or URL
(function() {
  'use strict';

  window.createImageUploader = function(containerId, inputName, currentUrl = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const hasImage = currentUrl && currentUrl.length > 0;

    container.innerHTML = `
      <div class="image-uploader">
        ${hasImage ? `
          <div class="image-preview-container">
            <img src="${currentUrl}" class="image-preview" alt="Preview">
            <button type="button" class="remove-image" onclick="window.removeUploadImage('${containerId}')">&times;</button>
          </div>
        ` : `
          <div class="upload-options">
            <div class="upload-buttons">
              <label class="upload-file-btn">
                📁 Välj från datorn
                <input type="file" accept="image/*" onchange="window.handleFileSelect('${containerId}', this)" style="display: none;">
              </label>
              <span class="upload-or">eller</span>
              <button type="button" class="upload-url-btn" onclick="window.showUrlInput('${containerId}')">
                🔗 Klistra in URL
              </button>
            </div>
            <div class="url-input-container" id="${containerId}-url-input" style="display: none;">
              <input type="url" placeholder="https://example.com/image.jpg" class="url-input" id="${containerId}-url-field">
              <button type="button" class="btn btn-sm btn-primary" onclick="window.useImageUrl('${containerId}')">Använd</button>
            </div>
          </div>
        `}
        <input type="hidden" name="${inputName}" id="${containerId}-value" value="${currentUrl}">
      </div>

      <style>
        .image-uploader { width: 100%; }
        .image-preview-container { position: relative; display: inline-block; width: 100%; }
        .image-preview { width: 100%; max-height: 300px; object-fit: contain; border-radius: var(--radius-md); border: 2px solid #E5E7EB; }
        .remove-image { position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; background: rgba(239, 68, 68, 0.9); color: white; border: none; border-radius: 50%; font-size: 20px; line-height: 1; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .remove-image:hover { background: #DC2626; transform: scale(1.1); }
        .upload-options { padding: var(--space-6); border: 2px dashed #D1D5DB; border-radius: var(--radius-lg); text-align: center; background: var(--color-neutral-light); }
        .upload-buttons { display: flex; align-items: center; justify-content: center; gap: var(--space-3); flex-wrap: wrap; }
        .upload-file-btn { padding: var(--space-3) var(--space-5); background: var(--color-primary); color: white; border-radius: var(--radius-md); cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .upload-file-btn:hover { background: #234133; }
        .upload-or { color: var(--color-text-muted); font-size: var(--text-sm); }
        .upload-url-btn { padding: var(--space-3) var(--space-5); background: white; color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: var(--radius-md); cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .upload-url-btn:hover { background: var(--color-primary); color: white; }
        .url-input-container { margin-top: var(--space-4); display: flex; gap: var(--space-2); }
        .url-input { flex: 1; padding: var(--space-2) var(--space-3); border: 2px solid #E5E7EB; border-radius: var(--radius-md); font-size: var(--text-base); }
        .url-input:focus { outline: none; border-color: var(--color-primary); }
      </style>
    `;
  };

  window.handleFileSelect = function(containerId, input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Vänligen välj en bildfil'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Bilden får max vara 5MB'); return; }
    const reader = new FileReader();
    reader.onload = function(e) { window.setUploadedImage(containerId, e.target.result); };
    reader.readAsDataURL(file);
  };

  window.showUrlInput = function(containerId) {
    const urlInput = document.getElementById(`${containerId}-url-input`);
    if (urlInput) urlInput.style.display = 'flex';
  };

  window.useImageUrl = function(containerId) {
    const urlField = document.getElementById(`${containerId}-url-field`);
    if (urlField && urlField.value) window.setUploadedImage(containerId, urlField.value);
  };

  window.setUploadedImage = function(containerId, url) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div class="image-uploader">
        <div class="image-preview-container">
          <img src="${url}" class="image-preview" alt="Preview">
          <button type="button" class="remove-image" onclick="window.removeUploadImage('${containerId}')">&times;</button>
        </div>
        <input type="hidden" id="${containerId}-value" value="${url}">
      </div>
    `;
    const hiddenInput = container.querySelector('input[type="hidden"]');
    if (hiddenInput) hiddenInput.value = url;
  };

  window.removeUploadImage = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div class="image-uploader">
        <div class="upload-options">
          <div class="upload-buttons">
            <label class="upload-file-btn">
              📁 Välj från datorn
              <input type="file" accept="image/*" onchange="window.handleFileSelect('${containerId}', this)" style="display: none;">
            </label>
            <span class="upload-or">eller</span>
            <button type="button" class="upload-url-btn" onclick="window.showUrlInput('${containerId}')">🔗 Klistra in URL</button>
          </div>
          <div class="url-input-container" id="${containerId}-url-input" style="display: none;">
            <input type="url" placeholder="https://example.com/image.jpg" class="url-input" id="${containerId}-url-field">
            <button type="button" class="btn btn-sm btn-primary" onclick="window.useImageUrl('${containerId}')">Använd</button>
          </div>
        </div>
        <input type="hidden" id="${containerId}-value" value="">
      </div>
    `;
  };

  window.getImageValue = function(containerId) {
    const valueInput = document.getElementById(`${containerId}-value`);
    return valueInput ? valueInput.value : '';
  };
})();
