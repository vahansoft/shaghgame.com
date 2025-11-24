// Graphics Helper - Utility functions for creating attractive visuals
const GraphicsHelper = {
    // Create a styled button - redesigned for mobile compatibility
    createButton(scene, x, y, width, height, color, text, fontSize = 20) {
        // Detect mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        (typeof window !== 'undefined' && window.innerWidth <= 768);
        
        // Ensure minimum touch target size (44x44px recommended for mobile)
        const finalWidth = Math.max(width, isMobile ? 44 : 30);
        const finalHeight = Math.max(height, isMobile ? 44 : 30);
        
        // Button shadow (non-interactive, behind everything)
        const shadow = scene.add.rectangle(x + 3, y + 3, finalWidth, finalHeight, 0x000000, 0.3)
            .setDepth(1)
            .setInteractive(false);
        
        // Button background - this is the interactive element
        const button = scene.add.rectangle(x, y, finalWidth, finalHeight, color)
            .setStrokeStyle(3, 0xFFFFFF, 0.8)
            .setDepth(1000); // High depth to be on top
        
        // Set explicit hit area for better touch detection
        button.setInteractive(new Phaser.Geom.Rectangle(-finalWidth/2, -finalHeight/2, finalWidth, finalHeight), Phaser.Geom.Rectangle.Contains);
        
        // Button text (non-interactive, on top of button)
        const buttonText = scene.add.text(x, y, text, {
            fontSize: fontSize + 'px',
            color: '#FFFFFF',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        })
        .setOrigin(0.5)
        .setDepth(1001)
        .setInteractive(false); // Text should not block clicks
        
        // Hover effects (only on desktop)
        if (!isMobile) {
            button.on('pointerover', function() {
                this.setFillStyle(Phaser.Display.Color.ValueToColor(color).brighten(20).color);
                shadow.setAlpha(0.5);
            });
            
            button.on('pointerout', function() {
                this.setFillStyle(color);
                shadow.setAlpha(0.3);
            });
        }
        
        // Visual feedback on touch/click
        button.on('pointerdown', function() {
            this.setScale(0.95);
        });
        
        button.on('pointerup', function() {
            this.setScale(1.0);
        });
        
        return { button, buttonText, shadow };
    },
    
    // Create a styled character sprite
    createCharacterSprite(scene, x, y, character, size = 50) {
        // Shadow
        const shadow = scene.add.ellipse(x + 2, y + size/2 + 2, size * 0.8, size * 0.3, 0x000000, 0.3);
        
        // Character body (gradient effect using multiple circles)
        const body = scene.add.circle(x, y, size * 0.45, character.color);
        const highlight = scene.add.circle(x - size * 0.15, y - size * 0.15, size * 0.2, 0xFFFFFF, 0.4);
        
        // Character icon
        const icon = scene.add.text(x, y, character.icon, {
            fontSize: (size * 0.6) + 'px'
        }).setOrigin(0.5);
        
        // Border
        const border = scene.add.circle(x, y, size * 0.45, 0x000000, 0)
            .setStrokeStyle(3, 0xFFFFFF, 0.8);
        
        return { body, highlight, icon, border, shadow };
    },
    
    // Create a styled turnip
    createTurnip(scene, x, y, width, height, scale = 1) {
        // Turnip shadow
        const shadow = scene.add.ellipse(x + 3, y + height/2 + 3, width * 0.9, height * 0.3, 0x000000, 0.4);
        
        // Turnip body (gradient)
        const turnipBody = scene.add.ellipse(x, y, width, height, 0xFFD700);
        const turnipHighlight = scene.add.ellipse(x - width * 0.2, y - height * 0.2, width * 0.5, height * 0.5, 0xFFFF99, 0.6);
        
        // Turnip leaves
        const leaves = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i - 1) * 0.5;
            const leafX = x + Math.sin(angle) * width * 0.3;
            const leafY = y - height * 0.6;
            const leaf = scene.add.ellipse(leafX, leafY, width * 0.3, height * 0.4, 0x90EE90);
            leaves.push(leaf);
        }
        
        // Border
        const border = scene.add.ellipse(x, y, width, height, 0x000000, 0)
            .setStrokeStyle(2, 0x8B6914, 0.8);
        
        if (scale !== 1) {
            turnipBody.setScale(scale);
            turnipHighlight.setScale(scale);
            border.setScale(scale);
            shadow.setScale(scale);
            leaves.forEach(leaf => leaf.setScale(scale));
        }
        
        return { turnipBody, turnipHighlight, leaves, border, shadow };
    },
    
    // Create gradient background
    createGradientBackground(scene, color1, color2, direction = 'vertical') {
        const { width, height } = scene.cameras.main;
        const graphics = scene.add.graphics();
        
        if (direction === 'vertical') {
            graphics.fillGradientStyle(color1, color1, color2, color2, 1);
            graphics.fillRect(0, 0, width, height);
        } else {
            graphics.fillGradientStyle(color1, color2, color1, color2, 1);
            graphics.fillRect(0, 0, width, height);
        }
        
        return graphics;
    },
    
    // Create styled text with shadow
    createStyledText(scene, x, y, text, style = {}) {
        const defaultStyle = {
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        };
        
        const finalStyle = Object.assign({}, defaultStyle, style);
        const origin = style.origin || 0.5;
        
        // Extract origin from style to avoid passing it to text
        delete finalStyle.origin;
        
        // Text shadow
        const shadow = scene.add.text(x + 2, y + 2, text, {
            ...finalStyle,
            color: '#000000',
            alpha: 0.5
        })
        .setOrigin(origin)
        .setInteractive(false); // Non-interactive so clicks pass through
        
        // Main text
        const mainText = scene.add.text(x, y, text, finalStyle)
        .setOrigin(origin)
        .setInteractive(false); // Non-interactive so clicks pass through
        
        return { mainText, shadow };
    },
    
    // Create a card/panel
    createPanel(scene, x, y, width, height, color, alpha = 0.9) {
        // Panel shadow
        const shadow = scene.add.rectangle(x + 4, y + 4, width, height, 0x000000, 0.3)
            .setDepth(99)
            .setInteractive(false);
        
        // Panel
        const panel = scene.add.rectangle(x, y, width, height, color, alpha)
            .setStrokeStyle(2, 0xFFFFFF, 0.8)
            .setDepth(100)
            .setInteractive(false);
        
        return { panel, shadow };
    }
};

