import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./DraggableButton.css";

const DraggableButton: React.FC = () => {
  const [position, setPosition] = useState({ x: 80, y: 80 }); // Initial position
  const [showPopup, setShowPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isDragging = useRef(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();

  // Video files for different pages
  const pageContent: Record<string, { video: string; text: string }> = {
    "/kanban": { video: "/kanban.mp4", text: "Kanban Board Tutorial" },
    "/dashboard": { video: "/dashboard.mp4", text: "Dashboard Overview" },
    "/calendar": { video: "/calendar.mp4", text: "Calendar Usage Guide" },
    "/tables": { video: "/table.mp4", text: "Table Features & Guide" },
  };


  const currentPath = location.pathname.replace(/\/$/, "");
  const videoSource = pageContent[currentPath]?.video || "/welcome.mp4";
  const videoText = pageContent[currentPath]?.text || "Welcome! to Teams";

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    isDragging.current = true;
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({ x: e.clientX - startX, y: e.clientY - startY });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Prevent popup from closing when dragging
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isDragging.current) {
      setShowPopup(!showPopup);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <>
      <button
        ref={buttonRef}
        className="draggable-button"
        style={{ left: `${position.x}px`, top: `${position.y}px`, position: "absolute" }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img src="/camera.png" alt="Camera" width="30" height="30" />
        {showTooltip && <span className="tooltip"> Double Click </span>}
      </button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
            <h2>{videoText}</h2>
            <video controls width="100%">
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default DraggableButton;
