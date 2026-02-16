import { useRef, useEffect, useState, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../store/slices/pantrySlice';
import { productApi } from '../../services/productApi';
import { playBeep, playErrorBeep } from '../../utils/beep';

export const useBarcodeScanner = (bulkMode: boolean, onClose: () => void) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState('Position barcode in view');
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [scanning, setScanning] = useState(true);
  const dispatch = useAppDispatch();

  const handleScan = useCallback(async (code: string) => {
    setMessage(`Found: ${code}`); playBeep();
    const p = await productApi.getByBarcode(code);
    if (p) {
      const n = p.brand ? `${p.brand} ${p.name}` : p.name;
      dispatch(addItem({ name: n, quantity: p.quantity || '1', location: 'pantry' }));
      setScannedItems(prev => [...prev, n]); setMessage(`✅ Added: ${n}`);
      if (!bulkMode) setTimeout(onClose, 1500); else setTimeout(() => setMessage('Scan next item...'), 1500);
    } else { playErrorBeep(); setMessage('❌ Product not found. Try another.'); }
  }, [bulkMode, dispatch, onClose]);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    const start = async () => {
      try {
        const el = videoRef.current;
        if (!el) return;
        await reader.decodeFromVideoDevice(null, el, (result) => {
          if (result && scanning) {
            setScanning(false);
            handleScan(result.getText()).then(() => setTimeout(() => setScanning(true), 2000));
          }
        });
      } catch { setMessage('Camera access denied or not available'); }
    };
    start();
    return () => { reader.reset(); };
  }, [handleScan, scanning]);

  return { videoRef, message, scannedItems };
};
