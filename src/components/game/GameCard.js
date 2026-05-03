'use client';

import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import styles from './game.module.css';
import ImposterGame from './ImposterGame';

export default function GameCard() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <>
      <div className={styles.gameCard} onClick={() => setIsGameOpen(true)}>
        <div className={styles.glowEffect}></div>
        
        <div className={styles.logoContainer}>
          {/* Reusing existing logo aesthetic or you can insert a specific img tag */}
          Ashish<span style={{ color: '#ec4899' }}>.</span>
        </div>
        
        <div className={styles.secretText}>
          Feeling bored? Try our secret game 👀
        </div>
        
        <button className={styles.playBtn} onClick={(e) => { e.stopPropagation(); setIsGameOpen(true); }}>
          <Gamepad2 size={20} /> Play Now
        </button>
      </div>

      {isGameOpen && <ImposterGame onClose={() => setIsGameOpen(false)} />}
    </>
  );
}
