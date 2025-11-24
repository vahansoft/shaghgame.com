// Character definitions with capabilities
const characters = {
    grandfather: {
        id: 'grandfather',
        order: 1,
        strength: 1,
        ability: 'leader',
        color: 0x8B4513, // Brown
        icon: '👴',
        get name() {
            return TranslationManager.t('character_grandfather');
        },
        get abilityDesc() {
            return TranslationManager.t('ability_leader');
        }
    },
    grandmother: {
        id: 'grandmother',
        order: 2,
        strength: 2,
        ability: 'support',
        color: 0xFF69B4, // Pink
        icon: '👵',
        get name() {
            return TranslationManager.t('character_grandmother');
        },
        get abilityDesc() {
            return TranslationManager.t('ability_support');
        }
    },
    grandchild: {
        id: 'grandchild',
        order: 3,
        strength: 1,
        ability: 'flexible',
        color: 0x00CED1, // Turquoise
        icon: '🧒',
        get name() {
            return TranslationManager.t('character_grandchild');
        },
        get abilityDesc() {
            return TranslationManager.t('ability_flexible');
        }
    },
    dog: {
        id: 'dog',
        order: 4,
        strength: 2,
        ability: 'dig',
        color: 0x8B4513, // Brown
        icon: '🐕',
        get name() {
            return TranslationManager.t('character_dog');
        },
        get abilityDesc() {
            return TranslationManager.t('ability_dig');
        }
    },
    cat: {
        id: 'cat',
        order: 5,
        strength: 1,
        ability: 'climb',
        color: 0xFFA500, // Orange
        icon: '🐱',
        get name() {
            return TranslationManager.t('character_cat');
        },
        get abilityDesc() {
            return TranslationManager.t('ability_climb');
        }
    },
    mouse: {
        id: 'mouse',
        order: 6,
        strength: 1,
        ability: 'small',
        color: 0x808080, // Gray
        icon: '🐭',
        get name() {
            return TranslationManager.t('character_mouse');
        },
        get abilityDesc() {
            return TranslationManager.t('ability_small');
        }
    }
};

// Helper function to get character by ID
function getCharacter(id) {
    return characters[id];
}

// Helper function to get all characters in order
function getAllCharactersInOrder() {
    return Object.values(characters).sort((a, b) => a.order - b.order);
}

