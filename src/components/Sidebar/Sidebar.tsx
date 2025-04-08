import React from 'react';
import styles from './Sidebar.module.scss';
import Button from '../Button/Button';

interface SidebarProps {
  onAddShape: (shapeType: string) => void;
  onAddText: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddShape, onAddText }) => {
  return (
    <div className={styles.sidebar}>
      <Button onClick={onAddText}>Добавить текст</Button>
      <Button onClick={() => onAddShape('square')}>Добавить квадрат</Button>
      <Button onClick={() => onAddShape('circle')}>Добавить круг</Button>
      <Button onClick={() => onAddShape('line')}>Добавить линию</Button>
    </div>
  );
};

export default Sidebar;
