// Introduction Scene - Story of how the turnip was planted
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
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
        
        // Beautiful gradient background (draw first)
        const bg = GraphicsHelper.createGradientBackground(this, 0x87CEEB, 0xE0F6FF);
        bg.setDepth(0);
        
        // Add clouds
        this.createClouds();
        
        // Title with shadow (responsive)
        const titleStyle = GraphicsHelper.createStyledText(this, width / 2, Math.max(60, 80 * this.scaleFactor), TranslationManager.t('introTitle'), {
            fontSize: Math.max(36, 56 * this.scaleFactor) + 'px',
            color: '#2C3E50',
            fontStyle: 'bold'
        });
        
        // Story panel (responsive)
        const panelPadding = Math.max(50, 100 * this.scaleFactor);
        const panelHeight = Math.max(150, 200 * this.scaleFactor);
        const storyPanel = GraphicsHelper.createPanel(this, width / 2, height / 2 - Math.max(20, 30 * this.scaleFactor), width - panelPadding, panelHeight, 0xFFFFFF, 0.95);
        
        // Story text parts
        this.storyParts = [
            TranslationManager.t('introPart1'),
            TranslationManager.t('introPart2'),
            TranslationManager.t('introPart3'),
            TranslationManager.t('introPart4'),
            TranslationManager.t('introPart5')
        ];
        
        this.currentPart = 0;
        
        // Story text display (responsive)
        this.storyText = this.add.text(width / 2, height / 2 - Math.max(20, 30 * this.scaleFactor), '', {
            fontSize: Math.max(18, 26 * this.scaleFactor) + 'px',
            fontFamily: 'Arial',
            color: '#2C3E50',
            wordWrap: { width: width - Math.max(100, 150 * this.scaleFactor) },
            align: 'center',
            lineSpacing: 8 * this.scaleFactor
        }).setOrigin(0.5);
        
        // Visual elements - Grandfather (responsive)
        const grandfather = getCharacter('grandfather');
        const charSize = Math.max(60, 80 * this.scaleFactor);
        this.grandfatherGroup = GraphicsHelper.createCharacterSprite(this, width * 0.2, height - Math.max(120, 180 * this.scaleFactor), grandfather, charSize);
        this.grandfather = this.grandfatherGroup.body;
        
        // Turnip (responsive)
        const turnipWidth = Math.max(40, 50 * this.scaleFactor);
        const turnipHeight = Math.max(55, 70 * this.scaleFactor);
        this.turnipGroup = GraphicsHelper.createTurnip(this, width * 0.4, height - Math.max(160, 220 * this.scaleFactor), turnipWidth, turnipHeight);
        this.turnip = this.turnipGroup.turnipBody;
        this.turnipScale = 1;
        
        // Ground with texture
        this.createGround();
        
        // Skip button (responsive, touch-friendly on mobile)
        const skipBtnWidth = this.isMobile ? Math.max(140, 160 * this.scaleFactor) : Math.max(120, 150 * this.scaleFactor);
        const skipBtnHeight = this.isMobile ? Math.max(44, 50 * this.scaleFactor) : Math.max(40, 50 * this.scaleFactor);
        const skipBtn = MobileHelper.createSimpleButton(
            this, 
            width - skipBtnWidth / 2 - Math.max(20, 30 * this.scaleFactor), 
            Math.max(35, 50 * this.scaleFactor), 
            skipBtnWidth, 
            skipBtnHeight, 
            0x7F8C8D, 
            TranslationManager.t('skip'), 
            Math.max(16, 20 * this.scaleFactor),
            () => this.skipIntro()
        );
        
        // Continue button (initially hidden, responsive, touch-friendly on mobile)
        const continueBtnWidth = this.isMobile ? Math.max(250, 280 * this.scaleFactor) : Math.max(200, 250 * this.scaleFactor);
        const continueBtnHeight = this.isMobile ? Math.max(60, 75 * this.scaleFactor) : Math.max(55, 70 * this.scaleFactor);
        this.continueBtn = MobileHelper.createSimpleButton(
            this, 
            width / 2, 
            height - Math.max(70, 100 * this.scaleFactor), 
            continueBtnWidth, 
            continueBtnHeight, 
            0x27AE60, 
            TranslationManager.t('continue'), 
            Math.max(22, 28 * this.scaleFactor),
            () => this.goToMenu()
        );
        this.continueBtn.container.setVisible(false);
        
        // Start animation
        this.time.delayedCall(500, () => this.showNextPart());
    }
    
    createClouds() {
        const { width, height } = this.cameras.main;
        // Create decorative clouds
        for (let i = 0; i < 5; i++) {
            const x = (width / 5) * i + 100;
            const y = 50 + Math.random() * 100;
            this.createCloud(x, y, 0.5 + Math.random() * 0.5);
        }
    }
    
    createCloud(x, y, scale) {
        const cloud = this.add.graphics();
        cloud.fillStyle(0xFFFFFF, 0.8);
        cloud.fillCircle(x, y, 30 * scale);
        cloud.fillCircle(x + 25 * scale, y, 35 * scale);
        cloud.fillCircle(x + 50 * scale, y, 30 * scale);
        cloud.fillCircle(x + 12 * scale, y - 15 * scale, 25 * scale);
        cloud.fillCircle(x + 38 * scale, y - 15 * scale, 25 * scale);
    }
    
    createGround() {
        const { width, height } = this.cameras.main;
        // Ground base
        this.add.rectangle(width / 2, height - 30, width, 100, 0x8B4513);
        
        // Ground texture (grass)
        const grass = this.add.graphics();
        grass.fillStyle(0x228B22, 0.6);
        for (let i = 0; i < width; i += 20) {
            const heightVariation = Math.random() * 10;
            grass.fillRect(i, height - 100, 15, 5 + heightVariation);
        }
    }

    showNextPart() {
        if (this.currentPart < this.storyParts.length) {
            // Fade in text
            this.storyText.setAlpha(0);
            this.storyText.setText(this.storyParts[this.currentPart]);
            this.tweens.add({
                targets: this.storyText,
                alpha: 1,
                duration: 500
            });
            
            // Animate turnip growing
            if (this.currentPart === 1) {
                this.tweens.add({
                    targets: [this.turnip, this.turnipGroup.turnipHighlight, this.turnipGroup.border, this.turnipGroup.shadow],
                    scaleX: 2.5,
                    scaleY: 2.5,
                    duration: 1500,
                    ease: 'Power2'
                });
                this.turnipGroup.leaves.forEach(leaf => {
                    this.tweens.add({
                        targets: leaf,
                        scaleX: 2.5,
                        scaleY: 2.5,
                        duration: 1500,
                        ease: 'Power2'
                    });
                });
            }
            
            // Animate grandfather trying to pull
            if (this.currentPart === 3) {
                const pullAnimation = this.tweens.add({
                    targets: [this.grandfather, ...Object.values(this.grandfatherGroup)],
                    x: 350,
                    duration: 400,
                    yoyo: true,
                    repeat: 3,
                    ease: 'Power2'
                });
                
                // Add rotation for pulling effect
                this.tweens.add({
                    targets: this.grandfather,
                    angle: -15,
                    duration: 200,
                    yoyo: true,
                    repeat: 6,
                    ease: 'Sine.easeInOut'
                });
            }
            
            this.currentPart++;
            
            if (this.currentPart < this.storyParts.length) {
                this.time.delayedCall(3500, () => this.showNextPart());
            } else {
                // Show continue button with animation
                this.continueBtn.container.setVisible(true);
                this.continueBtn.button.setVisible(true);
                this.continueBtn.buttonText.setVisible(true);
                this.continueBtn.shadow.setVisible(true);
                this.continueBtn.button.setAlpha(0);
                this.continueBtn.buttonText.setAlpha(0);
                this.continueBtn.shadow.setAlpha(0);
                
                this.tweens.add({
                    targets: [this.continueBtn.button, this.continueBtn.buttonText, this.continueBtn.shadow],
                    alpha: 1,
                    duration: 500
                });
                
                // Pulse animation
                this.tweens.add({
                    targets: this.continueBtn.container,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 600,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
    }

    skipIntro() {
        this.goToMenu();
    }

    goToMenu() {
        if (typeof gameState !== 'undefined') {
            gameState.introViewed = true;
            gameState.save();
        }
        this.scene.start('MenuScene');
    }
}

