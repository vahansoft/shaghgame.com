// Level Scene - Main gameplay
class LevelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelScene' });
    }

    init(data) {
        this.levelId = data.levelId || 1;
        this.level = getLevel(this.levelId);
        this.placedCharacters = [];
        this.draggedCharacter = null;
        this.turnipScale = 0.8 + (this.level.id * 0.05);
        // Calculate required strength based on turnip size
        // Base strength = 3, increases with turnip size
        this.requiredStrength = Math.ceil(3 + (this.turnipScale - 0.8) * 20);
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Calculate responsive sizes - more aggressive scaling for mobile
        if (this.isMobile) {
            this.scaleFactor = Math.min(width / 1024, height / 768) * 0.9;
            // Ensure minimum touch target size (44px recommended)
            this.minTouchSize = 44;
        } else {
            this.scaleFactor = Math.min(width / 1024, height / 768);
            this.minTouchSize = 35;
        }
        this.baseFontSize = Math.max(14, 18 * this.scaleFactor);
        
        // Beautiful gradient background based on level (draw first)
        const bgColors = [
            [0x90EE90, 0xB0F5B0], // Level 1-3: Light green
            [0x87CEEB, 0xB0E0E6], // Level 4-6: Sky blue
            [0xDDA0DD, 0xEE82EE], // Level 7-9: Plum
            [0xFFD700, 0xFFE55C]  // Level 10: Gold
        ];
        const bgIndex = Math.min(Math.floor((this.level.id - 1) / 3), 3);
        const bg = GraphicsHelper.createGradientBackground(this, bgColors[bgIndex][0], bgColors[bgIndex][1]);
        bg.setDepth(0);
        
        // Level info panel (responsive)
        const panelPadding = 20 * this.scaleFactor;
        const panelHeight = Math.max(80, 100 * this.scaleFactor);
        const infoPanel = GraphicsHelper.createPanel(this, panelPadding, panelPadding, width - panelPadding * 2, panelHeight, 0xFFFFFF, 0.95);
        
        const titleStyle = GraphicsHelper.createStyledText(this, panelPadding * 1.5, panelPadding + panelHeight * 0.2, this.level.title, {
            fontSize: Math.max(24, 32 * this.scaleFactor) + 'px',
            color: '#2C3E50',
            origin: { x: 0, y: 0.5 }
        });
        
        const descText = this.add.text(panelPadding * 1.5, panelPadding + panelHeight * 0.6, this.level.description, {
            fontSize: Math.max(14, 18 * this.scaleFactor) + 'px',
            color: '#34495E',
            wordWrap: { width: width - panelPadding * 4 }
        });
        
        // Menu button (touch-friendly size on mobile)
        const menuBtnSize = this.isMobile ? Math.max(120, 140 * this.scaleFactor) : Math.max(100, 120 * this.scaleFactor);
        const menuBtnHeight = this.isMobile ? Math.max(44, 50 * this.scaleFactor) : Math.max(35, 45 * this.scaleFactor);
        const menuBtn = GraphicsHelper.createButton(this, width - menuBtnSize / 2 - panelPadding, panelPadding + panelHeight / 2, menuBtnSize, menuBtnHeight, 0x7F8C8D, TranslationManager.t('menu'), Math.max(14, 18 * this.scaleFactor));
        menuBtn.button.on('pointerdown', () => this.goToMenu());
        
        // Character pool area (responsive)
        this.characterPoolY = panelPadding + panelHeight + Math.max(30, 50 * this.scaleFactor);
        this.createCharacterPool();
        
        // Placement area (responsive)
        this.placementAreaY = height * 0.55;
        this.createPlacementArea();
        
        // Turnip and source
        this.createTurnipSource();
        
        // UI elements
        this.createUI();
        
        // Setup placement mechanics based on level
        this.setupPlacementMechanic();
    }
    
    createCharacterPool() {
        const { width } = this.cameras.main;
        const poolSpacing = Math.max(70, 85 * this.scaleFactor);
        const charSize = Math.max(45, 55 * this.scaleFactor);
        
        // Get all characters in order
        const allCharacters = getAllCharactersInOrder();
        
        // Calculate pool width and start position
        const poolWidth = allCharacters.length * poolSpacing + Math.max(30, 40 * this.scaleFactor);
        const poolStartX = (width - poolWidth) / 2 + poolSpacing / 2;
        
        // Pool background panel
        const poolPanel = GraphicsHelper.createPanel(this, width / 2, this.characterPoolY + Math.max(5, 10 * this.scaleFactor), 
            poolWidth, Math.max(100, 120 * this.scaleFactor), 0xFFFFFF, 0.9);
        
        this.characterPool = [];
        this.characterGroups = [];
        
        allCharacters.forEach((char, index) => {
            const x = poolStartX + index * poolSpacing;
            const y = this.characterPoolY;
            
            // Create styled character sprite (responsive size, ensure touch-friendly on mobile)
            const charGroup = GraphicsHelper.createCharacterSprite(this, x, y, char, charSize);
            const charSprite = charGroup.body;
            
            // Make interactive with larger hit area for mobile
            const hitArea = new Phaser.Geom.Circle(0, 0, Math.max(charSize, this.minTouchSize));
            charSprite.setInteractive(hitArea, Phaser.Geom.Circle.Contains)
                .setData('character', char)
                .setData('isInPool', true)
                .setData('charGroup', charGroup);
            
            // Enable dragging
            this.input.setDraggable(charSprite);
            
            const nameText = this.add.text(x, y + charSize * 0.9, char.name, {
                fontSize: Math.max(12, 14 * this.scaleFactor) + 'px',
                color: '#2C3E50',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Strength indicator
            const strengthText = this.add.text(x, y - charSize * 0.7, '⚡' + char.strength, {
                fontSize: Math.max(14, 16 * this.scaleFactor) + 'px',
                color: '#E74C3C',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.characterPool.push({
                sprite: charSprite,
                character: char,
                nameText: nameText,
                strengthText: strengthText,
                charGroup: charGroup,
                used: false
            });
            
            this.characterGroups.push(charGroup);
        });
        
        // Drag events (works for both mouse and touch)
        this.input.on('dragstart', (pointer, gameObject) => {
            if (this.level.placementMechanic === 'drag-drop' || this.level.placementMechanic === 'hybrid') {
                this.draggedCharacter = gameObject;
                const charGroup = gameObject.getData('charGroup');
                if (charGroup) {
                    Object.values(charGroup).forEach(item => {
                        if (item) item.setAlpha(0.7);
                    });
                }
                gameObject.setScale(1.2);
            }
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.draggedCharacter === gameObject) {
                const charGroup = gameObject.getData('charGroup');
                if (charGroup) {
                    const offsetX = dragX - gameObject.x;
                    const offsetY = dragY - gameObject.y;
                    Object.values(charGroup).forEach(item => {
                        if (item && item !== gameObject) {
                            item.x += offsetX;
                            item.y += offsetY;
                        }
                    });
                }
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            if (this.draggedCharacter === gameObject) {
                const charGroup = gameObject.getData('charGroup');
                if (charGroup) {
                    Object.values(charGroup).forEach(item => {
                        if (item) item.setAlpha(1);
                    });
                }
                gameObject.setScale(1);
                this.handleCharacterDrop(gameObject);
                this.draggedCharacter = null;
            }
        });
    }
    
    createPlacementArea() {
        const { width } = this.cameras.main;
        // Show slots for all 6 characters
        const allCharacters = getAllCharactersInOrder();
        const placementSpacing = Math.max(60, 70 * this.scaleFactor);
        const placementStartX = width / 2 - (allCharacters.length - 1) * placementSpacing / 2;
        const slotSize = Math.max(35, 40 * this.scaleFactor);
        
        // Connection line
        const lineGraphics = this.add.graphics();
        lineGraphics.lineStyle(Math.max(3, 4 * this.scaleFactor), 0x34495E, 0.5);
        lineGraphics.beginPath();
        lineGraphics.moveTo(placementStartX - slotSize, this.placementAreaY);
        lineGraphics.lineTo(placementStartX + (allCharacters.length - 1) * placementSpacing + slotSize, this.placementAreaY);
        lineGraphics.strokePath();
        
        this.placementSlots = [];
        allCharacters.forEach((char, index) => {
            const x = placementStartX + index * placementSpacing;
            const y = this.placementAreaY;
            
            // Slot shadow
            const shadow = this.add.circle(x + 2, y + 2, slotSize, 0x000000, 0.2);
            
            // Slot with gradient effect - larger hit area for mobile
            const slotHitSize = Math.max(slotSize, this.minTouchSize);
            const slot = this.add.circle(x, y, slotSize, 0xECF0F1, 0.8)
                .setStrokeStyle(Math.max(2, 3 * this.scaleFactor), 0xBDC3C7, 1)
                .setInteractive(new Phaser.Geom.Circle(0, 0, slotHitSize), Phaser.Geom.Circle.Contains);
            
            // Slot number
            const slotNumber = this.add.text(x, y, (index + 1).toString(), {
                fontSize: Math.max(16, 20 * this.scaleFactor) + 'px',
                color: '#95A5A6',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.placementSlots.push({
                x: x,
                y: y,
                slot: slot,
                shadow: shadow,
                slotNumber: slotNumber,
                character: null,
                sprite: null,
                charGroup: null,
                expectedCharId: char.id
            });
        });
    }
    
    createTurnipSource() {
        const { width, height } = this.cameras.main;
        const sourceX = width / 2;
        const sourceY = height - 150;
        
        // Draw source based on type
        switch (this.level.sourceType) {
            case 'ground':
                // Ground with texture
                this.add.rectangle(sourceX, height - 30, width, 100, 0x8B4513);
                const grass = this.add.graphics();
                grass.fillStyle(0x228B22, 0.6);
                for (let i = 0; i < width; i += 20) {
                    grass.fillRect(i, height - 100, 15, 5 + Math.random() * 10);
                }
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY, 60, 80);
                break;
            case 'bottle':
                // Styled bottle
                const bottleShadow = this.add.ellipse(sourceX + 2, sourceY + 50, 45, 10, 0x000000, 0.3);
                const bottle = this.add.rectangle(sourceX, sourceY + 30, 40, 80, 0x87CEEB)
                    .setStrokeStyle(3, 0x4682B4, 1);
                const bottleNeck = this.add.rectangle(sourceX, sourceY - 10, 20, 20, 0x87CEEB)
                    .setStrokeStyle(2, 0x4682B4, 1);
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY, 30, 40);
                break;
            case 'high':
                // Platform
                const platform = this.add.rectangle(sourceX, sourceY - 50, 200, 25, 0x8B4513)
                    .setStrokeStyle(3, 0x654321, 1);
                const platformShadow = this.add.rectangle(sourceX + 3, sourceY - 47, 200, 25, 0x000000, 0.2);
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY - 80, 50, 70);
                break;
            case 'spotlight':
                // Spotlight effect
                const spotlight = this.add.graphics();
                spotlight.fillGradientStyle(0xFFFF00, 0xFFFF00, 0xFFFFFF, 0xFFFFFF, 0.3);
                spotlight.fillCircle(sourceX, sourceY - 100, 100);
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY, 55, 75);
                break;
            case 'narrow':
                // Narrow passage
                const passage = this.add.rectangle(sourceX, sourceY, 30, 100, 0x654321)
                    .setStrokeStyle(3, 0x3E2723, 1);
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY, 25, 35);
                break;
            case 'deep-ground':
                // Deep ground
                this.add.rectangle(sourceX, height - 30, width, 100, 0x654321);
                const deepGrass = this.add.graphics();
                deepGrass.fillStyle(0x2E7D32, 0.5);
                for (let i = 0; i < width; i += 25) {
                    deepGrass.fillRect(i, height - 100, 18, 8 + Math.random() * 12);
                }
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY - 30, 50, 70);
                break;
            case 'complex':
                // Complex structure
                const structure = this.add.rectangle(sourceX, sourceY, 100, 100, 0x808080)
                    .setStrokeStyle(4, 0x555555, 1);
                const structureShadow = this.add.rectangle(sourceX + 3, sourceY + 3, 100, 100, 0x000000, 0.3);
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY, 60, 80);
                break;
            default:
                this.turnipGroup = GraphicsHelper.createTurnip(this, sourceX, sourceY, 60, 80);
        }
        
        this.turnip = this.turnipGroup.turnipBody;
        
        // Scale turnip based on level (already calculated in init)
        Object.values(this.turnipGroup).forEach(item => {
            if (item && Array.isArray(item) === false) {
                item.setScale(this.turnipScale);
            } else if (Array.isArray(item)) {
                item.forEach(subItem => subItem.setScale(this.turnipScale));
            }
        });
    }
    
    createUI() {
        const { width, height } = this.cameras.main;
        
        // Strength display panel (only show current strength, not required) - responsive
        const strengthPanelY = height - Math.max(200, 280 * this.scaleFactor);
        const strengthPanel = GraphicsHelper.createPanel(this, width / 2, strengthPanelY, Math.max(250, 300 * this.scaleFactor), Math.max(50, 60 * this.scaleFactor), 0xFFFFFF, 0.95);
        
        this.strengthText = this.add.text(width / 2, strengthPanelY, '', {
            fontSize: Math.max(20, 26 * this.scaleFactor) + 'px',
            color: '#2C3E50',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.updateStrengthDisplay();
        
        // Pull button (responsive, touch-friendly on mobile)
        const pullBtnY = height - Math.max(150, 200 * this.scaleFactor);
        const pullBtnWidth = this.isMobile ? Math.max(250, 300 * this.scaleFactor) : Math.max(200, 250 * this.scaleFactor);
        const pullBtnHeight = this.isMobile ? Math.max(60, 75 * this.scaleFactor) : Math.max(55, 70 * this.scaleFactor);
        const pullBtn = GraphicsHelper.createButton(this, width / 2, pullBtnY, pullBtnWidth, pullBtnHeight, 0xE74C3C, TranslationManager.t('pullTurnip'), Math.max(22, 28 * this.scaleFactor));
        pullBtn.button.on('pointerdown', () => this.attemptPull());
        
        // Pulse animation for pull button
        this.tweens.add({
            targets: pullBtn.button,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    setupPlacementMechanic() {
        if (this.level.placementMechanic === 'click-place' || this.level.placementMechanic === 'hybrid') {
            // Add click/touch handlers to slots
            this.placementSlots.forEach((slot, index) => {
                slot.slot.setInteractive({ useHandCursor: !this.isMobile })
                    .on('pointerdown', () => this.handleSlotClick(index));
            });
            
            // Add click/touch handlers to character pool
            this.characterPool.forEach(poolItem => {
                if (!poolItem.used) {
                    poolItem.sprite.on('pointerdown', () => {
                        this.selectedCharacter = poolItem.character;
                        this.selectedPoolItem = poolItem;
                        // Highlight selected
                        this.characterPool.forEach(p => {
                            if (p === poolItem) {
                                p.sprite.setStrokeStyle(3, 0xFFFF00);
                            } else {
                                p.sprite.setStrokeStyle(0);
                            }
                        });
                    });
                }
            });
        }
    }
    
    handleSlotClick(slotIndex) {
        if (this.selectedCharacter && this.placementSlots[slotIndex].character === null) {
            // Check if character can be placed in this slot (must be in correct order)
            const slot = this.placementSlots[slotIndex];
            if (this.selectedCharacter.id === slot.expectedCharId) {
                this.placeCharacterInSlot(slotIndex, this.selectedCharacter);
                // Mark pool item as used
                if (this.selectedPoolItem) {
                    this.selectedPoolItem.used = true;
                    // Hide all character group elements
                    if (this.selectedPoolItem.charGroup) {
                        Object.values(this.selectedPoolItem.charGroup).forEach(item => {
                            if (item) item.setVisible(false);
                        });
                    }
                    this.selectedPoolItem.sprite.setVisible(false);
                    this.selectedPoolItem.nameText.setVisible(false);
                    if (this.selectedPoolItem.strengthText) this.selectedPoolItem.strengthText.setVisible(false);
                    this.selectedPoolItem.sprite.setStrokeStyle(0);
                }
                this.selectedCharacter = null;
                this.selectedPoolItem = null;
            } else {
                // Show error message
                this.showMessage(TranslationManager.t('placeCharacters'), 0xFF0000);
            }
        }
    }
    
    handleCharacterDrop(gameObject) {
        const char = gameObject.getData('character');
        const charGroup = gameObject.getData('charGroup');
        const dropX = gameObject.x;
        const dropY = gameObject.y;
        
        // Check if dropped on a slot (responsive distance, larger for mobile)
        let placed = false;
        const dropDistance = this.isMobile ? Math.max(60, 70 * this.scaleFactor) : Math.max(45, 50 * this.scaleFactor);
        this.placementSlots.forEach((slot, index) => {
            const distance = Phaser.Math.Distance.Between(dropX, dropY, slot.x, slot.y);
            if (distance < dropDistance && slot.character === null) {
                // Check if character can be placed in this slot (must be in correct order)
                if (char.id === slot.expectedCharId) {
                    this.placeCharacterInSlot(index, char);
                    // Remove from pool
                    const poolItem = this.characterPool.find(p => p.character.id === char.id && !p.used);
                    if (poolItem) {
                        poolItem.used = true;
                        // Hide all character group elements
                        if (poolItem.charGroup) {
                            Object.values(poolItem.charGroup).forEach(item => {
                                if (item) item.setVisible(false);
                            });
                        }
                        poolItem.sprite.setVisible(false);
                        poolItem.nameText.setVisible(false);
                        if (poolItem.strengthText) poolItem.strengthText.setVisible(false);
                    }
                    placed = true;
                    return;
                } else {
                    // Wrong character for this slot - must be in order
                    this.showMessage(TranslationManager.t('placeCharacters'), 0xFF0000);
                }
            }
        });
        
        // Return to original position if not placed
        if (!placed && gameObject.getData('isInPool')) {
            const poolItem = this.characterPool.find(p => p.sprite === gameObject && !p.used);
            if (poolItem) {
                const originalX = poolItem.sprite.x;
                const originalY = poolItem.sprite.y;
                gameObject.x = originalX;
                gameObject.y = originalY;
                // Return character group to original position
                if (charGroup) {
                    Object.values(charGroup).forEach(item => {
                        if (item && item !== gameObject) {
                            const offsetX = item.x - dropX;
                            const offsetY = item.y - dropY;
                            item.x = originalX + offsetX;
                            item.y = originalY + offsetY;
                        }
                    });
                }
            }
        }
    }
    
    placeCharacterInSlot(slotIndex, character) {
        const slot = this.placementSlots[slotIndex];
        slot.character = character;
        
        // Hide slot number
        slot.slotNumber.setVisible(false);
        
        // Create styled character sprite in slot (responsive size)
        const charSize = Math.max(50, 60 * this.scaleFactor);
        const charGroup = GraphicsHelper.createCharacterSprite(this, slot.x, slot.y, character, charSize);
        slot.sprite = charGroup.body;
        slot.charGroup = charGroup;
        
        // Success animation
        this.tweens.add({
            targets: Object.values(charGroup),
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
        
        this.placedCharacters[slotIndex] = character;
        this.updateStrengthDisplay();
    }
    
    updateStrengthDisplay() {
        const totalStrength = this.calculateTotalStrength();
        
        // Only show current strength, not required
        this.strengthText.setText(
            `${TranslationManager.t('totalStrength')}: ${totalStrength}`
        );
        
        // Color based on whether it might be enough (green if high enough, red if low)
        this.strengthText.setColor(totalStrength >= this.requiredStrength ? '#27AE60' : '#E74C3C');
    }
    
    calculateTotalStrength() {
        let total = 0;
        let hasSupport = false;
        
        this.placedCharacters.forEach((char, index) => {
            if (char) {
                total += char.strength;
                
                // Check for support ability (boosts adjacent)
                if (char.ability === 'support') {
                    hasSupport = true;
                }
                
                // Apply support bonus
                if (hasSupport && index > 0 && this.placedCharacters[index - 1]) {
                    total += 0.5; // Small bonus
                }
            }
        });
        
        return Math.floor(total);
    }
    
    attemptPull() {
        const totalStrength = this.calculateTotalStrength();
        
        // Check if characters are placed (at least some)
        const placedCount = this.placedCharacters.filter(c => c !== null).length;
        
        if (placedCount === 0) {
            this.showMessage(TranslationManager.t('placeCharacters'), 0xFF0000);
            return;
        }
        
        // Animate characters pulling
        this.placementSlots.forEach((slot, index) => {
            if (slot.charGroup) {
                this.tweens.add({
                    targets: Object.values(slot.charGroup),
                    x: slot.x - 5,
                    duration: 200,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Power2'
                });
            }
        });
        
        // Animate turnip being pulled
        const turnipTargets = [this.turnip, this.turnipGroup.turnipHighlight, this.turnipGroup.border];
        if (this.turnipGroup.leaves) {
            turnipTargets.push(...this.turnipGroup.leaves);
        }
        
        this.tweens.add({
            targets: turnipTargets,
            x: this.turnip.x - 25,
            duration: 400,
            yoyo: true,
            repeat: 2,
            ease: 'Power2',
            onComplete: () => {
                if (totalStrength >= this.requiredStrength) {
                    this.levelComplete();
                } else {
                    this.showMessage(TranslationManager.t('levelFailed'), 0xFF0000);
                }
            }
        });
    }
    
    showMessage(text, color) {
        const { width, height } = this.cameras.main;
        const message = this.add.text(width / 2, height / 2, text, {
            fontSize: '32px',
            color: Phaser.Display.Color.IntegerToColor(color).rgba,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 2000,
            onComplete: () => message.destroy()
        });
    }
    
    levelComplete() {
        this.showMessage(TranslationManager.t('levelComplete'), 0x00FF00);
        
        // Animate turnip being pulled with all elements
        const turnipTargets = [this.turnip, this.turnipGroup.turnipHighlight, this.turnipGroup.border, this.turnipGroup.shadow];
        if (this.turnipGroup.leaves) {
            turnipTargets.push(...this.turnipGroup.leaves);
        }
        
        // Celebration particles
        for (let i = 0; i < 10; i++) {
            const particle = this.add.circle(
                this.turnip.x + (Math.random() - 0.5) * 100,
                this.turnip.y + (Math.random() - 0.5) * 100,
                5 + Math.random() * 5,
                0xFFD700
            );
            this.tweens.add({
                targets: particle,
                x: particle.x + (Math.random() - 0.5) * 200,
                y: particle.y - 100 - Math.random() * 100,
                alpha: 0,
                scale: 0,
                duration: 1000,
                ease: 'Power2'
            });
        }
        
        this.tweens.add({
            targets: turnipTargets,
            y: this.turnip.y - 250,
            alpha: 0,
            scale: 0.5,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => {
                // Unlock next level
                if (typeof gameState !== 'undefined' && this.level.id < 10) {
                    gameState.unlockLevel(this.level.id + 1);
                }
                
                // Go to next level or game over
                this.time.delayedCall(1000, () => {
                    if (this.level.isFinal) {
                        this.scene.start('GameOverScene');
                    } else {
                        this.scene.start('LevelScene', { levelId: this.level.id + 1 });
                    }
                });
            }
        });
    }
    
    goToMenu() {
        this.scene.start('MenuScene');
    }
}

