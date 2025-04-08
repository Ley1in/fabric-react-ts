import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import styles from './App.module.scss';
import CanvasComponent from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Modal from './components/Modal/Modal';
import Handlers from './components/Handlers/Handlers';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [svgCode, setSvgCode] = useState('');
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlers = new Handlers({
    canvasRef,
    setIsModalOpen,
    setSvgCode,
  });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      const container = document.querySelector('.canvasContainer');
      if (!container) return;
      const containerWidth = container.clientWidth;
      const containerHeight = (containerWidth * 3) / 5;
      canvasRef.current.calcOffset();

      canvasRef.current.setDimensions({
        width: containerWidth,
        height: containerHeight,
      });
      canvasRef.current.renderAll();
    };

    const canvas = new fabric.Canvas('fabric-canvas', {
      width: 1000,
      height: 600,
    });
    canvasRef.current = canvas;

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handleZoom = (opt: fabric.IEvent) => {
      const wheelEvent = opt.e as WheelEvent;
      if (!canvasRef.current || !wheelEvent) return;

      const delta = wheelEvent.deltaY;
      const zoom = canvasRef.current.getZoom() * Math.pow(0.999, delta);
      const newZoom = Math.min(20, Math.max(0.01, zoom));
      const pointer = canvasRef.current.getPointer(opt.e);

      if (!pointer) return;

      canvasRef.current.zoomToPoint(
        new fabric.Point(pointer.x, pointer.y),
        newZoom
      );

      wheelEvent.preventDefault();
      wheelEvent.stopPropagation();
    };

    canvas.on('mouse:wheel', handleZoom);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        handlers.deleteObject();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.off('mouse:wheel', handleZoom);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateCanvasSize);
      canvas.dispose();
    };
  }, []);

  return (
    <div className={styles.app}>
      <Topbar
        onSave={handlers.handleSave}
        onClearCanvas={handlers.handleClearCanvas}
        onFileChange={handlers.handleFileChange}
        onLoad={handlers.handleLoad}
        onZoom={handlers.handleZoom}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={styles.container}>
        <div className={styles.desktopSidebar}>
          <Sidebar
            onAddShape={handlers.handleAddShape}
            onAddText={handlers.handleAddText}
          />
        </div>

        {isSidebarOpen && (
          <div className={styles.mobileOverlay}>
            <div className={styles.mobileSidebar}>
              <div className={styles.sidebarHeader}>
                <h2>Инструменты</h2>
                <button onClick={() => setIsSidebarOpen(false)}>✕</button>
              </div>
              <Sidebar
                onAddShape={handlers.handleAddShape}
                onAddText={handlers.handleAddText}
              />
            </div>
          </div>
        )}

        <div className={styles.mainContent}>
          <CanvasComponent />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        svgCode={svgCode}
      />
    </div>
  );
}

export default App;
