import React from 'react';
import styles from './Canvas.module.scss';

const CanvasComponent: React.FC = () => (
  <div className={styles.canvasContainer}>
    <canvas id="fabric-canvas" className={styles.canvas}></canvas>
  </div>
);

export default CanvasComponent;
