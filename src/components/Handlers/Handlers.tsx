import React from 'react';
import { fabric } from 'fabric';

interface HandlersProps {
  canvasRef: React.RefObject<fabric.Canvas | null>;
  setIsModalOpen: (isOpen: boolean) => void;
  setSvgCode: (svgCode: string) => void;
}

class Handlers {
  private canvasRef: React.RefObject<fabric.Canvas | null>;
  private setIsModalOpen: (isOpen: boolean) => void;
  private setSvgCode: (svgCode: string) => void;

  constructor(props: HandlersProps) {
    this.canvasRef = props.canvasRef;
    this.setIsModalOpen = props.setIsModalOpen;
    this.setSvgCode = props.setSvgCode;
  }

  handleSave = () => {
    if (this.canvasRef.current) {
      this.setSvgCode(this.canvasRef.current.toSVG());
      this.setIsModalOpen(true);
    }
  };

  handleLoad = (svg: string) => {
    if (this.canvasRef.current) {
      fabric.loadSVGFromString(svg, (objects) => {
        if (objects && Array.isArray(objects)) {
          objects.forEach((obj) => {
            this.canvasRef.current?.add(obj);
          });
          this.canvasRef.current?.renderAll();
        }
      });
    }
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (f) => {
        const data = f.target?.result;
        if (typeof data === 'string') {
          if (file.type === 'image/svg+xml') {
            this.addSvgOnCanvas(data);
          } else if (file.type.startsWith('image/')) {
            this.addImageOnCanvas(data);
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

  addImageOnCanvas = (url: string) => {
    fabric.Image.fromURL(url, (img) => {
      if (img && this.canvasRef.current) {
        this.canvasRef.current.add(img);
        img.viewportCenter();
        img.setCoords();
        this.canvasRef.current.renderAll();
      }
    });
  };

  addSvgOnCanvas = (svgData: string) => {
    fabric.loadSVGFromString(svgData, (objects, options) => {
      if (objects && this.canvasRef.current) {
        const svgGroup = new fabric.Group(objects, options);
        this.canvasRef.current.add(svgGroup);
        svgGroup.viewportCenter();
        svgGroup.setCoords();
        this.canvasRef.current.renderAll();
      }
    });
  };

  handleClearCanvas = () => {
    this.canvasRef.current?.clear();
  };

  handleAddText = () => {
    if (this.canvasRef.current) {
      const text = new fabric.Textbox('Новый текст', {
        fontSize: 20,
        width: 200,
        originX: 'center',
        originY: 'center',
      });

      this.canvasRef.current.add(text);
      text.viewportCenter();
      text.setCoords();
      this.canvasRef.current.setActiveObject(text);
      this.canvasRef.current.requestRenderAll();
    }
  };

  handleAddShape = (shapeType: string) => {
    if (this.canvasRef.current) {
      let shape: fabric.Object;
      const center = this.canvasRef.current.getCenter();
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
      this.canvasRef.current.add(shape);
      shape.viewportCenter();
    }
  };

  handleZoom = (zoomType: string) => {
    if (!this.canvasRef.current) return;

    let zoomValue = this.canvasRef.current.getZoom();
    const delta = 0.1;

    zoomValue = zoomType === 'zoomIn' ? zoomValue + delta : zoomValue - delta;
    zoomValue = Math.max(0.1, zoomValue);

    this.canvasRef.current.setZoom(zoomValue);
    this.canvasRef.current.requestRenderAll();
  };

  deleteObject = () => {
    if (this.canvasRef.current) {
      const activeObject = this.canvasRef.current.getActiveObject();
      if (activeObject) {
        this.canvasRef.current.remove(activeObject);
        this.canvasRef.current.requestRenderAll();
      }
    }
  };
}

export default Handlers;
