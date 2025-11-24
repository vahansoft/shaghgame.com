// Game Over / Victory Scene
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Detect mobile device
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       (window.innerWidth <= 768);
        
        // Calculate responsive scale - more aggressive for mobile
        if (this.isMobile) {
            this.scaleFactor = Math.min(width / 1024, height / 768) * 0.85;
            this.minTouchSize = 44;
        } else {
            this.scaleFactor = Math.min(width / 1024, height / 768);
            this.minTouchSize = 35;
        }
        
        // Beautiful golden gradient background (draw first)
        const bg = GraphicsHelper.createGradientBackground(this, 0xFFD700, 0xFFA500);
        bg.setDepth(0);
        
        // Add celebration particles
        this.createCelebrationParticles();
        
        // Victory message with shadow (responsive)
        const victoryStyle = GraphicsHelper.createStyledText(this, width / 2, height / 2 - Math.max(100, 150 * this.scaleFactor), TranslationManager.t('gameComplete'), {
            fontSize: Math.max(36, 56 * this.scaleFactor) + 'px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });
        
        // Celebration animation
        this.tweens.add({
            targets: victoryStyle.mainText,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Rotate colors
        this.tweens.add({
            targets: victoryStyle.mainText,
            alpha: 0.8,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // All characters together with celebration (responsive)
        const characters = getAllCharactersInOrder();
        const charSpacing = Math.max(55, 70 * this.scaleFactor);
        const charStartX = width / 2 - (characters.length - 1) * charSpacing / 2;
        const charSize = Math.max(45, 60 * this.scaleFactor);
        this.characterGroups = [];
        
        characters.forEach((char, index) => {
            const x = charStartX + index * charSpacing;
            const y = height / 2 + Math.max(15, 20 * this.scaleFactor);
            
            const charGroup = GraphicsHelper.createCharacterSprite(this, x, y, char, charSize);
            this.characterGroups.push(charGroup);
            
            // Bounce animation
            this.tweens.add({
                targets: Object.values(charGroup),
                y: y - 10,
                duration: 800 + index * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 100
            });
            
            // Rotation animation
            this.tweens.add({
                targets: Object.values(charGroup),
                angle: 5,
                duration: 1000 + index * 150,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 150
            });
        });
        
        // Final turnip (responsive)
        const turnipWidth = Math.max(90, 120 * this.scaleFactor);
        const turnipHeight = Math.max(120, 160 * this.scaleFactor);
        this.finalTurnipGroup = GraphicsHelper.createTurnip(this, width / 2, height / 2 + Math.max(130, 180 * this.scaleFactor), turnipWidth, turnipHeight);
        const turnipTargets = [this.finalTurnipGroup.turnipBody, this.finalTurnipGroup.turnipHighlight, this.finalTurnipGroup.border];
        if (this.finalTurnipGroup.leaves) {
            turnipTargets.push(...this.finalTurnipGroup.leaves);
        }
        
        this.tweens.add({
            targets: turnipTargets,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Rotate turnip
        this.tweens.add({
            targets: turnipTargets,
            angle: 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Menu button (responsive, touch-friendly on mobile)
        const menuBtnWidth = this.isMobile ? Math.max(250, 280 * this.scaleFactor) : Math.max(200, 250 * this.scaleFactor);
        const menuBtnHeight = this.isMobile ? Math.max(60, 75 * this.scaleFactor) : Math.max(55, 70 * this.scaleFactor);
        const menuBtn = MobileHelper.createSimpleButton(
            this, 
            width / 2, 
            height - Math.max(60, 80 * this.scaleFactor), 
            menuBtnWidth, 
            menuBtnHeight, 
            0x27AE60, 
            TranslationManager.t('menu'), 
            Math.max(24, 32 * this.scaleFactor),
            () => this.goToMenu()
        );
    }
    
    createCelebrationParticles() {
        const { width, height } = this.cameras.main;
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 5 + Math.random() * 10;
            const color = [0xFFD700, 0xFFA500, 0xFFFF00, 0xFFE5B4][Math.floor(Math.random() * 4)];
            
            const particle = this.add.circle(x, y, size, color, 0.8);
            
            this.tweens.add({
                targets: particle,
                y: y - 200,
                x: x + (Math.random() - 0.5) * 100,
                alpha: 0,
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                delay: Math.random() * 2000,
                ease: 'Power1'
            });
            
            this.tweens.add({
                targets: particle,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    goToMenu() {
        this.scene.start('MenuScene');
    }
}

