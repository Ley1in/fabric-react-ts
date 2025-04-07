import React, { useState } from 'react';
import styles from './Topbar.module.scss';

interface TopbarProps {
  onSave: () => void;
  onClearCanvas: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoad: (svg: string) => void;
  onZoom: (zoomType: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({
  onSave,
  onClearCanvas,
  onFileChange,
  onLoad,
}) => {
  const [svgInputLocal, setSvgInputLocal] = useState('');

  const handleLoadClick = () => {
    onLoad(svgInputLocal);
    setSvgInputLocal('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSvgInputLocal(e.target.value);
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button className={styles.button} onClick={onSave}>
          Сохранить
        </button>
      </div>

      <div className={styles.topbarCenter}>
        <input
          type="text"
          value={svgInputLocal}
          onChange={handleChange}
          placeholder="SVG Code"
        />
        <button onClick={handleLoadClick}>Загрузить</button>

        <input
          type="file"
          id="fileInput"
          onChange={onFileChange}
          className={styles.fileInput}
        />
        <label htmlFor="fileInput" className={styles.uploadButton}>
          Вставить изображение / SVG картинку
        </label>
      </div>

      <div className={styles.topbarRight}>
        <button className={styles.button} onClick={onClearCanvas}>
          Очистить Canvas
        </button>
      </div>
    </div>
  );
};

export default Topbar;
