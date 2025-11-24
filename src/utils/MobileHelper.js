// Mobile Helper - Utilities for mobile device detection and optimization
const MobileHelper = {
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (typeof window !== 'undefined' && window.innerWidth <= 768);
    },
    
    // Create a simple, reliable button that works on all devices
    createSimpleButton(scene, x, y, width, height, color, text, fontSize, callback) {
        const isMobile = this.isMobile();
        
        // Ensure minimum touch target
        const finalWidth = Math.max(width, isMobile ? 44 : 30);
        const finalHeight = Math.max(height, isMobile ? 44 : 30);
        
        // Create button group
        const buttonGroup = scene.add.container(x, y);
        buttonGroup.setDepth(1000);
        
        // Shadow
        const shadow = scene.add.rectangle(3, 3, finalWidth, finalHeight, 0x000000, 0.3);
        shadow.setDepth(999);
        buttonGroup.add(shadow);
        
        // Button background - this is the interactive element
        const button = scene.add.rectangle(0, 0, finalWidth, finalHeight, color);
        button.setStrokeStyle(3, 0xFFFFFF, 0.8);
        button.setDepth(1000);
        
        // Make button interactive with explicit hit area
        button.setInteractive(
            new Phaser.Geom.Rectangle(-finalWidth/2, -finalHeight/2, finalWidth, finalHeight),
            Phaser.Geom.Rectangle.Contains
        );
        
        // Button text
        const buttonText = scene.add.text(0, 0, text, {
            fontSize: fontSize + 'px',
            color: '#FFFFFF',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        buttonText.setOrigin(0.5);
        buttonText.setDepth(1001);
        buttonText.setInteractive(false);
        
        buttonGroup.add(button);
        buttonGroup.add(buttonText);
        
        // Add click handler - use both pointerdown and pointerup for reliability
        button.on('pointerdown', function() {
            this.setScale(0.95);
            if (callback) {
                // Use setTimeout to ensure visual feedback is seen
                setTimeout(() => {
                    callback();
                }, 50);
            }
        });
        
        button.on('pointerup', function() {
            this.setScale(1.0);
        });
        
        // Hover effects only on desktop
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
        
        return { button, buttonText, shadow, container: buttonGroup };
    }
};

