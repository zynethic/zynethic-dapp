'use client';

import React, { useState } from 'react';
import styles from './SecurityScan.module.css';

interface GoPlusScanResult {
  is_honeypot: string;
  buy_tax: string;
  sell_tax: string;
  [key: string]: string | undefined;
}

export default function SecurityScan() {
  const [scanAddress, setScanAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<GoPlusScanResult | null>(null);

  const handleSecurityScan = async () => {
    if (!scanAddress.startsWith('0x') || scanAddress.length !== 42) {
      alert('Please enter a valid Base contract address.');
      return;
    }
    setIsScanning(true);
    try {
      const res = await fetch(`https://api.goplussecurity.com/api/v1/token_security/8453?contract_addresses=${scanAddress}`);
      const data = await res.json();
      if (data.result && data.result[scanAddress.toLowerCase()]) {
        setScanResult(data.result[scanAddress.toLowerCase()]);
      } else {
        alert('Scan failed: Address not found on Base.');
      }
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      <div className={styles.scanContainer}>
        <input
          type="text"
          placeholder="Paste Base Contract..."
          value={scanAddress}
          onChange={(e) => setScanAddress(e.target.value)}
          className={styles.scanInput}
        />
        <button onClick={handleSecurityScan} disabled={isScanning} className={styles.scanBtn}>
          {isScanning ? '...' : 'SCAN'}
        </button>
      </div>

      {scanResult && (
        <div className={styles.resultCard}>
          <p className={styles.resultText}>
            Honeypot:{' '}
            <span className={scanResult.is_honeypot === '1' ? styles.dangerStatus : styles.safeStatus}>
              {scanResult.is_honeypot === '1' ? 'DANGER' : 'SAFE'}
            </span>
          </p>
          <p className={styles.resultText}>
            Buy/Sell Tax: {scanResult.buy_tax || '0'}% / {scanResult.sell_tax || '0'}%
          </p>
        </div>
      )}
    </div>
  );
}
