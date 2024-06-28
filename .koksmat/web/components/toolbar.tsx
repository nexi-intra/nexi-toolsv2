import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import html2canvas from 'html2canvas';
import 'tailwindcss/tailwind.css';

interface CaptureArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const App: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [mode, setMode] = useState<string | null>(null); // 'capture' or 'report'
  const [captureArea, setCaptureArea] = useState<CaptureArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!showPanel) {
      timeout = setTimeout(() => {
        setShowPanel(true);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showPanel]);

  const handleHexagonClick = () => {
    setShowPanel(true);
  };

  const handleOptionClick = (mode: string) => {
    setMode(mode);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (mode === 'capture' && overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      setStartPoint({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging && startPoint) {
      const rect = overlayRef.current!.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const width = currentX - startPoint.x;
      const height = currentY - startPoint.y;
      setCaptureArea({
        x: startPoint.x,
        y: startPoint.y,
        width: Math.abs(width),
        height: Math.abs(height),
      });
    }
  };

  const handleMouseUp = async (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging && overlayRef.current && startPoint) {
      const rect = overlayRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const width = currentX - startPoint.x;
      const height = currentY - startPoint.y;
      setCaptureArea({
        x: startPoint.x,
        y: startPoint.y,
        width: Math.abs(width),
        height: Math.abs(height),
      });
      setIsDragging(false);
      setMode(null); // Exit capture mode

      // Capture the screenshot
      const canvas = await html2canvas(document.body);
      const base64image = canvas.toDataURL('image/png');
      sessionStorage.setItem('screenshot', base64image);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <div
        className="w-24 h-24 bg-blue-500 clip-hexagon animate-grow-shrink absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        onClick={handleHexagonClick}
      ></div>
      {showPanel && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 border border-gray-300 flex flex-col items-center">
          <div
            className="m-2 cursor-pointer"
            onClick={() => handleOptionClick('capture')}
          >
            Capture
          </div>
          <div
            className="m-2 cursor-pointer"
            onClick={() => handleOptionClick('report')}
          >
            Report
          </div>
        </div>
      )}
      {mode === 'capture' && (
        <div
          ref={overlayRef}
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {captureArea && (
            <div
              ref={captureRef}
              className="absolute border-2 border-dotted border-white"
              style={{
                left: `${captureArea.x}px`,
                top: `${captureArea.y}px`,
                width: `${captureArea.width}px`,
                height: `${captureArea.height}px`,
              }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
