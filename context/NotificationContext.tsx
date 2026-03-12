import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationModal } from 'components/NotificationModal';

interface NotificationConfig {
  title: string;
  description: string;
  leftButtonText?: string;
  rightButtonText?: string;
  highlightRight?: boolean;
  isChoice: boolean;
  delete: boolean;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

interface NotificationContextType {
  showNotification: (config: NotificationConfig) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<NotificationConfig>({
    title: '',
    description: '',
    isChoice: false,
    delete: false,
  });

  const showNotification = (newConfig: NotificationConfig) => {
    setConfig(newConfig);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <NotificationModal
        visible={visible}
        title={config.title}
        description={config.description}
        leftButtonText={config.leftButtonText}
        rightButtonText={config.rightButtonText}
        highlightRight={config.highlightRight}
        isChoice={config.isChoice}
        delete={config.delete}
        onLeftPress={config.onLeftPress}
        onRightPress={config.onRightPress}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
};
