import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../store/slices/pantrySlice';
import { productApi } from '../../services/productApi';
import { playBeep } from '../../utils/beep';
import { ScannerUI } from './ScannerUI';

interface BarcodeScannerProps {
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [message, setMessage] = useState('Position barcode in view');
  const [bulkMode, setBulkMode] = useState(false);
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [scanning, setScanning] = useState(true);
  const dispatch = useAppDispatch();

  const handleScan = useCallback(async (barcode: string) => {
    setMessage(`Found: ${barcode}`);
    playBeep();

    const product = await productApi.getByBarcode(barcode);
    if (product) {
      const itemName = product.brand
        ? `${product.brand} ${product.name}`
        : product.name;

      dispatch(addItem({
        name: itemName,
        quantity: product.quantity || '1',
        location: 'pantry',
      }));

      setScannedItems(prev => [...prev, itemName]);
      setMessage(`✅ Added: ${itemName}`);

      if (!bulkMode) {
        setTimeout(onClose, 1500);
      } else {
        setTimeout(() => setMessage('Scan next item...'), 1500);
      }
    } else {
      setMessage('Product not found. Try another.');
    }
  }, [bulkMode, dispatch, onClose]);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    const start = async () => {
      try {
        const el = videoRef.current;
        if (!el) return;
        await reader.decodeFromVideoDevice(null, el, (result) => {
          if (result && scanning) {
            setScanning(false);
            handleScan(result.getText()).then(() => {
              setTimeout(() => setScanning(true), 2000);
            });
          }
        });
      } catch {
        setMessage('Camera access denied or not available');
      }
    };

    start();
    return () => { reader.reset(); };
  }, [handleScan, scanning]);

  return (
    <ScannerUI
      videoRef={videoRef}
      message={message}
      bulkMode={bulkMode}
      scannedItems={scannedItems}
      onToggleBulk={() => setBulkMode(!bulkMode)}
      onClose={onClose}
    />
  );
};
