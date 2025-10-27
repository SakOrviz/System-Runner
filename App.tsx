
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Player from './components/Player';
import EnemyComponent from './components/Enemy';
import Backgrounds from './components/Backgrounds';
import {
  Enemy,
  EnemyType,
  GameState,
  Position,
  PowerUp,
  PowerUpType,
  Particle,
  MathOperation,
  ScoreRecord,
} from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_Y,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_INITIAL_X,
  PLAYER_SPEED,
  JUMP_STRENGTH,
  GRAVITY,
  INITIAL_LIVES,
  TOTAL_LEVELS,
  LEVEL_SCORE_TARGET,
  LEVEL_CONFIG,
  ENEMY_CONFIG,
  POWERUP_WIDTH,
  POWERUP_HEIGHT,
  SHIELD_POWERUP_SPAWN_CHANCE,
  LIFE_POWERUP_SPAWN_CHANCE,
  SHIELD_DURATION,
  POWERUP_SPEED,
} from './constants';

// Helper function for collision detection
const checkCollision = (
  a: { position: Position; width: number; height: number },
  b: { position: Position; width: number; height: number }
) => {
  return (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y
  );
};

// Life Power Up Heart SVG
const LifePowerUpIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 50,90 C 10,50 30,20 50,40 C 70,20 90,50 50,90 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="5"/>
    </svg>
);


