import React, { useState } from 'react';
import { useBarcodeScanner } from './useBarcodeScanner';
import { ScannerUI } from './ScannerUI';

interface Props { onClose: () => void; }

export const BarcodeScanner: React.FC<Props> = ({ onClose }) => {
  const [bulkMode, setBulkMode] = useState(false);
  const { videoRef, message, scannedItems } = useBarcodeScanner(bulkMode, onClose);

  return (
    <ScannerUI videoRef={videoRef} message={message} bulkMode={bulkMode}
      scannedItems={scannedItems} onToggleBulk={() => setBulkMode(!bulkMode)} onClose={onClose} />
  );
};
