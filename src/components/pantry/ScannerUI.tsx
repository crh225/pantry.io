import React from 'react';
import './BarcodeScanner.css';

interface ScannerUIProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  message: string; bulkMode: boolean; scannedItems: string[];
  onToggleBulk: () => void; onClose: () => void;
}

export const ScannerUI: React.FC<ScannerUIProps> = ({ videoRef, message, bulkMode, scannedItems, onToggleBulk, onClose }) => (
  <div className="scanner-modal">
    <div className="scanner-content">
      <h2>Scan Barcode</h2>
      <div className="scanner-viewport">
        <video ref={videoRef} className="scanner-video" />
        <div className="scan-overlay">
          <div className="scan-region">
            <div className="scan-corner tl" /><div className="scan-corner tr" />
            <div className="scan-corner bl" /><div className="scan-corner br" />
            <div className="scan-line" />
          </div>
          <p className="scan-hint">Align barcode within frame</p>
        </div>
      </div>
      <p className="scanner-message">{message}</p>
      <div className="scanner-controls">
        <label className="bulk-toggle">
          <input type="checkbox" checked={bulkMode} onChange={onToggleBulk} /><span>Bulk Scan Mode</span>
        </label>
      </div>
      {scannedItems.length > 0 && (
        <div className="scanned-list">
          <p><strong>Scanned ({scannedItems.length}):</strong></p>
          <ul>{scannedItems.map((item, i) => <li key={i}>✓ {item}</li>)}</ul>
        </div>
      )}
      <button onClick={onClose} className="scanner-close">
        {bulkMode ? `Done (${scannedItems.length} added)` : 'Cancel'}
      </button>
    </div>
  </div>
);
