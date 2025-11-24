// Game state management
const gameState = {
    currentLanguage: 'en',
    currentLevel: 1,
    unlockedLevels: [1],
    introViewed: false,
    load: function () {
        const saved = localStorage.getItem('turnipGameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.currentLanguage = state.language || 'en';
            this.currentLevel = state.currentLevel || 1;
            this.unlockedLevels = state.unlockedLevels || [1];
            this.introViewed = state.introViewed || false;
        }
    },
    save: function () {
        localStorage.setItem('turnipGameState', JSON.stringify({
            language: this.currentLanguage,
            currentLevel: this.currentLevel,
            unlockedLevels: this.unlockedLevels,
            introViewed: this.introViewed
        }));
    },
    unlockLevel: function (level) {
        if (!this.unlockedLevels.includes(level)) {
            this.unlockedLevels.push(level);
            this.save();
        }
    },
    setLanguage: function (lang) {
        this.currentLanguage = lang;
        if (typeof TranslationManager !== 'undefined') {
            TranslationManager.setLanguage(lang);
        }
        this.save();
    }
};

// Load saved state on startup
gameState.load();

// Get window dimensions
function getGameDimensions() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

// Main game configuration and initialization
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [IntroScene, MenuScene, LevelScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    input: {
        activePointers: 3,
        smoothFactor: 0,
        touch: true,
        mouse: true
    }
};

// Initialize the game after DOM is ready
function initGame() {
    // Set initial language
    if (typeof TranslationManager !== 'undefined') {
        TranslationManager.setLanguage(gameState.currentLanguage);
    }

    // Create game instance
    const game = new Phaser.Game(config);

    // Handle window resize
    window.addEventListener('resize', function () {
        if (game && game.scale) {
            game.scale.resize(window.innerWidth, window.innerHeight);
        }
    });

    // Wait for game to be ready before starting scene
    game.events.once('ready', function () {
        // Start with appropriate scene
        if (!gameState.introViewed) {
            game.scene.start('IntroScene');
        } else {
            game.scene.start('MenuScene');
        }
    });

    // Fallback: start scene after a short delay if ready event doesn't fire
    setTimeout(function () {
        if (game && game.scene) {
            if (!gameState.introViewed) {
                game.scene.start('IntroScene');
            } else {
                game.scene.start('MenuScene');
            }
        }
    }, 100);
}

// Try to initialize immediately if DOM is ready, otherwise wait for load
if (document.readyState === 'loading') {
    window.addEventListener('load', initGame);
} else {
    // DOM is already ready
    initGame();
}

