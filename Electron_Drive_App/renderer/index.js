const { ipcRenderer } = require("electron");
//   mxa2ormrYC42mLKx

const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const status = document.getElementById("status");
const shareableLink = document.getElementById("shareableLink");
const nameInput = document.getElementById("nameInput");

// Handle drag and drop events
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragging");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragging");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragging");
  handleFiles(e.dataTransfer.files);
});

// Handle click to upload
uploadArea.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

async function handleFiles(files) {
  for (const file of files) {
    await uploadFile(nameInput.value, file);
  }
}

async function uploadFile(name, file) {
  try {
    // Show file info
    fileInfo.textContent = `Selected file: ${file.name} (${formatFileSize(
      file.size
    )})`;

    // Show progress status
    status.className = "status progress";
    status.textContent = "Uploading file to Google Drive...";
    shareableLink.style.display = "none";

    // Upload file
    const result = await ipcRenderer.invoke(
      "upload-file",
      name,
      file.path,
      file.size
    );

    if (result.success) {
      // Show success status
      status.className = "status success";
      status.textContent = "File uploaded successfully!";

      // Show shareable link
      shareableLink.style.display = "block";
      shareableLink.innerHTML = `
                        Shareable link: <a href="${result.shareableLink}" target="_blank">
                            ${result.shareableLink}
                        </a>
                    `;
    } else {
      throw new Error(result.error + "tftfdfdggu");
    }
  } catch (error) {
    // Show error status
    status.className = "status error";
    status.textContent = `Upload failed: ${error.message}`;
    shareableLink.style.display = "none";
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
