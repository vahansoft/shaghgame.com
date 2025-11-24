// Multilingual translations
const translations = {
    en: {
        // UI Elements
        play: 'Play',
        menu: 'Menu',
        nextLevel: 'Next Level',
        retry: 'Retry',
        skip: 'Skip',
        continue: 'Continue',
        selectLanguage: 'Select Language',
        level: 'Level',
        strength: 'Strength',
        ability: 'Ability',
        
        // Introduction Story
        introTitle: 'The Grandfather and the Turnip',
        introPart1: 'Once upon a time, the grandfather planted a turnip in front of his door.',
        introPart2: 'The turnip grew and grew, becoming bigger and bigger.',
        introPart3: 'When the grandfather saw it, he was amazed!',
        introPart4: 'He tried to pull it out, but the turnip wouldn\'t budge from the ground.',
        introPart5: 'The grandfather needs help! Can you help him gather everyone to pull the turnip?',
        
        // Character Names
        character_grandfather: 'Grandfather',
        character_grandmother: 'Grandmother',
        character_grandchild: 'Grandchild',
        character_dog: 'Dog',
        character_cat: 'Cat',
        character_mouse: 'Mouse',
        
        // Character Abilities
        ability_leader: 'Leader - Can start the chain',
        ability_support: 'Support - Boosts adjacent characters',
        ability_flexible: 'Flexible - Can fit in tight spaces',
        ability_dig: 'Dig - Can access ground sources',
        ability_climb: 'Climb - Can access high sources',
        ability_small: 'Small - Can access narrow spaces',
        
        // Game Messages
        levelComplete: 'Level Complete!',
        levelFailed: 'Not enough strength!',
        pullTurnip: 'Pull Turnip',
        placeCharacters: 'Place characters in order',
        totalStrength: 'Total Strength',
        requiredStrength: 'Required',
        success: 'Success!',
        failure: 'Try again!',
        allCharactersNeeded: 'All characters are needed!',
        gameComplete: 'Congratulations! You completed the game!',
        
        // Level Descriptions
        level1_title: 'Level 1: First Turnip',
        level1_desc: 'Help the grandfather pull his first turnip from the ground.',
        level2_title: 'Level 2: Growing Problem',
        level2_desc: 'The turnips are getting bigger. You\'ll need more help!',
        level3_title: 'Level 3: Teamwork',
        level3_desc: 'Work together to pull this stubborn turnip.',
        level4_title: 'Level 4: Bottled Turnip',
        level4_desc: 'A turnip stuck in a bottle. Who can reach it?',
        level5_title: 'Level 5: High and Mighty',
        level5_desc: 'The turnip is up high. You need someone who can climb!',
        level6_title: 'Level 6: Spotlight Turnip',
        level6_desc: 'A turnip in the spotlight. This will require strategy!',
        level7_title: 'Level 7: Tight Squeeze',
        level7_desc: 'A narrow space. Only the smallest can fit!',
        level8_title: 'Level 8: Deep Ground',
        level8_desc: 'The turnip is deep underground. You need a digger!',
        level9_title: 'Level 9: Complex Puzzle',
        level9_desc: 'This one requires all your skills and characters!',
        level10_title: 'Level 10: The Final Turnip',
        level10_desc: 'The biggest turnip of all! Everyone must work together!',
    },
    
    hy: {
        // UI Elements
        play: 'Խաղալ',
        menu: 'Մենյու',
        nextLevel: 'Հաջորդ մակարդակ',
        retry: 'Կրկին փորձել',
        skip: 'Բաց թողնել',
        continue: 'Շարունակել',
        selectLanguage: 'Ընտրել լեզու',
        level: 'Մակարդակ',
        strength: 'Ուժ',
        ability: 'Կարողություն',
        
        // Introduction Story
        introTitle: 'Պապն ու շաղգամը',
        introPart1: 'Դռան առաջ մի անգամ պապը ցանեց մի շաղգամ։',
        introPart2: 'Շաղգամն աճեց, մեծացավ,',
        introPart3: 'Պապը տեսավ, զարմացավ։',
        introPart4: 'Պապը քաշեց, քաշքշեց, բայց շաղգամը հողից չհանեց։',
        introPart5: 'Պապին օգնություն է պետք! Կարո՞ղ ես օգնել նրան հավաքել բոլորին, որպեսզի քաշեն շաղգամը։',
        
        // Character Names
        character_grandfather: 'Պապ',
        character_grandmother: 'Տատ',
        character_grandchild: 'Թոռ',
        character_dog: 'Շուն',
        character_cat: 'Փիսո',
        character_mouse: 'Մուկ',
        
        // Character Abilities
        ability_leader: 'Առաջնորդ - Կարող է սկսել շղթան',
        ability_support: 'Աջակցություն - Բարձրացնում է հարևան կերպարների ուժը',
        ability_flexible: 'Ճկուն - Կարող է տեղավորվել նեղ տարածքներում',
        ability_dig: 'Խրել - Կարող է մուտք գործել գետնային աղբյուրներ',
        ability_climb: 'Բարձրանալ - Կարող է մուտք գործել բարձր աղբյուրներ',
        ability_small: 'Փոքր - Կարող է մուտք գործել նեղ տարածքներ',
        
        // Game Messages
        levelComplete: 'Մակարդակն ավարտված է!',
        levelFailed: 'Ուժը բավարար չէ!',
        pullTurnip: 'Քաշել շաղգամը',
        placeCharacters: 'Տեղադրեք կերպարները հերթականությամբ',
        totalStrength: 'Ընդհանուր ուժ',
        requiredStrength: 'Պահանջվում է',
        success: 'Հաջողություն!',
        failure: 'Կրկին փորձեք!',
        allCharactersNeeded: 'Բոլոր կերպարները անհրաժեշտ են!',
        gameComplete: 'Շնորհավորում ենք! Դուք ավարտեցիք խաղը!',
        
        // Level Descriptions
        level1_title: 'Մակարդակ 1: Առաջին շաղգամ',
        level1_desc: 'Օգնեք պապին քաշել առաջին շաղգամը հողից։',
        level2_title: 'Մակարդակ 2: Աճող խնդիր',
        level2_desc: 'Շաղգամները մեծանում են: Ձեզ ավելի շատ օգնություն է պետք!',
        level3_title: 'Մակարդակ 3: Թիմային աշխատանք',
        level3_desc: 'Աշխատեք միասին այս համառ շաղգամը քաշելու համար:',
        level4_title: 'Մակարդակ 4: Շշի մեջ շաղգամ',
        level4_desc: 'Շաղգամ, որը խրված է շշի մեջ: Ո՞վ կարող է հասնել դրան:',
        level5_title: 'Մակարդակ 5: Բարձր և հզոր',
        level5_desc: 'Շաղգամը բարձր է: Ձեզ պետք է մեկը, ով կարող է բարձրանալ!',
        level6_title: 'Մակարդակ 6: Լուսավոր շաղգամ',
        level6_desc: 'Շաղգամ լուսավորության մեջ: Սա կպահանջի ռազմավարություն!',
        level7_title: 'Մակարդակ 7: Նեղ տարածություն',
        level7_desc: 'Նեղ տարածություն: Միայն ամենափոքրը կարող է տեղավորվել!',
        level8_title: 'Մակարդակ 8: Խորը հող',
        level8_desc: 'Շաղգամը խորը գետնի տակ է: Ձեզ պետք է փորող!',
        level9_title: 'Մակարդակ 9: Բարդ հանելուկ',
        level9_desc: 'Սա կպահանջի ձեր բոլոր հմտությունները և կերպարները!',
        level10_title: 'Մակարդակ 10: Վերջին շաղգամ',
        level10_desc: 'Ամենամեծ շաղգամը: Բոլորը պետք է աշխատեն միասին!',
    },
    
    ru: {
        // UI Elements
        play: 'Играть',
        menu: 'Меню',
        nextLevel: 'Следующий уровень',
        retry: 'Попробовать снова',
        skip: 'Пропустить',
        continue: 'Продолжить',
        selectLanguage: 'Выбрать язык',
        level: 'Уровень',
        strength: 'Сила',
        ability: 'Способность',
        
        // Introduction Story
        introTitle: 'Дед и репка',
        introPart1: 'Однажды дед посадил репку перед своей дверью.',
        introPart2: 'Репка росла и росла, становясь всё больше и больше.',
        introPart3: 'Когда дед увидел её, он был поражён!',
        introPart4: 'Он попытался вытащить её, но репка не поддавалась из земли.',
        introPart5: 'Деду нужна помощь! Можешь ли ты помочь ему собрать всех, чтобы вытащить репку?',
        
        // Character Names
        character_grandfather: 'Дед',
        character_grandmother: 'Бабка',
        character_grandchild: 'Внук',
        character_dog: 'Собака',
        character_cat: 'Кошка',
        character_mouse: 'Мышка',
        
        // Character Abilities
        ability_leader: 'Лидер - Может начать цепочку',
        ability_support: 'Поддержка - Усиливает соседних персонажей',
        ability_flexible: 'Гибкий - Может поместиться в узких пространствах',
        ability_dig: 'Копать - Может получить доступ к наземным источникам',
        ability_climb: 'Лазить - Может получить доступ к высоким источникам',
        ability_small: 'Маленький - Может получить доступ к узким пространствам',
        
        // Game Messages
        levelComplete: 'Уровень пройден!',
        levelFailed: 'Недостаточно силы!',
        pullTurnip: 'Вытащить репку',
        placeCharacters: 'Разместите персонажей по порядку',
        totalStrength: 'Общая сила',
        requiredStrength: 'Требуется',
        success: 'Успех!',
        failure: 'Попробуйте снова!',
        allCharactersNeeded: 'Нужны все персонажи!',
        gameComplete: 'Поздравляем! Вы прошли игру!',
        
        // Level Descriptions
        level1_title: 'Уровень 1: Первая репка',
        level1_desc: 'Помогите деду вытащить первую репку из земли.',
        level2_title: 'Уровень 2: Растущая проблема',
        level2_desc: 'Репки становятся больше. Вам понадобится больше помощи!',
        level3_title: 'Уровень 3: Командная работа',
        level3_desc: 'Работайте вместе, чтобы вытащить эту упрямую репку.',
        level4_title: 'Уровень 4: Репка в бутылке',
        level4_desc: 'Репка застряла в бутылке. Кто сможет до неё добраться?',
        level5_title: 'Уровень 5: Высоко и могуче',
        level5_desc: 'Репка высоко. Вам нужен тот, кто может лазить!',
        level6_title: 'Уровень 6: Репка в прожекторе',
        level6_desc: 'Репка в прожекторе. Это потребует стратегии!',
        level7_title: 'Уровень 7: Тесное пространство',
        level7_desc: 'Узкое пространство. Только самый маленький может поместиться!',
        level8_title: 'Уровень 8: Глубокая земля',
        level8_desc: 'Репка глубоко под землёй. Вам нужен копатель!',
        level9_title: 'Уровень 9: Сложная головоломка',
        level9_desc: 'Это потребует всех ваших навыков и персонажей!',
        level10_title: 'Уровень 10: Последняя репка',
        level10_desc: 'Самая большая репка из всех! Все должны работать вместе!',
    }
};

