"use client"; // this is a client component

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const Canvas = (): JSX.Element => {
  const [brushSize, setBrushSize] = useState(10);
  const [color, setColor] = useState("black");
  const [mouseDown, setMouseDown] = useState(false);
  const [erase, setErase] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursorRef && cursorRef.current) {
      cursorRef.current.style.width = `${brushSize}px`;
      cursorRef.current.style.height = `${brushSize}px`;
      cursorRef.current.style.borderRadius = `${brushSize / 2}px`;
    }
  }, [erase, brushSize]);

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, [canvasRef]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseDown(true);
    const ctx = e.currentTarget.getContext("2d") as any;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mouseDown) {
      draw(e);
    }
    if (cursorRef && cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX - brushSize / 2}px`;
      cursorRef.current.style.top = `${e.clientY - brushSize / 2}px`;
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseDown(false);
    const ctx = e.currentTarget.getContext("2d") as any;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d") as any;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    if (!erase) {
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    } else {
      ctx.clearRect(
        e.clientX - brushSize / 2,
        e.clientY - brushSize / 2,
        brushSize,
        brushSize
      );
    }
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imgData = await html2canvas(canvas).then((canvas) => {
      return canvas.toDataURL("image/png");
    });
    saveAs(imgData, "sketch.png");
  };

  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d") as any;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "white"; // set the background color
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div>
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
        style={{ position: "fixed" }}
      />
      {erase && (
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            pointerEvents: "none",
            background: "rgba(128, 128, 128, 0.5)",
            width: `${brushSize}px`,
            height: `${brushSize}px`,
            borderRadius: `${brushSize / 2}px`,
            left: 0,
            top: 0,
            zIndex: 9999,
          }}
        />
      )}

      <div style={{ position: "relative" }}>
        <div>
          <button onClick={() => handleSave()}>Save as PNG</button>
          <button onClick={() => handleClearCanvas()}>Clear</button>
        </div>
        <label>
          Brush size:
          <input
            type="range"
            min={1}
            max={50}
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </label>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <label>
          Erase:
          <input
            type="checkbox"
            checked={erase}
            onChange={(e) => setErase(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
};

export default Canvas;
