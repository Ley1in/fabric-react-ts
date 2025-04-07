import React from 'react';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  onAddShape: (shapeType: string) => void;
  onAddText: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddShape, onAddText }) => {
  return (
    <div className={styles.sidebar}>
      <button onClick={onAddText}>Добавить текст</button>
      <button onClick={() => onAddShape('square')}>Добавить квадрат</button>
      <button onClick={() => onAddShape('circle')}>Добавить круг</button>
      <button onClick={() => onAddShape('line')}>Добавить линию</button>
    </div>
  );
};

export default Sidebar;
