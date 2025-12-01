// Unlimited Fruits and Vegetables Products for AgrilinkEthiopia
function loadUnlimitedProducts() {
    const unlimitedProducts = [
        // VEGETABLES - Unlimited Selection
        {
            id: '1',
            title: 'Fresh Red Tomatoes',
            category: 'vegetables',
            price: 25,
            quantity: '500 kg',
            location: 'addis-ababa',
            description: 'High-quality fresh red tomatoes grown organically in the outskirts of Addis Ababa. Perfect for restaurants and households.',
            farmer: {
                id: 'farmer1',
                name: 'Abebe Kebede',
                phone: '+251911234567',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-15',
            available: true,
            organic: true
        },
        {
            id: '2',
            title: 'Organic Potatoes',
            category: 'vegetables',
            price: 18,
            quantity: '1 ton',
            location: 'mekelle',
            description: 'Premium quality organic potatoes, suitable for frying and boiling. Grown in the fertile lands of Tigray region.',
            farmer: {
                id: 'farmer2',
                name: 'Tigist Haile',
                phone: '+251922345678',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-14',
            available: true,
            organic: true
        },
        {
            id: '3',
            title: 'Fresh Onions',
            category: 'vegetables',
            price: 20,
            quantity: '750 kg',
            location: 'bahirdar',
            description: 'Large, fresh onions perfect for cooking and commercial use. Grown in the Amhara region.',
            farmer: {
                id: 'farmer3',
                name: 'Mohammed Ali',
                phone: '+251933456789',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1524593166156-3e0c51e5f8e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-13',
            available: true,
            organic: false
        },
        {
            id: '4',
            title: 'Fresh Carrots',
            category: 'vegetables',
            price: 22,
            quantity: '400 kg',
            location: 'addis-ababa',
            description: 'Fresh, crunchy carrots rich in vitamins. Perfect for salads and cooking.',
            farmer: {
                id: 'farmer1',
                name: 'Abebe Kebede',
                phone: '+251911234567',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-09',
            available: true,
            organic: false
        },
        {
            id: '5',
            title: 'Green Bell Peppers',
            category: 'vegetables',
            price: 30,
            quantity: '250 kg',
            location: 'dire-dawa',
            description: 'Crispy green bell peppers, perfect for stir-frying and salads. Grown in the Harar region.',
            farmer: {
                id: 'farmer4',
                name: 'Kedir Hassan',
                phone: '+251944567890',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-16',
            available: true,
            organic: true
        },
        {
            id: '6',
            title: 'Fresh Spinach',
            category: 'vegetables',
            price: 28,
            quantity: '180 kg',
            location: 'hawassa',
            description: 'Fresh organic spinach leaves, rich in iron and vitamins. Perfect for traditional Ethiopian dishes.',
            farmer: {
                id: 'farmer5',
                name: 'Almaz Tadesse',
                phone: '+251955678901',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-17',
            available: true,
            organic: true
        },
        {
            id: '7',
            title: 'Cabbage Fresh',
            category: 'vegetables',
            price: 15,
            quantity: '600 kg',
            location: 'gondar',
            description: 'Large fresh cabbage heads, perfect for salads and cooking. Grown in the highlands.',
            farmer: {
                id: 'farmer6',
                name: 'Yonas Asfaw',
                phone: '+251966789012',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-18',
            available: true,
            organic: false
        },
        {
            id: '8',
            title: 'Fresh Garlic',
            category: 'vegetables',
            price: 45,
            quantity: '150 kg',
            location: 'mekelle',
            description: 'Aromatic fresh garlic bulbs, essential for Ethiopian cuisine. High quality and flavorful.',
            farmer: {
                id: 'farmer2',
                name: 'Tigist Haile',
                phone: '+251922345678',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1528243046698-779213c48db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-19',
            available: true,
            organic: true
        },
        {
            id: '9',
            title: 'Fresh Ginger',
            category: 'vegetables',
            price: 50,
            quantity: '120 kg',
            location: 'bahirdar',
            description: 'Fresh ginger root with strong flavor and aroma. Perfect for tea and traditional medicines.',
            farmer: {
                id: 'farmer3',
                name: 'Mohammed Ali',
                phone: '+251933456789',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1543076499-a6133cb561c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-20',
            available: true,
            organic: false
        },
        {
            id: '10',
            title: 'Red Chili Peppers',
            category: 'vegetables',
            price: 35,
            quantity: '200 kg',
            location: 'dire-dawa',
            description: 'Hot red chili peppers, perfect for berbere spice and Ethiopian dishes.',
            farmer: {
                id: 'farmer4',
                name: 'Kedir Hassan',
                phone: '+251944567890',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-21',
            available: true,
            organic: true
        },
        {
            id: '11',
            title: 'Fresh Eggplant',
            category: 'vegetables',
            price: 32,
            quantity: '180 kg',
            location: 'hawassa',
            description: 'Fresh eggplant, perfect for grilling and traditional Ethiopian recipes.',
            farmer: {
                id: 'farmer5',
                name: 'Almaz Tadesse',
                phone: '+251955678901',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1590766940554-536447b485c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-22',
            available: true,
            organic: false
        },
        {
            id: '12',
            title: 'Cucumbers Fresh',
            category: 'vegetables',
            price: 25,
            quantity: '300 kg',
            location: 'addis-ababa',
            description: 'Fresh crispy cucumbers, perfect for salads and healthy snacks.',
            farmer: {
                id: 'farmer1',
                name: 'Abebe Kebede',
                phone: '+251911234567',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1443783322203-22a0b61b5be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-23',
            available: true,
            organic: true
        },
        {
            id: '13',
            title: 'Fresh Lettuce',
            category: 'vegetables',
            price: 20,
            quantity: '150 kg',
            location: 'gondar',
            description: 'Crispy fresh lettuce, perfect for salads and sandwiches.',
            farmer: {
                id: 'farmer6',
                name: 'Yonas Asfaw',
                phone: '+251966789012',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-24',
            available: true,
            organic: false
        },
        {
            id: '14',
            title: 'Beetroots Fresh',
            category: 'vegetables',
            price: 22,
            quantity: '250 kg',
            location: 'mekelle',
            description: 'Fresh red beetroots, rich in nutrients and perfect for salads and juices.',
            farmer: {
                id: 'farmer2',
                name: 'Tigist Haile',
                phone: '+251922345678',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1518779560489-82e9a1d2f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-25',
            available: true,
            organic: true
        },
        {
            id: '15',
            title: 'Fresh Broccoli',
            category: 'vegetables',
            price: 40,
            quantity: '120 kg',
            location: 'bahirdar',
            description: 'Fresh broccoli heads, rich in vitamins and perfect for healthy meals.',
            farmer: {
                id: 'farmer3',
                name: 'Mohammed Ali',
                phone: '+251933456789',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-26',
            available: true,
            organic: false
        },
        {
            id: '16',
            title: 'Green Beans',
            category: 'vegetables',
            price: 35,
            quantity: '200 kg',
            location: 'dire-dawa',
            description: 'Fresh green beans, perfect for stir-frying and traditional Ethiopian dishes.',
            farmer: {
                id: 'farmer4',
                name: 'Kedir Hassan',
                phone: '+251944567890',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1512486227866-d8a896d41a7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-27',
            available: true,
            organic: true
        },
        {
            id: '17',
            title: 'Fresh Corn',
            category: 'vegetables',
            price: 18,
            quantity: '500 kg',
            location: 'hawassa',
            description: 'Sweet fresh corn on the cob, perfect for grilling and boiling.',
            farmer: {
                id: 'farmer5',
                name: 'Almaz Tadesse',
                phone: '+251955678901',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1528243046698-779213c48db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-28',
            available: true,
            organic: false
        },
        {
            id: '18',
            title: 'Zucchini Fresh',
            category: 'vegetables',
            price: 28,
            quantity: '180 kg',
            location: 'addis-ababa',
            description: 'Fresh zucchini, perfect for grilling, baking, and stir-frying.',
            farmer: {
                id: 'farmer1',
                name: 'Abebe Kebede',
                phone: '+251911234567',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-29',
            available: true,
            organic: true
        },
        {
            id: '19',
            title: 'Pumpkin Fresh',
            category: 'vegetables',
            price: 25,
            quantity: '300 kg',
            location: 'gondar',
            description: 'Large fresh pumpkins, perfect for soups and traditional dishes.',
            farmer: {
                id: 'farmer6',
                name: 'Yonas Asfaw',
                phone: '+251966789012',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1595401629168-87648939336e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-30',
            available: true,
            organic: false
        },
        {
            id: '20',
            title: 'Mushrooms Fresh',
            category: 'vegetables',
            price: 55,
            quantity: '80 kg',
            location: 'mekelle',
            description: 'Fresh button mushrooms, perfect for cooking and salads.',
            farmer: {
                id: 'farmer2',
                name: 'Tigist Haile',
                phone: '+251922345678',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-31',
            available: true,
            organic: true
        },
        // FRUITS - Unlimited Selection
        {
            id: '21',
            title: 'Fresh Mangoes',
            category: 'fruits',
            price: 35,
            quantity: '300 kg',
            location: 'dire-dawa',
            description: 'Sweet and juicy tropical mangoes, perfect for fresh consumption or juice production.',
            farmer: {
                id: 'farmer5',
                name: 'Fatuma Ahmed',
                phone: '+251955678901',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-11',
            available: true,
            organic: false
        },
        {
            id: '22',
            title: 'Bananas',
            category: 'fruits',
            price: 28,
            quantity: '600 kg',
            location: 'hawassa',
            description: 'Sweet bananas from the southern region. Perfect for breakfast and snacks.',
            farmer: {
                id: 'farmer4',
                name: 'Chala Lemma',
                phone: '+251944567890',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1563736408213-4a5e9b72b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-08',
            available: true,
            organic: false
        },
        {
            id: '23',
            title: 'Fresh Strawberries',
            category: 'fruits',
            price: 55,
            quantity: '50 kg',
            location: 'addis-ababa',
            description: 'Sweet and fresh strawberries grown in controlled greenhouse conditions.',
            farmer: {
                id: 'farmer1',
                name: 'Abebe Kebede',
                phone: '+251911234567',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-04',
            available: true,
            organic: true
        },
        {
            id: '24',
            title: 'Fresh Oranges',
            category: 'fruits',
            price: 32,
            quantity: '400 kg',
            location: 'bahirdar',
            description: 'Sweet juicy oranges, perfect for fresh juice and consumption.',
            farmer: {
                id: 'farmer7',
                name: 'Senaay Bekele',
                phone: '+251977890123',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-01',
            available: true,
            organic: false
        },
        {
            id: '25',
            title: 'Pineapples Fresh',
            category: 'fruits',
            price: 45,
            quantity: '200 kg',
            location: 'hawassa',
            description: 'Sweet tropical pineapples, perfect for fresh consumption and juice.',
            farmer: {
                id: 'farmer8',
                name: 'Rahel Tesfaye',
                phone: '+251988901234',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-02',
            available: true,
            organic: true
        },
        {
            id: '26',
            title: 'Fresh Apples',
            category: 'fruits',
            price: 38,
            quantity: '250 kg',
            location: 'mekelle',
            description: 'Crispy fresh apples, perfect for snacks and healthy eating.',
            farmer: {
                id: 'farmer9',
                name: 'Solomon Tadesse',
                phone: '+251999012345',
                rating: 4.5
            },
            images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-03',
            available: true,
            organic: false
        },
        {
            id: '27',
            title: 'Fresh Grapes',
            category: 'fruits',
            price: 48,
            quantity: '150 kg',
            location: 'dire-dawa',
            description: 'Sweet fresh grapes, perfect for consumption and wine making.',
            farmer: {
                id: 'farmer10',
                name: 'Mekdes Hailu',
                phone: '+251911123456',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1537640538966-79f369143f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-04',
            available: true,
            organic: true
        },
        {
            id: '28',
            title: 'Watermelons Fresh',
            category: 'fruits',
            price: 25,
            quantity: '500 kg',
            location: 'bahirdar',
            description: 'Large sweet watermelons, perfect for summer refreshment.',
            farmer: {
                id: 'farmer11',
                name: 'Berhanu Abebe',
                phone: '+251922234567',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-05',
            available: true,
            organic: false
        },
        {
            id: '29',
            title: 'Fresh Papayas',
            category: 'fruits',
            price: 35,
            quantity: '200 kg',
            location: 'hawassa',
            description: 'Tropical papayas, sweet and nutritious, perfect for breakfast.',
            farmer: {
                id: 'farmer12',
                name: 'Tigist Getachew',
                phone: '+251933345678',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1596404643764-2a2bivykd28?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-06',
            available: true,
            organic: true
        },
        {
            id: '30',
            title: 'Fresh Guavas',
            category: 'fruits',
            price: 30,
            quantity: '180 kg',
            location: 'gondar',
            description: 'Sweet and fragrant guavas, rich in vitamin C.',
            farmer: {
                id: 'farmer13',
                name: 'Yohannes Lemma',
                phone: '+251944456789',
                rating: 4.5
            },
            images: ['https://images.unsplash.com/photo-1604492402015-4c2b3b5d6b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-07',
            available: true,
            organic: false
        },
        {
            id: '31',
            title: 'Fresh Peaches',
            category: 'fruits',
            price: 42,
            quantity: '120 kg',
            location: 'mekelle',
            description: 'Sweet juicy peaches, perfect for fresh consumption and desserts.',
            farmer: {
                id: 'farmer14',
                name: 'Almaz Kebede',
                phone: '+251955567890',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1604492402015-4c2b3b5d6b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-08',
            available: true,
            organic: true
        },
        {
            id: '32',
            title: 'Fresh Plums',
            category: 'fruits',
            price: 38,
            quantity: '150 kg',
            location: 'addis-ababa',
            description: 'Sweet and tart plums, perfect for snacking and cooking.',
            farmer: {
                id: 'farmer15',
                name: 'Dawit Zewdu',
                phone: '+251966678901',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1596404643764-2a2bivykd28?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-09',
            available: true,
            organic: false
        },
        {
            id: '33',
            title: 'Fresh Pears',
            category: 'fruits',
            price: 35,
            quantity: '140 kg',
            location: 'dire-dawa',
            description: 'Sweet and juicy pears, perfect for fresh consumption.',
            farmer: {
                id: 'farmer16',
                name: 'Senaay Mulugeta',
                phone: '+251977789012',
                rating: 4.5
            },
            images: ['https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-10',
            available: true,
            organic: true
        },
        {
            id: '34',
            title: 'Fresh Cherries',
            category: 'fruits',
            price: 65,
            quantity: '60 kg',
            location: 'bahirdar',
            description: 'Sweet cherries, perfect for desserts and fresh consumption.',
            farmer: {
                id: 'farmer17',
                name: 'Mekdes Alemu',
                phone: '+251988890123',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1528821128474-27f963b062bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-11',
            available: true,
            organic: false
        },
        {
            id: '35',
            title: 'Fresh Figs',
            category: 'fruits',
            price: 48,
            quantity: '80 kg',
            location: 'hawassa',
            description: 'Sweet fresh figs, rich in fiber and perfect for healthy eating.',
            farmer: {
                id: 'farmer18',
                name: 'Solomon Berhane',
                phone: '+251999901234',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1604492402015-4c2b3b5d6b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-12',
            available: true,
            organic: true
        },
        {
            id: '36',
            title: 'Fresh Pomegranates',
            category: 'fruits',
            price: 55,
            quantity: '100 kg',
            location: 'gondar',
            description: 'Sweet and nutritious pomegranates, perfect for juice and fresh eating.',
            farmer: {
                id: 'farmer19',
                name: 'Tigist Haile',
                phone: '+251911012345',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1604492402015-4c2b3b5d6b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-13',
            available: true,
            organic: false
        },
        {
            id: '37',
            title: 'Fresh Kiwis',
            category: 'fruits',
            price: 58,
            quantity: '70 kg',
            location: 'mekelle',
            description: 'Tart and sweet kiwis, rich in vitamin C and perfect for salads.',
            farmer: {
                id: 'farmer20',
                name: 'Almaz Tesfaye',
                phone: '+251922123456',
                rating: 4.5
            },
            images: ['https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-14',
            available: true,
            organic: true
        },
        {
            id: '38',
            title: 'Fresh Avocados',
            category: 'fruits',
            price: 45,
            quantity: '200 kg',
            location: 'addis-ababa',
            description: 'Creamy fresh avocados, perfect for salads and traditional dishes.',
            farmer: {
                id: 'farmer21',
                name: 'Dawit Kebede',
                phone: '+251933234567',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-15',
            available: true,
            organic: false
        },
        {
            id: '39',
            title: 'Fresh Lemons',
            category: 'fruits',
            price: 28,
            quantity: '180 kg',
            location: 'dire-dawa',
            description: 'Fresh lemons, perfect for cooking, drinks, and traditional remedies.',
            farmer: {
                id: 'farmer22',
                name: 'Senaay Bekele',
                phone: '+251944345678',
                rating: 4.6
            },
            images: ['https://images.unsplash.com/photo-1590502593747-42a996133562?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-16',
            available: true,
            organic: true
        },
        {
            id: '40',
            title: 'Fresh Limes',
            category: 'fruits',
            price: 26,
            quantity: '150 kg',
            location: 'bahirdar',
            description: 'Fresh limes, perfect for cooking, beverages, and traditional Ethiopian dishes.',
            farmer: {
                id: 'farmer23',
                name: 'Mekdes Tadesse',
                phone: '+251955456789',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1590502593747-42a996133562?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-02-17',
            available: true,
            organic: false
        },
        // ORIGINAL PRODUCTS FOR VARIETY
        {
            id: '41',
            title: 'Premium Coffee Beans',
            category: 'spices',
            price: 120,
            quantity: '200 kg',
            location: 'hawassa',
            description: 'Premium Ethiopian coffee beans from the Sidamo region. Rich flavor and aroma, roasted to perfection.',
            farmer: {
                id: 'farmer4',
                name: 'Chala Lemma',
                phone: '+251944567890',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-12',
            available: true,
            organic: true
        },
        {
            id: '42',
            title: 'Teff White',
            category: 'grains',
            price: 45,
            quantity: '2 tons',
            location: 'gondar',
            description: 'Premium white teff, perfect for injera preparation. Grown in the highlands of Gondar.',
            farmer: {
                id: 'farmer6',
                name: 'Dawit Bekele',
                phone: '+251966789012',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-10',
            available: true,
            organic: true
        },
        {
            id: '43',
            title: 'Lentils Red',
            category: 'legumes',
            price: 32,
            quantity: '800 kg',
            location: 'mekelle',
            description: 'High-quality red lentils, perfect for Ethiopian traditional dishes.',
            farmer: {
                id: 'farmer2',
                name: 'Tigist Haile',
                phone: '+251922345678',
                rating: 4.9
            },
            images: ['https://images.unsplash.com/photo-1471197354225-eb5255267c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-07',
            available: true,
            organic: true
        },
        {
            id: '44',
            title: 'Fresh Milk',
            category: 'dairy',
            price: 15,
            quantity: '100 liters/day',
            location: 'bahirdar',
            description: 'Fresh cow milk delivered daily from local farms around Lake Tana.',
            farmer: {
                id: 'farmer3',
                name: 'Mohammed Ali',
                phone: '+251933456789',
                rating: 4.7
            },
            images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-06',
            available: true,
            organic: false
        },
        {
            id: '45',
            title: 'Berbere Spice',
            category: 'spices',
            price: 85,
            quantity: '150 kg',
            location: 'dire-dawa',
            description: 'Authentic Ethiopian berbere spice blend, made with traditional ingredients.',
            farmer: {
                id: 'farmer5',
                name: 'Fatuma Ahmed',
                phone: '+251955678901',
                rating: 4.8
            },
            images: ['https://images.unsplash.com/photo-1517438124226-b2b2cd02cab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
            postedDate: '2024-01-05',
            available: true,
            organic: false
        }
    ];

    // Save to localStorage and return the products
    localStorage.setItem('agrilinkProducts', JSON.stringify(unlimitedProducts));
    return unlimitedProducts;
}

// Function to add this to the main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadUnlimitedProducts };
}