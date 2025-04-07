import { useState, useRef, useEffect } from 'react';
import styles from './App.module.scss';
import CanvasComponent from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Modal from './components/Modal/Modal';
import { fabric } from 'fabric';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [svgCode, setSvgCode] = useState('');
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas('fabric-canvas', {
      width: 1000,
      height: 600,
    });
    canvasRef.current = canvas;

    canvasRef.current.on('mouse:wheel', (opt) => {
      if (!canvasRef.current) return;
      const delta = opt.e.deltaY;
      const zoom = canvasRef.current.getZoom() * 0.999 ** delta;
      const newZoom = Math.min(20, Math.max(0.01, zoom));
      const pointer = canvasRef.current.getPointer(opt.e);
      if (!pointer) return;

      canvasRef.current.zoomToPoint(
        new fabric.Point(pointer.x, pointer.y),
        newZoom
      );

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        deleteObject();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      canvasRef.current?.dispose();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addImageOnCanvas = (url: string) => {
    fabric.Image.fromURL(url, (img) => {
      if (img) {
        const center = canvasRef.current?.getCenter();
        img.set({
          left: center?.left || 0,
          top: center?.top || 0,
          originX: 'center',
          originY: 'center',
        });
        canvasRef.current?.add(img);
        canvasRef.current?.renderAll();
      }
    });
  };

  const addSvgOnCanvas = (svgData: string) => {
    fabric.loadSVGFromString(svgData, (objects, options) => {
      if (objects && Array.isArray(objects)) {
        const svgGroup = new fabric.Group(objects, options);
        const center = canvasRef.current?.getCenter();
        svgGroup.set({
          left: center?.left || 0,
          top: center?.top || 0,
          originX: 'center',
          originY: 'center',
        });
        canvasRef.current?.add(svgGroup);
        canvasRef.current?.renderAll();
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (f) => {
        const data = f.target?.result;
        if (typeof data === 'string') {
          if (file.type === 'image/svg+xml') {
            addSvgOnCanvas(data);
          } else if (file.type.startsWith('image/')) {
            addImageOnCanvas(data);
          }
        }
      };

      if (file.type === 'image/svg+xml') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      setSvgCode(canvasRef.current.toSVG());
      setIsModalOpen(true);
    }
  };

  const handleLoad = (svg: string) => {
    if (canvasRef.current) {
      fabric.loadSVGFromString(svg, (objects) => {
        if (objects && Array.isArray(objects)) {
          objects.forEach((obj) => {
            canvasRef.current?.add(obj);
          });
          canvasRef.current?.renderAll();
        }
      });
    }
  };

  const deleteObject = () => {
    if (canvasRef.current) {
      const activeObject = canvasRef.current.getActiveObject();
      if (activeObject) {
        canvasRef.current.remove(activeObject);
        canvasRef.current.requestRenderAll();
      }
    }
  };

  const handleZoom = (zoomType: string) => {
    if (!canvasRef.current) return;

    let zoomValue = canvasRef.current.getZoom();
    const delta = 0.1;

    zoomValue = zoomType === 'zoomIn' ? zoomValue + delta : zoomValue - delta;
    zoomValue = Math.max(0.1, zoomValue);

    canvasRef.current.setZoom(zoomValue);
    canvasRef.current.requestRenderAll();
  };

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
  };

  const handleAddText = () => {
    if (canvasRef.current) {
      const center = canvasRef.current.getCenter();
      const text = new fabric.Textbox('Hello World', {
        left: center.left,
        top: center.top,
        width: 200,
        fontSize: 20,
        originX: 'center',
        originY: 'center',
      });
      canvasRef.current.add(text);
    }
  };

  const handleAddShape = (shapeType: string) => {
    if (canvasRef.current) {
      let shape: fabric.Object;
      const center = canvasRef.current.getCenter();
      switch (shapeType) {
        case 'square':
          shape = new fabric.Rect({
            left: center.left,
            top: center.top,
            fill: 'red',
            width: 20,
            height: 20,
            originX: 'center',
            originY: 'center',
          });
          break;
        case 'circle':
          shape = new fabric.Circle({
            left: center.left,
            top: center.top,
            fill: 'blue',
            radius: 10,
            originX: 'center',
            originY: 'center',
          });
          break;
        case 'line':
          shape = new fabric.Line([50, 100, 200, 100], {
            stroke: 'green',
            strokeWidth: 3,
            originX: 'center',
            originY: 'center',
            left: center.left,
            top: center.top,
          });
          break;
        default:
          return;
      }
      canvasRef.current.add(shape);
    }
  };

  return (
    <div className={styles.app}>
      <Topbar
        onSave={handleSave}
        onClearCanvas={handleClearCanvas}
        onFileChange={handleFileChange}
        onLoad={handleLoad}
        onZoom={handleZoom}
      />
      <div className={styles.container}>
        <Sidebar onAddShape={handleAddShape} onAddText={handleAddText} />
        <CanvasComponent />
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
