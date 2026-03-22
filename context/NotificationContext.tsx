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
  visible: boolean;
  config: NotificationConfig;
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
    <NotificationContext.Provider value={{ showNotification, hideNotification, visible, config }}>
      {children}
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
