import React, { useState } from 'react';
import styles from './Topbar.module.scss';
import Button from '../Button/Button';

interface TopbarProps {
  onSave: () => void;
  onClearCanvas: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoad: (svg: string) => void;
  onZoom: (zoomType: string) => void;
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  onSave,
  onClearCanvas,
  onFileChange,
  onLoad,
  onZoom,
  onToggleSidebar,
}) => {
  const [svgInputLocal, setSvgInputLocal] = useState('');

  const handleLoadClick = () => {
    onLoad(svgInputLocal);
    setSvgInputLocal('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSvgInputLocal(e.target.value);
  };

  const Controls = () => (
    <div className={styles.mainControls}>
      <div className={styles.saveButton}>
        <Button onClick={onSave}>Сохранить</Button>
      </div>
      <div className={styles.zoomControls}>
        <button
          className={styles.zoomButton}
          onClick={() => onZoom('zoomIn')}
          aria-label="Zoom In"
        >
          ＋
        </button>
        <button
          className={styles.zoomButton}
          onClick={() => onZoom('zoomOut')}
          aria-label="Zoom Out"
        >
          －
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.mobileTopRow}>
          <button onClick={onToggleSidebar} className={styles.menuButton}>
            ☰
          </button>
          <Controls />
        </div>

        <div className={styles.desktopControls}>
          <Controls />
        </div>

        <div className={styles.fileControls}>
          <input
            type="text"
            value={svgInputLocal}
            onChange={handleChange}
            placeholder="SVG Code"
            className={styles.input}
          />
          <Button onClick={handleLoadClick}>Загрузить</Button>

          <input
            type="file"
            id="fileInput"
            onChange={onFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="fileInput" className={styles.uploadButton}>
            Вставить изображение / SVG
          </label>
        </div>

        <div className={styles.clearButton}>
          <Button onClick={onClearCanvas}>Очистить Canvas</Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
