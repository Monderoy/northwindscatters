// Simple Image Uploader - File upload or URL
// Better styling with equal-sized buttons

(function() {
  'use strict';

  // Make ABSOLUTELY SURE the function is globally available
  window.createImageUploader = function(containerId, inputName, currentUrl = '') {
    console.log(`🎯 createImageUploader called for: ${containerId}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`❌ Container #${containerId} not found!`);
      return;
    }
    
    console.log(`✅ Container #${containerId} found!`);

    const hasImage = currentUrl && currentUrl.length > 0;

    container.innerHTML = `
      <div class="image-uploader-wrapper">
        ${hasImage ? `
          <div class="image-preview-box">
            <img src="${currentUrl}" class="preview-image" alt="Preview">
            <button type="button" class="remove-btn" onclick="window.removeUploadImage('${containerId}')">&times;</button>
          </div>
        ` : `
          <div class="upload-area" 
               ondragover="event.preventDefault(); this.style.borderColor='var(--color-primary)'; this.style.background='rgba(45, 74, 62, 0.05)';"
               ondragleave="this.style.borderColor='#D1D5DB'; this.style.background='var(--color-neutral-light)';"
               ondrop="event.preventDefault(); this.style.borderColor='#D1D5DB'; this.style.background='var(--color-neutral-light)';">
            <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-4); text-align: center;">
              📸 Dra och släpp en bild här, eller använd knapparna nedan
            </p>
            <div class="upload-buttons-row">
              <label class="upload-btn upload-btn-file">
                <span class="btn-icon">📁</span>
                <span class="btn-text">Välj från datorn</span>
                <input type="file" accept="image/*" onchange="window.handleFileSelect('${containerId}', this)" style="display: none;">
              </label>
              <button type="button" class="upload-btn upload-btn-url" onclick="window.showUrlInput('${containerId}')">
                <span class="btn-icon">🔗</span>
                <span class="btn-text">Klistra in URL</span>
              </button>
            </div>
            <div class="url-input-row" id="${containerId}-url-input" style="display: none;">
              <input type="url" placeholder="https://example.com/bild.jpg" class="url-field" id="${containerId}-url-field">
              <button type="button" class="url-use-btn" onclick="window.useImageUrl('${containerId}')">Använd</button>
            </div>
          </div>
        `}
        <input type="hidden" name="${inputName}" id="${containerId}-value" value="${currentUrl}">
      </div>

      <style>
        .image-uploader-wrapper {
          width: 100%;
        }

        .image-preview-box {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .preview-image {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
          border-radius: var(--radius-md);
          border: 2px solid #E5E7EB;
        }

        .remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          background: rgba(239, 68, 68, 0.95);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .remove-btn:hover {
          background: #DC2626;
          transform: scale(1.1);
        }

        .upload-area {
          padding: var(--space-8);
          border: 2px dashed #D1D5DB;
          border-radius: var(--radius-lg);
          text-align: center;
          background: var(--color-neutral-light);
          transition: all 0.3s ease;
        }

        .upload-buttons-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
          max-width: 600px;
          margin: 0 auto;
        }

        .upload-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-6) var(--space-4);
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          text-decoration: none;
          min-height: 120px;
          border: 2px solid transparent;
        }

        .upload-btn-file {
          background: var(--color-primary);
          color: white;
        }

        .upload-btn-file:hover {
          background: #1F3930;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 74, 62, 0.3);
        }

        .upload-btn-url {
          background: white;
          color: var(--color-primary);
          border: 2px solid var(--color-primary);
        }

        .upload-btn-url:hover {
          background: var(--color-primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 74, 62, 0.3);
        }

        .btn-icon {
          font-size: 2.5rem;
        }

        .btn-text {
          font-size: var(--text-base);
        }

        .url-input-row {
          margin-top: var(--space-4);
          display: flex;
          gap: var(--space-2);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .url-field {
          flex: 1;
          padding: var(--space-3) var(--space-4);
          border: 2px solid #E5E7EB;
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-family: var(--font-body);
        }

        .url-field:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .url-use-btn {
          padding: var(--space-3) var(--space-6);
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .url-use-btn:hover {
          background: #1F3930;
        }

        @media (max-width: 640px) {
          .upload-buttons-row {
            grid-template-columns: 1fr;
          }
          
          .upload-btn {
            min-height: 100px;
          }
        }
      </style>
    `;
  };

  window.handleFileSelect = function(containerId, input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { 
      alert('Vänligen välj en bildfil'); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) { 
      alert('Bilden får max vara 5MB'); 
      return; 
    }
    const reader = new FileReader();
    reader.onload = function(e) { 
      window.setUploadedImage(containerId, e.target.result); 
    };
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
      <div class="image-uploader-wrapper">
        <div class="image-preview-box">
          <img src="${url}" class="preview-image" alt="Preview">
          <button type="button" class="remove-btn" onclick="window.removeUploadImage('${containerId}')">&times;</button>
        </div>
        <input type="hidden" id="${containerId}-value" value="${url}">
      </div>
      
      <style>
        .image-uploader-wrapper { width: 100%; }
        .image-preview-box { position: relative; display: inline-block; width: 100%; }
        .preview-image { width: 100%; max-height: 300px; object-fit: contain; border-radius: var(--radius-md); border: 2px solid #E5E7EB; }
        .remove-btn { position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; background: rgba(239, 68, 68, 0.95); color: white; border: none; border-radius: 50%; font-size: 24px; line-height: 1; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .remove-btn:hover { background: #DC2626; transform: scale(1.1); }
      </style>
    `;
    
    const hiddenInput = container.querySelector('input[type="hidden"]');
    if (hiddenInput) hiddenInput.value = url;
  };

  window.removeUploadImage = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="image-uploader-wrapper">
        <div class="upload-area">
          <div class="upload-buttons-row">
            <label class="upload-btn upload-btn-file">
              <span class="btn-icon">📁</span>
              <span class="btn-text">Välj från datorn</span>
              <input type="file" accept="image/*" onchange="window.handleFileSelect('${containerId}', this)" style="display: none;">
            </label>
            <button type="button" class="upload-btn upload-btn-url" onclick="window.showUrlInput('${containerId}')">
              <span class="btn-icon">🔗</span>
              <span class="btn-text">Klistra in URL</span>
            </button>
          </div>
          <div class="url-input-row" id="${containerId}-url-input" style="display: none;">
            <input type="url" placeholder="https://example.com/bild.jpg" class="url-field" id="${containerId}-url-field">
            <button type="button" class="url-use-btn" onclick="window.useImageUrl('${containerId}')">Använd</button>
          </div>
        </div>
        <input type="hidden" id="${containerId}-value" value="">
      </div>
      
      <style>
        .image-uploader-wrapper { width: 100%; }
        .upload-area { padding: var(--space-8); border: 2px dashed #D1D5DB; border-radius: var(--radius-lg); text-align: center; background: var(--color-neutral-light); }
        .upload-buttons-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); max-width: 600px; margin: 0 auto; }
        .upload-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-6) var(--space-4); border-radius: var(--radius-lg); cursor: pointer; font-weight: 600; transition: all 0.2s; text-decoration: none; min-height: 120px; border: 2px solid transparent; }
        .upload-btn-file { background: var(--color-primary); color: white; }
        .upload-btn-file:hover { background: #1F3930; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(45, 74, 62, 0.3); }
        .upload-btn-url { background: white; color: var(--color-primary); border: 2px solid var(--color-primary); }
        .upload-btn-url:hover { background: var(--color-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(45, 74, 62, 0.3); }
        .btn-icon { font-size: 2.5rem; }
        .btn-text { font-size: var(--text-base); }
        .url-input-row { margin-top: var(--space-4); display: flex; gap: var(--space-2); max-width: 600px; margin-left: auto; margin-right: auto; }
        .url-field { flex: 1; padding: var(--space-3) var(--space-4); border: 2px solid #E5E7EB; border-radius: var(--radius-md); font-size: var(--text-base); font-family: var(--font-body); }
        .url-field:focus { outline: none; border-color: var(--color-primary); }
        .url-use-btn { padding: var(--space-3) var(--space-6); background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: var(--text-base); font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .url-use-btn:hover { background: #1F3930; }
        @media (max-width: 640px) { .upload-buttons-row { grid-template-columns: 1fr; } .upload-btn { min-height: 100px; } }
      </style>
    `;
  };

  window.getImageValue = function(containerId) {
    const valueInput = document.getElementById(`${containerId}-value`);
    return valueInput ? valueInput.value : '';
  };

})();
