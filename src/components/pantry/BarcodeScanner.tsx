import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../store/slices/pantrySlice';
import { productApi } from '../../services/productApi';
import './BarcodeScanner.css';

interface BarcodeScannerProps {
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState('Position barcode in view');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    
    const startScanning = async () => {
      try {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        await reader.decodeFromVideoDevice(null, videoElement, async (result) => {
          if (result) {
            const barcode = result.getText();
            setMessage(`Found barcode: ${barcode}`);
            
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
              
              setMessage(`✅ Added: ${itemName}`);
              setTimeout(onClose, 1500);
            } else {
              setMessage('Product not found. Try manual entry.');
            }
            
            reader.reset();
          }
        });
      } catch (err) {
        setMessage('Camera access denied or not available');
      }
    };

    startScanning();

    return () => {
      reader.reset();
    };
  }, [dispatch, onClose]);

  return (
    <div className="scanner-modal">
      <div className="scanner-content">
        <h2>Scan Barcode</h2>
        <video ref={videoRef} className="scanner-video" />
        <p className="scanner-message">{message}</p>
        <button onClick={onClose} className="scanner-close">Cancel</button>
      </div>
    </div>
  );
};
