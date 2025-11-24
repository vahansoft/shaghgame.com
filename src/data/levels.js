// Level configurations
const levels = [
    {
        id: 1,
        sourceType: 'ground',
        requiredCharacters: ['grandfather', 'grandmother'],
        placementMechanic: 'drag-drop',
        turnipStrength: 3,
        get title() {
            return TranslationManager.t('level1_title');
        },
        get description() {
            return TranslationManager.t('level1_desc');
        }
    },
    {
        id: 2,
        sourceType: 'ground',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild'],
        placementMechanic: 'drag-drop',
        turnipStrength: 5,
        get title() {
            return TranslationManager.t('level2_title');
        },
        get description() {
            return TranslationManager.t('level2_desc');
        }
    },
    {
        id: 3,
        sourceType: 'ground',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog'],
        placementMechanic: 'drag-drop',
        turnipStrength: 7,
        get title() {
            return TranslationManager.t('level3_title');
        },
        get description() {
            return TranslationManager.t('level3_desc');
        }
    },
    {
        id: 4,
        sourceType: 'bottle',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog', 'cat'],
        placementMechanic: 'click-place',
        turnipStrength: 8,
        requiresAbility: 'climb',
        get title() {
            return TranslationManager.t('level4_title');
        },
        get description() {
            return TranslationManager.t('level4_desc');
        }
    },
    {
        id: 5,
        sourceType: 'high',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog', 'cat'],
        placementMechanic: 'click-place',
        turnipStrength: 9,
        requiresAbility: 'climb',
        get title() {
            return TranslationManager.t('level5_title');
        },
        get description() {
            return TranslationManager.t('level5_desc');
        }
    },
    {
        id: 6,
        sourceType: 'spotlight',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog', 'cat'],
        placementMechanic: 'hybrid',
        turnipStrength: 10,
        get title() {
            return TranslationManager.t('level6_title');
        },
        get description() {
            return TranslationManager.t('level6_desc');
        }
    },
    {
        id: 7,
        sourceType: 'narrow',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog', 'cat', 'mouse'],
        placementMechanic: 'click-place',
        turnipStrength: 11,
        requiresAbility: 'small',
        get title() {
            return TranslationManager.t('level7_title');
        },
        get description() {
            return TranslationManager.t('level7_desc');
        }
    },
    {
        id: 8,
        sourceType: 'deep-ground',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog', 'cat', 'mouse'],
        placementMechanic: 'hybrid',
        turnipStrength: 12,
        requiresAbility: 'dig',
        get title() {
            return TranslationManager.t('level8_title');
        },
        get description() {
            return TranslationManager.t('level8_desc');
        }
    },
    {
        id: 9,
        sourceType: 'complex',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog', 'cat', 'mouse'],
        placementMechanic: 'hybrid',
        turnipStrength: 13,
        get title() {
            return TranslationManager.t('level9_title');
        },
        get description() {
            return TranslationManager.t('level9_desc');
        }
    },
    {
        id: 10,
        sourceType: 'ground',
        requiredCharacters: ['grandfather', 'grandmother', 'grandchild', 'dog', 'cat', 'mouse'],
        placementMechanic: 'drag-drop',
        turnipStrength: 15,
        isFinal: true,
        get title() {
            return TranslationManager.t('level10_title');
        },
        get description() {
            return TranslationManager.t('level10_desc');
        }
    }
];

// Helper function to get level by ID
function getLevel(id) {
    return levels.find(level => level.id === id);
}

