'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Hash, Users, AlertTriangle, EyeOff, RotateCcw, ChevronRight, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './game.module.css';

const GAME_STATES = {
  SETUP: 'SETUP',
  PASS_PHONE: 'PASS_PHONE',
  REVEAL: 'REVEAL',
  TIMER: 'TIMER',
  GROUP_VOTE: 'GROUP_VOTE',
  IMPOSTER_GUESS: 'IMPOSTER_GUESS',
  RESULT: 'RESULT'
};

const CATEGORIES = {
  Animals: ['Lion', 'Elephant', 'Dog', 'Cat', 'Tiger', 'Rabbit'],
  FoodAndDrinks: ['Pizza', 'Burger', 'Momo', 'Apple', 'Coffee', 'Ice Cream'],
  Places: ['School', 'Beach', 'Hospital', 'Airport', 'Temple', 'Park'],
  Professions: ['Doctor', 'Teacher', 'Engineer', 'Chef', 'Pilot', 'Farmer'],
  HouseholdItems: ['Chair', 'Spoon', 'Fan', 'Mirror', 'Bed', 'TV'],
  MoviesAndCartoons: ['Spider-Man', 'Elsa', 'Batman', 'Minions', 'Harry Potter', 'Simba'],
  Sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Swimming', 'Boxing'],
  Nature: ['Mountain', 'River', 'Rain', 'Moon', 'Tree', 'Flower'],
  BodyParts: ['Nose', 'Eyes', 'Hands', 'Legs', 'Teeth', 'Ears'],
  Colors: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'Purple'],
  NepalFood: ['Momo', 'Sel Roti', 'Dal Bhat', 'Chatamari', 'Gundruk', 'Yomari'],
  NepalPlaces: ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Bhaktapur', 'Mustang'],
  Festivals: ['Dashain', 'Tihar', 'Holi', 'Christmas', 'Eid', 'New Year'],
  Technology: ['Laptop', 'Mobile', 'WiFi', 'Robot', 'YouTube', 'Keyboard'],
  Brands: ['Nike', 'Apple', 'Samsung', 'Adidas', 'Toyota', 'Coca-Cola'],
  Internet: ['Selfie', 'Meme', 'TikTok', 'Emoji', 'Password', 'Hashtag'],
  Emotions: ['Happy', 'Angry', 'Nervous', 'Excited', 'Proud', 'Lonely'],
  Verbs: ['Run', 'Dance', 'Sleep', 'Jump', 'Laugh', 'Cook'],
  FamousPeople: ['Cristiano Ronaldo', 'Taylor Swift', 'MrBeast', 'Shah Rukh Khan']
};

