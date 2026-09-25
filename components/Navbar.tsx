'use client';

import React from 'react';
import styles from './Navbar.module.css';
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Name, Address, Avatar } from '@coinbase/onchainkit/identity';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = ['dashboard', 'tiers', 'governance', 'swap', 'leaderboard', 'burn'];

  const getIconClass = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'fa-chart-line';
      case 'tiers': return 'fa-layer-group';
      case 'governance': return 'fa-vote-yea';
      case 'swap': return 'fa-right-left';
      case 'leaderboard': return 'fa-trophy';
      case 'burn': return 'fa-fire';
      default: return 'fa-circle';
    }
  };

  const NavItems = () => (
    <>
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`${styles.navItem} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          <i className={`fa-solid ${getIconClass(tab)}`}></i>
          <span className={styles.navText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
        </div>
      ))}
    </>
  );

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png"
            alt="ZNTC Logo"
            className={styles.brandLogo}
          />
          <div className={styles.brandName}>ZYNETHIC</div>
        </div>

        <div className={styles.navCenterWrapper}>
          <div className={styles.navLinksDesktop}>
            <NavItems />
          </div>
        </div>

        <div className={styles.walletWrapper}>
          <Wallet>
            <ConnectWallet className={styles.btnConnectFixed}>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </nav>

      <div className={styles.mobileMenu}>
        <NavItems />
      </div>
    </>
  );
}
