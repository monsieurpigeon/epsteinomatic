(function () {
  const uploadZone = document.getElementById("upload-zone");
  const fileInput = document.getElementById("file-input");
  const editorWrap = document.getElementById("editor-wrap");
  const hint = document.getElementById("hint");
  const canvas = document.getElementById("preview-canvas");
  const btnDetect = document.getElementById("btn-detect");
  const btnDownload = document.getElementById("btn-download");

  let imageElement = null;
  let currentImageUrl = null;
  let cocoModel = null;
  let persons = [];
  let hidden = new Set();

  function getCocoSSD() {
    if (typeof cocoSsd !== "undefined") return cocoSsd;
    if (typeof cocoSSD !== "undefined") return cocoSSD;
    if (typeof window.cocoSsd !== "undefined") return window.cocoSsd;
    if (typeof window.cocoSSD !== "undefined") return window.cocoSSD;
    return null;
  }

  function loadCocoSSDScript() {
    return new Promise((resolve, reject) => {
      if (getCocoSSD()) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js";
      script.onload = () =>
        getCocoSSD() ? resolve() : reject(new Error("COCO-SSD non chargé."));
      script.onerror = () =>
        reject(new Error("Impossible de charger COCO-SSD."));
      document.head.appendChild(script);
    });
  }

  async function getModel() {
    if (cocoModel) return cocoModel;
    await loadCocoSSDScript();
    const coco = getCocoSSD();
    if (!coco) throw new Error("Modèle COCO-SSD non disponible.");
    cocoModel = await coco.load();
    return cocoModel;
  }

  uploadZone.addEventListener("click", () => fileInput.click());
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });
  uploadZone.addEventListener("dragleave", () =>
    uploadZone.classList.remove("dragover")
  );
  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) handleFile(file);
  });

  function handleFile(file) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
      currentImageUrl = url;
      imageElement = img;
      persons = [];
      hidden = new Set();
      editorWrap.hidden = false;
      hint.textContent = "Cliquez sur « Détecter les personnes ».";
      btnDetect.disabled = false;
      btnDownload.disabled = true;
      setupCanvas();
      draw();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      hint.textContent = "Impossible de charger l'image.";
    };
    img.src = url;
  }

  function setupCanvas() {
    if (!imageElement) return;
    const dpr = window.devicePixelRatio || 1;
    const w = imageElement.naturalWidth;
    const h = imageElement.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = "";
    canvas.style.height = "";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
  }

  function draw(forExport) {
    if (!imageElement || !canvas.width) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.drawImage(imageElement, 0, 0, w, h);

    const pad = 2;
    for (let i = 0; i < persons.length; i++) {
      const [x, y, bw, bh] = persons[i];
      const x1 = Math.max(0, x - pad);
      const y1 = Math.max(0, y - pad);
      const w1 = bw + 2 * pad;
      const h1 = bh + 2 * pad;
      if (hidden.has(i)) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(x1, y1, w1, h1);
      } else if (!forExport) {
        ctx.strokeStyle = "#6c5ce7";
        ctx.lineWidth = 3;
        ctx.strokeRect(x1, y1, w1, h1);
      }
    }
  }

  function indexAtPosition(canvasX, canvasY) {
    for (let i = 0; i < persons.length; i++) {
      const [x, y, bw, bh] = persons[i];
      if (
        canvasX >= x &&
        canvasX <= x + bw &&
        canvasY >= y &&
        canvasY <= y + bh
      )
        return i;
    }
    return -1;
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener("click", (e) => {
    if (persons.length === 0) return;
    const { x, y } = getCanvasCoords(e);
    const i = indexAtPosition(x, y);
    if (i >= 0) {
      if (hidden.has(i)) hidden.delete(i);
      else hidden.add(i);
      draw();
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (persons.length === 0) {
      canvas.style.cursor = "default";
      return;
    }
    const { x, y } = getCanvasCoords(e);
    const i = indexAtPosition(x, y);
    canvas.style.cursor = i >= 0 ? "pointer" : "default";
  });

  btnDetect.addEventListener("click", async () => {
    if (!imageElement) return;
    btnDetect.disabled = true;
    hint.textContent = "Détection en cours…";

    try {
      const model = await getModel();
      const predictions = await model.detect(imageElement);
      const personPreds = predictions.filter((p) => p.class === "person");
      persons = personPreds.map((p) => p.bbox);
      hidden = new Set();
      setupCanvas();
      draw();
      hint.textContent =
        personPreds.length > 0
          ? "Cliquez sur une personne pour la masquer ou l'afficher."
          : "Aucune personne détectée.";
      btnDownload.disabled = false;
    } catch (err) {
      console.error(err);
      hint.textContent = "Erreur : " + (err.message || "détection impossible");
    } finally {
      btnDetect.disabled = false;
    }
  });

  btnDownload.addEventListener("click", () => {
    if (!canvas.width) return;
    draw(true);
    const link = document.createElement("a");
    link.download = "photo_masquee.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    draw(false);
  });
})();