export default function ImposterGame({ onClose }) {
  // Game Setup State
  const [gameState, setGameState] = useState(GAME_STATES.SETUP);
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState(['Ashish', 'Player 2', 'Player 3', 'Player 4']);
  const [selectedCategory, setSelectedCategory] = useState('Tech');
  const [scores, setScores] = useState({}); // { 'Ashish': 0, ... }
  const [roundWinner, setRoundWinner] = useState(null);

  // Round State
  const [players, setPlayers] = useState([]); // [{ id, name, role }]
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0); // For pass phone
  const [secretWord, setSecretWord] = useState('');
  const [imposterId, setImposterId] = useState(null);
  const [imposterContext, setImposterContext] = useState('');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60);

  // Reveal Card State
  const [isFlipped, setIsFlipped] = useState(false);

  // Imposter Steal State
  const [imposterGuess, setImposterGuess] = useState('');
  const [votedOutId, setVotedOutId] = useState(null);

  // --- Functions ---
  const handlePlayerNameChange = (index, val) => {
    const newNames = [...playerNames];
    newNames[index] = val;
    setPlayerNames(newNames);
  };

  const updateNumPlayers = (n) => {
    let newNames = [...playerNames];
    if (n > playerNames.length) {
      newNames = [...newNames, ...Array(n - playerNames.length).fill('').map((_, i) => `Player ${playerNames.length + i + 1}`)];
    } else {
      newNames = newNames.slice(0, n);
    }
    setNumPlayers(n);
    setPlayerNames(newNames);
  };

  const startRound = () => {
    // Check blank names
    const finalNames = playerNames.map((n, i) => n.trim() || `Player ${i + 1}`);
    setPlayerNames(finalNames);

    // Pick topic and word
    const wordsPool = CATEGORIES[selectedCategory];
    const word = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    setSecretWord(word);

    // Create context hint for Imposter (3 random other words in same category)
    const hints = wordsPool.filter(w => w !== word).sort(() => 0.5 - Math.random()).slice(0, 3);
    setImposterContext(hints.join(', '));

    // Assign roles
    const shuffledIds = finalNames.map((_, i) => i).sort(() => 0.5 - Math.random());
    const theImposterId = shuffledIds[0];
    setImposterId(theImposterId);

    const roundPlayers = finalNames.map((name, i) => ({
      id: i,
      name,
      role: i === theImposterId ? 'Imposter' : 'Crew'
    }));

    setPlayers(roundPlayers);
    setCurrentTurnIndex(0);
    setIsFlipped(false);
    
    // Init scores if first time
    if (Object.keys(scores).length === 0) {
      const initScores = {};
      finalNames.forEach(n => initScores[n] = 0);
      setScores(initScores);
    }

    setGameState(GAME_STATES.PASS_PHONE);
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNextPlayer = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentTurnIndex + 1 < players.length) {
        setCurrentTurnIndex(curr => curr + 1);
        setGameState(GAME_STATES.PASS_PHONE);
      } else {
        // All players have seen their role
        setGameState(GAME_STATES.TIMER);
        setTimeLeft(60);
      }
    }, 300);
  };

  useEffect(() => {
    let timer;
    if (gameState === GAME_STATES.TIMER && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleGroupVote = (id) => {
    setVotedOutId(id);
    if (id === imposterId) {
      // Imposter caught! They get a chance to steal
      setGameState(GAME_STATES.IMPOSTER_GUESS);
    } else {
      // Crew failed, Imposter wins automatically
      triggerWin('Imposter');
    }
  };

  const submitImposterGuess = () => {
    const guess = imposterGuess.trim().toLowerCase();
    const actual = secretWord.trim().toLowerCase();
    if (guess === actual) {
      triggerWin('Imposter');
    } else {
      triggerWin('Crew');
    }
  };

  const triggerWin = (winner) => {
    setRoundWinner(winner);
    // Update scores
    setScores(prev => {
      const next = { ...prev };
      if (winner === 'Crew') {
        players.forEach(p => {
          if (p.role === 'Crew') next[p.name] = (next[p.name] || 0) + 1;
        });
      } else {
        const imposterName = players.find(p => p.role === 'Imposter').name;
        next[imposterName] = (next[imposterName] || 0) + 3; // 3 points for imposter win!
      }
      return next;
    });

    setGameState(GAME_STATES.RESULT);

    if (winner === 'Crew') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#ffffff']
      });
    } else {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#000000']
      });
    }
  };

  // Render Helpers
  const renderSetup = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <h1 className={styles.logoTitle} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Word <span style={{ color: '#ec4899' }}>Imposter</span>
      </h1>
      
      <p style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '2rem' }}>
        A local pass-and-play party game of deception. Find the Imposter!
      </p>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Number of Players: {numPlayers}</h3>
        <input 
          type="range" 
          min="3" max="12" 
          value={numPlayers} 
          onChange={(e) => updateNumPlayers(parseInt(e.target.value))}
          style={{ width: '80%', accentColor: '#ec4899' }}
        />
      </div>

      <div className={styles.setupGrid}>
        {playerNames.map((name, i) => (
          <input 
            key={i}
            type="text" 
            placeholder={`Player ${i + 1}`}
            value={name}
            onChange={(e) => handlePlayerNameChange(i, e.target.value)}
            className={styles.inputField}
            style={{ marginBottom: '0' }}
          />
        ))}
      </div>

      <h3 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' }}>Choose Category</h3>
      <div className={styles.categoryGrid}>
        {Object.keys(CATEGORIES).map(cat => (
          <div 
            key={cat} 
            className={`${styles.categoryChip} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
        <button className={styles.startBtn} onClick={startRound}>
          Start Round
        </button>
      </div>
    </div>
  );

  const renderPassPhone = () => {
    const activePlayer = players[currentTurnIndex];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <EyeOff size={80} color="#a1a1aa" style={{ marginBottom: '2rem' }} />
        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Pass the phone to</h2>
        <h1 style={{ color: '#ec4899', fontSize: '3.5rem', marginBottom: '3rem', fontWeight: 900 }}>{activePlayer?.name}</h1>
        <p style={{ color: '#ef4444', marginBottom: '2rem', fontWeight: 'bold' }}>Keep it hidden from others!</p>
        <button className={styles.startBtn} onClick={() => setGameState(GAME_STATES.REVEAL)}>
          I am {activePlayer?.name}
        </button>
      </div>
    );
  };

  const renderReveal = () => {
    const activePlayer = players[currentTurnIndex];
    const isImposter = activePlayer?.role === 'Imposter';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div className={styles.flipContainer} onClick={handleFlip}>
          <div className={`${styles.flipper} ${isFlipped ? styles.flipped : ''}`}>
            {/* Front of card */}
            <div className={styles.front}>
              <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Role Card</h2>
              <p style={{ color: '#a1a1aa' }}>Tap card to reveal your identity</p>
            </div>
            
            {/* Back of card */}
            <div className={`${styles.back} ${isImposter ? styles.imposter : ''}`}>
              {isImposter ? (
                <>
                  <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '1rem' }}>IMPOSTER</h2>
                  <p style={{ color: '#a1a1aa', fontSize: '1.2rem', textAlign: 'center', lineHeight: '1.6' }}>
                    <strong style={{color:'#ec4899'}}>Context Hint:</strong> It's something similar to:<br/> <span style={{color:'white', fontStyle:'italic'}}>{imposterContext}</span><br/><br/>
                    You don't know the exact word or category! Listen to others and blend in.
                  </p>
                </>
              ) : (
                <>
                  <Hash size={64} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '1rem' }}>CREWMATE</h2>
                  <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '1rem' }}>The secret word is:</p>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(59,130,246,0.5)', textAlign: 'center' }}>
                    "{secretWord}"
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFlipped && (
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.startBtn} 
              style={{ marginTop: '3rem', width: 'auto', padding: '1rem 4rem' }}
              onClick={handleNextPlayer}
            >
              Got It! Hide Role
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderTimer = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem', textAlign: 'center' }}>Discussion Phase</h2>
      <p style={{ color: '#a1a1aa', textAlign: 'center', maxWidth: '500px', marginBottom: '3rem' }}>
        Go around the circle and say exactly <strong>ONE WORD</strong> related to the secret word. Do not repeat words!
      </p>

      <div className={`${styles.timerCircle} ${timeLeft <= 10 ? styles.urgent : ''}`}>
        {timeLeft}
      </div>

      <button className={styles.startBtn} onClick={() => setGameState(GAME_STATES.GROUP_VOTE)}>
        Time's Up! Vote Now
      </button>
    </div>
  );

  const renderVote = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem', textAlign: 'center' }}>Group Vote</h2>
      <p style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '2rem' }}>
        Who does the group think the Imposter is? Tap to eliminate.
      </p>

      <div className={styles.votingGrid}>
        {players.map(p => (
          <div key={p.id} className={styles.voteCard} onClick={() => handleGroupVote(p.id)}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderImposterGuess = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <AlertTriangle size={80} color="#ef4444" style={{ marginBottom: '1rem' }} />
      <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem', textAlign: 'center' }}>Imposter Caught!</h2>
      <p style={{ color: '#a1a1aa', textAlign: 'center', maxWidth: '500px', marginBottom: '2rem', fontSize: '1.2rem' }}>
        The crew found the Imposter! But wait... <br/>
        Imposter, you have one chance to steal the win. What was the secret word?
      </p>

      <div style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
        Category: <strong style={{ color: '#ec4899' }}>{selectedCategory.replace(/([A-Z])/g, ' $1').trim()}</strong>
      </div>

      <input 
        type="text" 
        placeholder="Type secret word..." 
        value={imposterGuess}
        onChange={(e) => setImposterGuess(e.target.value)}
        className={styles.inputField}
        style={{ maxWidth: '400px', textAlign: 'center', fontSize: '1.5rem' }}
        onKeyDown={(e) => e.key === 'Enter' && submitImposterGuess()}
      />
      <button className={styles.startBtn} onClick={submitImposterGuess}>
        Final Guess
      </button>
    </div>
  );

  const renderResult = () => {
    const isImposterWin = roundWinner === 'Imposter';
    const imposterPlayer = players.find(p => p.role === 'Imposter');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem 0' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          color: isImposterWin ? '#ef4444' : '#10b981',
          marginBottom: '1rem',
          textAlign: 'center',
          textShadow: `0 0 20px ${isImposterWin ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}`
        }}>
          {isImposterWin ? 'IMPOSTER WINS' : 'CREWMATES WIN'}
        </h1>
        
        <p style={{ fontSize: '1.5rem', color: 'white', marginBottom: '3rem' }}>
          {imposterPlayer?.name} was the Imposter! The word was <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{secretWord}</span>.
        </p>

        {/* Scoreboard */}
        <div className={styles.scoreBoard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #3f3f5a', paddingBottom: '1rem', marginBottom: '1rem', color: '#a1a1aa' }}>
            <Trophy size={20} /> <span>Live Scoreboard</span>
          </div>
          {Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .map(([name, score], idx) => (
              <div key={name} className={styles.scoreRow}>
                <span>{idx + 1}. {name}</span>
                <span style={{ color: '#ec4899', fontSize: '1.2rem' }}>{score} pts</span>
              </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className={styles.startBtn} onClick={() => {
            setImposterGuess('');
            setGameState(GAME_STATES.SETUP);
          }}>
            Next Round <RotateCcw size={18} style={{ display: 'inline', marginLeft: '0.5rem' }}/>
          </button>
          <button className={styles.startBtn} style={{ background: '#3f3f5a', width: 'auto' }} onClick={onClose}>
            Exit Game
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <motion.div 
        className={styles.gameWindow}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className={styles.gameHeader}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} /> Party Mode Room
          </span>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', color: 'white', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={gameState}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1 }}
            >
              {gameState === GAME_STATES.SETUP && renderSetup()}
              {gameState === GAME_STATES.PASS_PHONE && renderPassPhone()}
              {gameState === GAME_STATES.REVEAL && renderReveal()}
              {gameState === GAME_STATES.TIMER && renderTimer()}
              {gameState === GAME_STATES.GROUP_VOTE && renderVote()}
              {gameState === GAME_STATES.IMPOSTER_GUESS && renderImposterGuess()}
              {gameState === GAME_STATES.RESULT && renderResult()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