const App: React.FC = () => {
    // Game state
    const [gameState, setGameState] = useState<GameState>('menu');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(INITIAL_LIVES);
    const [level, setLevel] = useState(1);
    const [highScores, setHighScores] = useState<ScoreRecord[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Player state
    const [playerPosition, setPlayerPosition] = useState<Position>({ x: PLAYER_INITIAL_X, y: GROUND_Y - PLAYER_HEIGHT });
    const [playerVelocity, setPlayerVelocity] = useState<Position>({ x: 0, y: 0 });
    const [playerDirection, setPlayerDirection] = useState<'left' | 'right'>('right');
    const [isJumping, setIsJumping] = useState(false);
    const [isShielded, setIsShielded] = useState(false);
    const shieldTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Enemies and power-ups
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

    // Math challenge state
    const [mathProblem, setMathProblem] = useState<{ question: string, answer: number } | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [mathChallengeAttempts, setMathChallengeAttempts] = useState(0);

    // Refs
    const gameLoopRef = useRef<number>();
    const keysPressed = useRef<Record<string, boolean>>({});
    const lastEnemySpawnTime = useRef<number>(Date.now());
    const playerNameRef = useRef<HTMLInputElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const musicNodesRef = useRef<{ oscillator: OscillatorNode, gain: GainNode, sequenceTimeout: ReturnType<typeof setTimeout> | null } | null>(null);

    // Load high scores from local storage
    useEffect(() => {
        const storedHighScores = localStorage.getItem('highScores');
        if (storedHighScores) {
            setHighScores(JSON.parse(storedHighScores));
        }
    }, []);

    // Function to add a new high score
    const addHighScore = (newScore: ScoreRecord) => {
        const newHighScores = [...highScores, newScore]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        setHighScores(newHighScores);
        localStorage.setItem('highScores', JSON.stringify(newHighScores));
    };
    
    // Function to create particle explosion
    const createExplosion = (x: number, y: number, color: string) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 20; i++) {
            newParticles.push({
                id: Math.random(),
                x,
                y,
                size: Math.random() * 3 + 1,
                opacity: 1,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color,
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    };

    // --- AUDIO ---
    const stopMusic = useCallback(() => {
        if (musicNodesRef.current) {
            if (musicNodesRef.current.sequenceTimeout) {
                clearTimeout(musicNodesRef.current.sequenceTimeout);
            }
            musicNodesRef.current.oscillator.stop();
            musicNodesRef.current.oscillator.disconnect();
            musicNodesRef.current.gain.disconnect();
            musicNodesRef.current = null;
        }
    }, []);
    
    const playMusic = useCallback(() => {
        if (!audioContextRef.current) return;
        if (musicNodesRef.current) stopMusic();
    
        const audioCtx = audioContextRef.current;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
    
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        oscillator.connect(gainNode).connect(audioCtx.destination);
    
        const melody = [130.81, 164.81, 196.00, 220.00, 261.63, 220.00, 196.00, 164.81]; // C3, E3, G3, A3...
        let noteIndex = 0;
        const noteDuration = 250; // ms
    
        const playNextNote = () => {
            if (!musicNodesRef.current) return; 
            const freq = melody[noteIndex % melody.length];
            oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
            noteIndex++;
            musicNodesRef.current.sequenceTimeout = setTimeout(playNextNote, noteDuration);
        };
    
        oscillator.start();
        playNextNote();
        musicNodesRef.current = { oscillator, gain: gainNode, sequenceTimeout: null };
    }, [stopMusic]);
    
    useEffect(() => {
        if (gameState === 'playing' && audioContextRef.current?.state === 'running') {
            playMusic();
        } else {
            stopMusic();
        }
    
        return () => {
            stopMusic();
        };
    }, [gameState, playMusic, stopMusic]);


    const resetGame = useCallback(() => {
        setScore(0);
        setLives(INITIAL_LIVES);
        setLevel(1);
        setPlayerPosition({ x: PLAYER_INITIAL_X, y: GROUND_Y - PLAYER_HEIGHT });
        setPlayerVelocity({ x: 0, y: 0 });
        setIsJumping(false);
        setEnemies([]);
        setPowerUps([]);
        setIsShielded(false);
        if (shieldTimeoutRef.current) {
            clearTimeout(shieldTimeoutRef.current);
        }
    }, []);

    const startGame = () => {
        // Initialize AudioContext on first user interaction
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        resetGame();
        setGameState('playing');
        lastEnemySpawnTime.current = Date.now();
    };

    const generateMathProblem = async () => {
        const operations: MathOperation[] = ['addition', 'subtraction', 'multiplication'];
        if (level >= 4) operations.push('division');
        const operation = operations[Math.floor(Math.random() * operations.length)];

        let num1: number, num2: number, question: string, answer: number;

        switch (operation) {
            case 'addition':
                num1 = Math.floor(Math.random() * 10 * level) + 1;
                num2 = Math.floor(Math.random() * 10 * level) + 1;
                question = `${num1} + ${num2} = ?`;
                answer = num1 + num2;
                break;
            case 'subtraction':
                num1 = Math.floor(Math.random() * 10 * level) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                question = `${num1} - ${num2} = ?`;
                answer = num1 - num2;
                break;
            case 'multiplication':
                num1 = Math.floor(Math.random() * (level > 5 ? 12 : 10)) + 1;
                num2 = Math.floor(Math.random() * (level > 5 ? 12 : 10)) + 1;
                question = `${num1} × ${num2} = ?`;
                answer = num1 * num2;
                break;
            case 'division':
                answer = Math.floor(Math.random() * 10) + 2;
                num2 = Math.floor(Math.random() * 10) + 2;
                num1 = answer * num2;
                question = `${num1} ÷ ${num2} = ?`;
                break;
        }
        setMathProblem({ question, answer });
    };

    const handleMathChallenge = async () => {
        setGameState('mathChallenge');
        await generateMathProblem();
        setMathChallengeAttempts(0);
    };

    const submitMathAnswer = () => {
        const isCorrect = parseInt(userAnswer, 10) === mathProblem?.answer;
        if (isCorrect) {
            setLives(prev => Math.min(prev + 1, INITIAL_LIVES));
            setGameState('playing');
            setMathProblem(null);
            setUserAnswer('');
        } else {
            if (mathChallengeAttempts >= 2) {
                setGameState('playing');
                setMathProblem(null);
                setUserAnswer('');
            } else {
                setMathChallengeAttempts(prev => prev + 1);
                setUserAnswer('');
                generateMathProblem();
            }
        }
    };
    
    // Game loop logic
    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        const { enemySpeed, spawnInterval } = LEVEL_CONFIG[level];

        // Update player position
        setPlayerPosition(prevPos => {
            let newX = prevPos.x + playerVelocity.x;
            if (newX < 0) newX = 0;
            if (newX > GAME_WIDTH - PLAYER_WIDTH) newX = GAME_WIDTH - PLAYER_WIDTH;
            return { ...prevPos, x: newX };
        });

        setPlayerVelocity(prevVel => {
            let newYVel = prevVel.y + GRAVITY;
            return { ...prevVel, y: newYVel };
        });

        setPlayerPosition(prevPos => {
            let newY = prevPos.y + playerVelocity.y;
            if (newY >= GROUND_Y - PLAYER_HEIGHT) {
                newY = GROUND_Y - PLAYER_HEIGHT;
                if (isJumping) setIsJumping(false);
                setPlayerVelocity(prevVel => ({ ...prevVel, y: 0 }));
            }
            return { ...prevPos, y: newY };
        });

        // Handle player movement from keys
        setPlayerVelocity(prevVel => {
            let newXVel = 0;
            if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
                newXVel = -PLAYER_SPEED;
                setPlayerDirection('left');
            }
            if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
                newXVel = PLAYER_SPEED;
                setPlayerDirection('right');
            }
            return { ...prevVel, x: newXVel };
        });

        // Spawn enemies
        if (Date.now() - lastEnemySpawnTime.current > spawnInterval) {
            lastEnemySpawnTime.current = Date.now();
            const enemyTypes = Object.values(EnemyType);
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const config = ENEMY_CONFIG[type];
            setEnemies(prev => [
                ...prev,
                {
                    id: Math.random(),
                    type,
                    position: { x: GAME_WIDTH, y: GROUND_Y - config.height },
                    ...config,
                },
            ]);
        }

        // Move enemies and check for scoring/collision
        setEnemies(prevEnemies => {
            const updatedEnemies = prevEnemies
                .map(enemy => ({
                    ...enemy,
                    position: { ...enemy.position, x: enemy.position.x - enemySpeed },
                }))
                .filter(enemy => enemy.position.x > -enemy.width);

            updatedEnemies.forEach(enemy => {
                // Score for dodging
                if (enemy.position.x + enemy.width < playerPosition.x && !enemy.scored) {
                    enemy.scored = true;
                    setScore(s => s + LEVEL_CONFIG[level].pointsPerDodge);
                }
                
                // Collision with player
                if (checkCollision({ position: playerPosition, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }, enemy)) {
                    if (!isShielded) {
                        setLives(l => l - 1);
                        createExplosion(playerPosition.x + PLAYER_WIDTH / 2, playerPosition.y + PLAYER_HEIGHT / 2, '#ef4444');
                        if (lives - 1 <= 0) {
                            setGameState('gameOver');
                        } else {
                            handleMathChallenge();
                        }
                    } else {
                        createExplosion(enemy.position.x + enemy.width / 2, enemy.position.y + enemy.height / 2, '#3b82f6');
                    }
                    // Remove collided enemy
                    updatedEnemies.splice(updatedEnemies.indexOf(enemy), 1);
                }
            });

            return updatedEnemies;
        });
        
        // Spawn power-ups
        if (Math.random() < SHIELD_POWERUP_SPAWN_CHANCE) {
            setPowerUps(prev => [...prev, {
                id: Math.random(),
                type: PowerUpType.SHIELD,
                position: { x: GAME_WIDTH, y: GROUND_Y - PLAYER_HEIGHT - Math.random() * 50 },
                width: POWERUP_WIDTH,
                height: POWERUP_HEIGHT
            }]);
        }
        if (lives < INITIAL_LIVES && Math.random() < LIFE_POWERUP_SPAWN_CHANCE) {
            setPowerUps(prev => [...prev, {
                id: Math.random(),
                type: PowerUpType.LIFE,
                position: { x: GAME_WIDTH, y: GROUND_Y - PLAYER_HEIGHT - Math.random() * 50 },
                width: POWERUP_WIDTH,
                height: POWERUP_HEIGHT
            }]);
        }


        // Move power-ups and check for collision
        setPowerUps(prevPowerUps => {
            const updatedPowerUps = prevPowerUps
                .map(pu => ({ ...pu, position: { ...pu.position, x: pu.position.x - POWERUP_SPEED } }))
                .filter(pu => pu.position.x > -pu.width);

            updatedPowerUps.forEach(pu => {
                if (checkCollision({ position: playerPosition, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }, pu)) {
                    if (pu.type === PowerUpType.SHIELD) {
                        setIsShielded(true);
                        if(shieldTimeoutRef.current) clearTimeout(shieldTimeoutRef.current);
                        shieldTimeoutRef.current = setTimeout(() => setIsShielded(false), SHIELD_DURATION);
                    } else if (pu.type === PowerUpType.LIFE) {
                        setLives(l => Math.min(l + 1, INITIAL_LIVES));
                        createExplosion(playerPosition.x + PLAYER_WIDTH / 2, playerPosition.y + PLAYER_HEIGHT / 2, '#f472b6');
                    }
                    // Remove power-up on collection
                    updatedPowerUps.splice(updatedPowerUps.indexOf(pu), 1);
                }
            });
            return updatedPowerUps;
        });
        
        // Update particles
        setParticles(prev => prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.02,
        })).filter(p => p.opacity > 0));

        // Check for level up
        if (score >= level * LEVEL_SCORE_TARGET) {
            if (level + 1 > TOTAL_LEVELS) {
                setGameState('gameWon');
            } else {
                setLevel(l => l + 1);
            }
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [gameState, playerVelocity.y, isJumping, lives, isShielded, score, level]);

    // Keyboard event handlers
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        keysPressed.current[e.key] = true;
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && !isJumping && gameState === 'playing') {
            setIsJumping(true);
            setPlayerVelocity(prev => ({ ...prev, y: JUMP_STRENGTH }));
        }
        if (e.key === 'p' && gameState === 'playing') {
            setGameState('paused');
        }
        if (e.key === 'Enter' && gameState === 'gameOver') {
            setGameState('menu');
        }
    }, [isJumping, gameState]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        keysPressed.current[e.key] = false;
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    // Start/stop game loop
    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        } else {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        }
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameState, gameLoop]);
    
    // UI Components
    const UILayer: React.FC = () => (
        <div className="absolute top-0 left-0 w-full p-4 text-white font-mono text-xl z-10 flex justify-between">
            <div>Score: {score}</div>
            <div>Level: {level}</div>
            <div>Lives: {lives}</div>
        </div>
    );

    const Menu: React.FC = () => (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center font-mono z-20">
            <h1 className="text-6xl mb-4 animate-pulse">Techno Runner</h1>
            <p className="mb-8">Dodge the obsolete hardware!</p>
            <button onClick={startGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                Start Game
            </button>
            <div className="mt-8 w-1/2">
                <h2 className="text-2xl mb-2">High Scores</h2>
                <ol className="list-decimal list-inside">
                    {highScores.length > 0 ? highScores.map((hs, i) => (
                        <li key={i}>{hs.name}: {hs.score}</li>
                    )) : <p>No scores yet!</p>}
                </ol>
            </div>
        </div>
    );
    
    const GameOver: React.FC = () => (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center font-mono z-20">
            <h1 className="text-6xl mb-4 text-red-500">Game Over</h1>
            <p className="mb-4">Your final score: {score}</p>
            <div>
                <input ref={playerNameRef} type="text" placeholder="Enter your name" className="p-2 text-black" maxLength={10} />
                <button 
                    onClick={() => {
                        addHighScore({ name: playerNameRef.current?.value || 'Player', score });
                        setGameState('menu');
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    Save Score
                </button>
            </div>
            <button onClick={() => setGameState('menu')} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Back to Menu
            </button>
        </div>
    );

    const GameWon: React.FC = () => (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center font-mono z-20">
            <h1 className="text-6xl mb-4 text-yellow-400">You Won!</h1>
            <p className="mb-4">Congratulations! You've beaten all the levels!</p>
            <p className="mb-4">Your final score: {score}</p>
             <div>
                <input ref={playerNameRef} type="text" placeholder="Enter your name" className="p-2 text-black" maxLength={10}/>
                <button 
                    onClick={() => {
                        addHighScore({ name: playerNameRef.current?.value || 'Player', score });
                        setGameState('menu');
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    Save Score
                </button>
            </div>
            <button onClick={() => setGameState('menu')} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Back to Menu
            </button>
        </div>
    );

    const Paused: React.FC = () => (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center font-mono z-20">
            <h1 className="text-6xl mb-4">Paused</h1>
            <button onClick={() => setGameState('playing')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl mb-4">
                Resume
            </button>
            <button onClick={() => setGameState('menu')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Back to Menu
            </button>
        </div>
    );

    const MathChallenge: React.FC = () => (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center font-mono z-20">
            <h1 className="text-4xl mb-4">Math Challenge!</h1>
            <p className="mb-4">Answer correctly to get an extra life!</p>
            <p className="text-3xl mb-4">{mathProblem?.question}</p>
            <form onSubmit={(e) => { e.preventDefault(); submitMathAnswer(); }}>
                <input 
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="p-2 text-black text-2xl w-32 text-center"
                    autoFocus
                />
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2 text-2xl">
                    Submit
                </button>
            </form>
            <p className="mt-4">Attempts left: {3 - mathChallengeAttempts}</p>
        </div>
    );
    
    return (
        <div 
            className="relative bg-gray-800 overflow-hidden select-none" 
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: 'auto', marginTop: '2rem' }}
        >
            <Backgrounds level={level} />

            {(gameState === 'playing' || gameState === 'paused' || gameState === 'mathChallenge') && (
                <>
                    <Player position={playerPosition} direction={playerDirection} isShielded={isShielded} level={level} />
                    {enemies.map(enemy => <EnemyComponent key={enemy.id} enemy={enemy} />)}
                    {powerUps.map(pu => (
                        <div key={pu.id} className="absolute rounded-full" style={{ left: pu.position.x, top: pu.position.y, width: pu.width, height: pu.height, border: '2px solid white' }}>
                           {pu.type === PowerUpType.SHIELD ? (
                               <div className="text-center font-bold text-white text-lg bg-yellow-400 rounded-full w-full h-full flex items-center justify-center">S</div>
                           ) : (
                               <div className="w-full h-full bg-pink-300 rounded-full flex items-center justify-center p-1">
                                   <LifePowerUpIcon />
                               </div>
                           )}
                        </div>
                    ))}
                    {particles.map(p => (
                        <div key={p.id} className="absolute rounded-full" style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: p.color, opacity: p.opacity }}></div>
                    ))}
                    <UILayer />
                </>
            )}

            {gameState === 'menu' && <Menu />}
            {gameState === 'gameOver' && <GameOver />}
            {gameState === 'gameWon' && <GameWon />}
            {gameState === 'paused' && <Paused />}
            {gameState === 'mathChallenge' && <MathChallenge />}

        </div>
    );
};

export default App;