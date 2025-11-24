// Main Menu Scene
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
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

        // Beautiful gradient background (draw first, behind everything)
        const bg = GraphicsHelper.createGradientBackground(this, 0x667eea, 0x764ba2);
        bg.setDepth(0);

        // Decorative elements
        this.createDecorativeElements();

        // Title with shadow (responsive) - positioned at top
        const titleY = height * 0.12;
        const titleStyle = GraphicsHelper.createStyledText(this, width / 2, titleY, TranslationManager.t('introTitle'), {
            fontSize: Math.max(36, 56 * this.scaleFactor) + 'px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });

        // Animate title
        this.tweens.add({
            targets: titleStyle.mainText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Language selection panel (responsive) - positioned below title with spacing
        const langPanelY = height * 0.28;
        const langPanelHeight = Math.max(90, 120 * this.scaleFactor);
        const langPanel = GraphicsHelper.createPanel(this, width / 2, langPanelY, Math.max(320, 400 * this.scaleFactor), langPanelHeight, 0xFFFFFF, 0.95);
        langPanel.panel.setDepth(100);
        langPanel.shadow.setDepth(99);

        const langLabel = GraphicsHelper.createStyledText(this, width / 2, langPanelY - langPanelHeight / 2 - Math.max(20, 25 * this.scaleFactor), TranslationManager.t('selectLanguage'), {
            fontSize: Math.max(18, 24 * this.scaleFactor) + 'px',
            color: '#2C3E50'
        });
        langLabel.mainText.setDepth(101).setInteractive(false);
        langLabel.shadow.setDepth(100);

        const languages = [
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' }
        ];

        const langY = langPanelY;
        const langSpacing = Math.max(90, 120 * this.scaleFactor);
        const langStartX = width / 2 - (languages.length - 1) * langSpacing / 2;

        this.langButtons = [];
        languages.forEach((lang, index) => {
            const x = langStartX + index * langSpacing;
            const isSelected = (typeof gameState !== 'undefined' && gameState.currentLanguage === lang.code);
            const btnWidth = Math.max(80, 100 * this.scaleFactor);
            const btnHeight = Math.max(65, 80 * this.scaleFactor);

            // Ensure touch-friendly size
            const finalBtnWidth = Math.max(btnWidth, this.minTouchSize);
            const finalBtnHeight = Math.max(btnHeight, this.minTouchSize);

            const langButton = this.add.rectangle(x, langY, finalBtnWidth, finalBtnHeight, isSelected ? 0x27AE60 : 0xECF0F1)
                .setInteractive({ useHandCursor: !this.isMobile })
                .setStrokeStyle(Math.max(2, 3 * this.scaleFactor), isSelected ? 0x27AE60 : 0xBDC3C7, 1)
                .setDepth(102)
                .on('pointerdown', () => this.selectLanguage(lang.code));

            const flagText = this.add.text(x, langY - Math.max(15, 20 * this.scaleFactor), lang.flag, {
                fontSize: Math.max(30, 40 * this.scaleFactor) + 'px'
            })
                .setOrigin(0.5)
                .setDepth(103)
                .setInteractive(false);

            const nameText = this.add.text(x, langY + Math.max(18, 25 * this.scaleFactor), lang.name, {
                fontSize: Math.max(13, 16 * this.scaleFactor) + 'px',
                color: '#2C3E50',
                fontStyle: 'bold'
            })
                .setOrigin(0.5)
                .setDepth(103)
                .setInteractive(false);

            let checkmark = null;
            if (isSelected) {
                checkmark = this.add.text(x, langY + Math.max(35, 45 * this.scaleFactor), '✓', {
                    fontSize: Math.max(18, 24 * this.scaleFactor) + 'px',
                    color: '#FFFFFF',
                    fontStyle: 'bold'
                })
                    .setOrigin(0.5)
                    .setDepth(103)
                    .setInteractive(false);
            }

            langButton.on('pointerover', function () {
                if (!isSelected) {
                    this.setFillStyle(0xD5DBDB);
                }
            });

            langButton.on('pointerout', function () {
                if (!isSelected) {
                    this.setFillStyle(0xECF0F1);
                }
            });

            this.langButtons.push({ button: langButton, flagText, nameText, checkmark, lang });
        });

        // Play button (responsive) - positioned below language panel with spacing, touch-friendly
        const playBtnY = langPanelY + langPanelHeight / 2 + Math.max(50, 70 * this.scaleFactor);
        const playBtnHeight = this.isMobile ? Math.max(60, 75 * this.scaleFactor) : Math.max(65, 80 * this.scaleFactor);
        const playBtnWidth = this.isMobile ? Math.max(280, 320 * this.scaleFactor) : Math.max(240, 300 * this.scaleFactor);
        const playBtn = GraphicsHelper.createButton(this, width / 2, playBtnY, playBtnWidth, playBtnHeight, 0x27AE60, TranslationManager.t('play'), Math.max(28, 36 * this.scaleFactor));
        playBtn.button.on('pointerdown', () => this.startGame());

        // Level selection (if levels are unlocked, responsive) - positioned below play button
        if (typeof gameState !== 'undefined' && gameState.unlockedLevels && gameState.unlockedLevels.length > 1) {
            const levelLabelY = playBtnY + playBtnHeight / 2 + Math.max(40, 50 * this.scaleFactor);
            const levelLabel = GraphicsHelper.createStyledText(this, width / 2, levelLabelY, TranslationManager.t('level') + ':', {
                fontSize: Math.max(18, 22 * this.scaleFactor) + 'px',
                color: '#FFFFFF'
            });

            const levelButtonsY = levelLabelY + Math.max(30, 40 * this.scaleFactor);
            const levelSpacing = Math.max(45, 55 * this.scaleFactor);
            const maxLevelsToShow = 10;
            const levelStartX = width / 2 - (Math.min(maxLevelsToShow, gameState.unlockedLevels.length) - 1) * levelSpacing / 2;
            const levelBtnSize = Math.max(22, 28 * this.scaleFactor);

            (gameState.unlockedLevels || []).slice(0, maxLevelsToShow).forEach((levelId, index) => {
                const x = levelStartX + index * levelSpacing;

                // Level button shadow
                const shadow = this.add.circle(x + 2, levelButtonsY + 2, levelBtnSize, 0x000000, 0.3);

                const levelButton = this.add.circle(x, levelButtonsY, levelBtnSize, 0x3498DB)
                    .setInteractive({ useHandCursor: !this.isMobile })
                    .setStrokeStyle(Math.max(2, 3 * this.scaleFactor), 0xFFFFFF, 0.9)
                    .setDepth(102)
                    .on('pointerdown', () => this.startLevel(levelId))
                    .on('pointerover', function () {
                        this.setFillStyle(0x2980B9);
                        shadow.setAlpha(0.5);
                    })
                    .on('pointerout', function () {
                        this.setFillStyle(0x3498DB);
                        shadow.setAlpha(0.3);
                    });

                const levelText = this.add.text(x, levelButtonsY, levelId.toString(), {
                    fontSize: Math.max(16, 20 * this.scaleFactor) + 'px',
                    color: '#FFFFFF',
                    fontStyle: 'bold'
                })
                    .setOrigin(0.5)
                    .setDepth(103)
                    .setInteractive(false);
            });
        }

        // Replay intro button (responsive) - positioned at bottom with spacing
        const replayBtnHeight = Math.max(45, 55 * this.scaleFactor);
        const replayBtnY = height - Math.max(80, 100 * this.scaleFactor);
        const replayBtn = GraphicsHelper.createButton(this, width / 2, replayBtnY, Math.max(180, 220 * this.scaleFactor), replayBtnHeight, 0x7F8C8D, TranslationManager.t('introTitle'), Math.max(14, 18 * this.scaleFactor));
        replayBtn.button.on('pointerdown', () => this.replayIntro());
    }

    createDecorativeElements() {
        const { width, height } = this.cameras.main;

        // Add character previews (responsive) - positioned above replay button
        const characters = getAllCharactersInOrder();
        const charSpacing = Math.max(40, 50 * this.scaleFactor);
        const charStartX = width / 2 - (characters.length - 1) * charSpacing / 2;
        const charSize = Math.max(30, 40 * this.scaleFactor);
        const charY = height - Math.max(140, 170 * this.scaleFactor);
        characters.forEach((char, index) => {
            const x = charStartX + index * charSpacing;
            const charGroup = GraphicsHelper.createCharacterSprite(this, x, charY, char, charSize);

            // Gentle float animation
            this.tweens.add({
                targets: [charGroup.body, charGroup.icon, charGroup.border],
                y: y - 5,
                duration: 2000 + index * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    selectLanguage(langCode) {
        if (typeof gameState !== 'undefined') {
            gameState.setLanguage(langCode);
        }
        this.scene.restart();
    }

    startGame() {
        const levelToStart = (typeof gameState !== 'undefined' && gameState.currentLevel) ? gameState.currentLevel : 1;
        this.startLevel(levelToStart);
    }

    startLevel(levelId) {
        if (typeof gameState !== 'undefined') {
            gameState.currentLevel = levelId;
            gameState.save();
        }
        this.scene.start('LevelScene', { levelId: levelId });
    }

    replayIntro() {
        this.scene.start('IntroScene');
    }
}

