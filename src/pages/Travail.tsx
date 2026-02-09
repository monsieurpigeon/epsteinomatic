import type { ObjectDetection } from '@tensorflow-models/coco-ssd';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { useCallback, useEffect, useRef, useState } from 'react';

type BBox = [number, number, number, number]; // [x, y, width, height]

export default function Travail(): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const modelRef = useRef<ObjectDetection | null>(null);

  const [editorVisible, setEditorVisible] = useState(false);
  const [hint, setHint] = useState('Loading…');
  const [detectDisabled, setDetectDisabled] = useState(false);
  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [persons, setPersons] = useState<BBox[]>([]);
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [dragover, setDragover] = useState(false);

  const loadModel = useCallback(async (): Promise<ObjectDetection> => {
    if (modelRef.current) return modelRef.current;
    setHint('Loading model…');
    modelRef.current = await cocoSsd.load();
    return modelRef.current;
  }, []);

  const draw = useCallback(
    (forExport = false) => {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas?.width) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.drawImage(img, 0, 0, w, h);
      const pad = 2;
      persons.forEach((bbox, i) => {
        const [x, y, bw, bh] = bbox;
        const x1 = Math.max(0, x - pad);
        const y1 = Math.max(0, y - pad);
        const w1 = bw + 2 * pad;
        const h1 = bh + 2 * pad;
        if (hidden.has(i)) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(x1, y1, w1, h1);
        } else if (!forExport) {
          ctx.strokeStyle = '#6c5ce7';
          ctx.lineWidth = 3;
          ctx.strokeRect(x1, y1, w1, h1);
        }
      });
    },
    [persons, hidden]
  );

  useEffect(() => {
    if (persons.length === 0) return;
    draw(false);
  }, [persons, hidden, draw]);

  useEffect(() => {
    if (!editorVisible) return;
    const t = setTimeout(() => {
      if (imageRef.current && canvasRef.current) {
        setupCanvas();
        draw(false);
      }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorVisible]);

  const setupCanvas = useCallback(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
  }, []);

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file?.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = url;
        imageRef.current = img;
        setPersons([]);
        setHidden(new Set());
        setEditorVisible(true);
        setHint('Click "Detect people" to continue.');
        setDetectDisabled(false);
        setDownloadDisabled(true);
        setTimeout(() => {
          setupCanvas();
          draw(false);
        }, 0);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setHint("Could not load image.");
      };
      img.src = url;
    },
    [setupCanvas, draw]
  );

  const indexAtPosition = useCallback(
    (canvasX: number, canvasY: number): number => {
      for (let i = 0; i < persons.length; i++) {
        const [x, y, bw, bh] = persons[i];
        if (canvasX >= x && canvasX <= x + bw && canvasY >= y && canvasY <= y + bh) return i;
      }
      return -1;
    },
    [persons]
  );

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (persons.length === 0) return;
      const { x, y } = getCanvasCoords(e);
      const i = indexAtPosition(x, y);
      if (i >= 0) {
        setHidden((prev) => {
          const next = new Set(prev);
          if (next.has(i)) next.delete(i);
          else next.add(i);
          return next;
        });
      }
    },
    [persons.length, getCanvasCoords, indexAtPosition]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (persons.length === 0) {
        canvas.style.cursor = 'default';
        return;
      }
      const { x, y } = getCanvasCoords(e);
      const i = indexAtPosition(x, y);
      canvas.style.cursor = i >= 0 ? 'pointer' : 'default';
    },
    [persons.length, getCanvasCoords, indexAtPosition]
  );

  const handleDetect = useCallback(async () => {
    const img = imageRef.current;
    if (!img) return;
    setDetectDisabled(true);
    setHint('Detecting…');
    try {
      const model = await loadModel();
      const predictions = await model.detect(img);
      const personPreds = predictions.filter((p) => p.class === 'person');
      const bboxes: BBox[] = personPreds.map((p) => p.bbox as BBox);
      setPersons(bboxes);
      setHidden(new Set());
      setupCanvas();
      setHint(
        bboxes.length > 0
          ? "Click a person to hide or show them."
          : "No person detected."
      );
      setDownloadDisabled(false);
    } catch (err) {
      console.error(err);
      setHint('Error: ' + (err instanceof Error ? err.message : 'detection failed'));
    } finally {
      setDetectDisabled(false);
    }
  }, [loadModel, setupCanvas]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas?.width) return;
    draw(true);
    const link = document.createElement('a');
    link.download = 'epsteined_photo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    draw(false);
  }, [draw]);

  const onUploadClick = () => fileInputRef.current?.click();
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    handleFile(e.dataTransfer?.files?.[0]);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragover(true);
  };
  const onDragLeave = () => setDragover(false);

  const handleRetry = useCallback(() => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
    imageRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
    setEditorVisible(false);
    setPersons([]);
    setHidden(new Set());
    setHint('Drop a photo here or click to choose');
    setDownloadDisabled(true);
  }, []);

  return (
    <main className="max-w-[640px] mx-auto py-5 px-4 sm:py-8 sm:px-6 w-full min-w-0">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Workspace</h1>

      <div
        className={`
          border-2 border-dashed rounded-box py-8 px-4 sm:py-12 sm:px-8 text-center cursor-pointer
          transition-colors duration-200 mb-4 sm:mb-6 min-h-[120px] sm:min-h-[140px] flex items-center justify-center
          ${dragover ? 'border-accent bg-accent/10' : 'border-border hover:border-accent hover:bg-accent/10'}
        `}
        onClick={onUploadClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <p className="text-muted text-sm sm:text-base">Drop a photo here or click to choose</p>
      </div>

      {editorVisible && (
        <div className="mt-4">
          <div className="bg-surface border border-border rounded-box p-3 sm:p-4 mb-3 overflow-auto max-h-[55vh] sm:max-h-[65vh] md:max-h-[70vh] flex justify-center items-start">
            <canvas
              ref={canvasRef}
              className="block max-w-full h-auto rounded touch-none"
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
            />
          </div>
          <p className="text-muted text-sm sm:text-[0.95rem] mb-4 break-words">{hint}</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-box font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-accent text-white hover:bg-accent-hover order-1"
              onClick={handleDetect}
              disabled={detectDisabled}
            >
              Detect people
            </button>
            <button
              type="button"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-box font-semibold border border-border bg-surface text-[#e8e8ed] hover:bg-border transition-colors disabled:opacity-60 disabled:cursor-not-allowed order-2"
              onClick={handleDownload}
              disabled={downloadDisabled}
            >
              Download image
            </button>
            <button
              type="button"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-box font-semibold border border-border bg-surface text-[#e8e8ed] hover:bg-border transition-colors order-3"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!navigator.onLine && (
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted">Offline mode active.</p>
      )}
    </main>
  );
}
