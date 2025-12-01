// Product Generator for AgrilinkEthiopia
// This script generates a large number of products to match category counts

// Define image mappings for categories
const imageMap = {
    vegetables: ['images/tomatoes.jpg', 'images/garlic.jpg', 'images/vegetables.png', 'images/cabbage-sacks.jpg', 'images/carrots-sacks.jpg', 'images/broccoli.jpg', 'images/lettuce.jpg', 'images/zucchini.jpg', 'images/beetroot.jpg', 'images/eggplant.jpg', 'images/okra.jpg'],
    fruits: ['images/mango.jpg', 'images/watermelon.jpg', 'images/cherry-tomatoes.jpg', 'images/lemon.jpg', 'images/coconut.jpg', 'images/custard-apple.jpg'],
    grains: ['images/wheat.jpg', 'images/wheat-sack.jpg', 'images/rice.jpg', 'images/rice-sack.jpg', 'images/corn-sacks.jpg'],
    spices: ['images/chili.jpg', 'images/chili-basket.jpg', 'images/ginger.jpg', 'images/fenugreek.jpg', 'images/tamarind.jpg'],
    legumes: ['images/beans-variety.jpg', 'images/chickpeas-sack.jpg', 'images/kidney-beans.jpg', 'images/pinto-beans.jpg', 'images/lentils.jpg', 'images/lentils-sack.jpg', 'images/mung-beans.jpg', 'images/peas-fresh.jpg', 'images/white-beans.jpg', 'images/borlotti-beans.jpg', 'images/black-eyed-peas.jpg', 'images/adzuki-beans.jpg', 'images/field-peas.jpg'],
    dairy: ['images/milk.jpg', 'images/cheese-shredded.jpg', 'images/cheese-block.jpg', 'images/cheese-swiss.jpg', 'images/cheese-cheddar.jpg', 'images/cheese-yellow.jpg', 'images/cheese-emmental.jpg', 'images/eggs.jpg', 'images/dairy-products.jpg'],
    coffee: ['images/coffee-beans.jpg'],
    tubers: ['images/pumpkin.jpg'],
    oilseeds: ['images/niger-seed-oil.jpg', 'images/sunflower-seeds.jpg'],
    pulses: ['images/pulses.png', 'images/lentils-variety.jpg', 'images/legumes-collection.jpg']
};

// Define product variations for each category
const productTemplates = {
    vegetables: [
        {names: ['Tomatoes', 'Cherry Tomatoes', 'Plum Tomatoes', 'Beef Tomatoes'], base: 'Fresh tomatoes, perfect for salads and cooking.'},
        {names: ['Garlic', 'Garlic Bulbs'], base: 'Strong flavored local garlic. Essential for Ethiopian dishes.'},
        {names: ['Cabbage', 'Green Cabbage', 'Purple Cabbage'], base: 'Fresh crisp cabbage. Healthy and nutritious.'},
        {names: ['Carrots', 'Baby Carrots', 'Organic Carrots'], base: 'Sweet local carrots. Rich in vitamin A.'},
        {names: ['Broccoli','Organic Broccoli'], base: 'Fresh broccoli florets. High in nutrients.'},
        {names: ['Lettuce', 'Green Lettuce', 'Romaine Lettuce'], base: 'Crispy fresh lettuce for salads.'},
        {names: ['Zucchini', 'Green Zucchini'], base: 'Fresh zucchini. Low carb and healthy.'},
        {names: ['Beetroot', 'Red Beetroot', 'Golden Beetroot'], base: 'Fresh beetroot. Rich in antioxidants.'},
        {names: ['Eggplant', 'Purple Eggplant', 'White Eggplant'], base: 'Fresh eggplant for traditional dishes.'},
        {names: ['Okra', 'Fresh Okra', 'Lady Fingers'], base: 'Fresh okra for stews.'},
        {names: ['Green Onions', 'Spring Onions', 'Scallions'], base: 'Fresh green onions for flavor.'},
        {names: ['Kale (Gomen)', 'Ethiopian Kale'], base: 'Fresh Ethiopian Kale. Rich in iron and vitamins.'},
        {names: ['Onions', 'Red Onions', 'White Onions', 'Shallots'], base: 'Fresh onions for cooking.'},
        {names: ['Peppers', 'Bell Peppers', 'Green Peppers', 'Red Peppers'], base: 'Fresh sweet peppers.'},
        {names: ['Potatoes', 'White Potatoes', 'Red Potatoes'], base: 'Fresh local potatoes.'},
        {names: ['Sweet Potatoes', 'Orange Sweet Potatoes'], base: 'Sweet and nutritious.'},
        {names: ['Spinach', 'Fresh Spinach'], base: 'Leafy green vegetables.'},
        {names: ['Cucumbers', 'Fresh Cucumbers'], base: 'Crisp and refreshing.'}
    ],
    fruits: [
        {names: ['Mangoes', 'Kent Mangoes', 'Tommy Atkins Mangoes', 'Alphonso Mangoes'], base: 'Sweet tropical mangoes from local farms.'},
        {names: ['Watermelon', 'Seedless Watermelon', 'Mini Watermelon'], base: 'Juicy refreshing watermelon.'},
        {names: ['Lemons', 'Yellow Lemons', 'Meyer Lemons'], base: 'Fresh citrus lemons.'},
        {names: ['Coconuts', 'Fresh Coconuts', 'Young Coconuts'], base: 'Tropical coconuts for juice and meat.'},
        {names: ['Bananas', 'Plantains', 'Baby Bananas'], base: 'Fresh local bananas.'},
        {names: ['Papayas', 'Solo Papayas', 'Red Papayas'], base: 'Sweet tropical papayas.'},
        {names: ['Oranges', 'Valencia Oranges', 'Navel Oranges'], base: 'Juicy sweet oranges.'},
        {names: ['Avocados', 'Hass Avocados', 'Fuerte Avocados'], base: 'Creamy nutritious avocados.'},
        {names: ['Pineapples', 'Golden Pineapples'], base: 'Sweet tropical pineapples.'}
    ],
    grains: [
        {names: ['Wheat', 'Durum Wheat', 'Soft Wheat', 'Hard Wheat'], base: 'High quality wheat grain for flour and bread.'},
        {names: ['Rice', 'White Rice', 'Basmati Rice', 'Jasmine Rice'], base: 'Premium quality rice grain.'},
        {names: ['Corn', 'Yellow Corn', 'White Corn', 'Sweet Corn'], base: 'Fresh corn kernels and cobs.'},
        {names: ['Teff', 'White Teff', 'Brown Teff', 'Red Teff'], base: 'Ethiopian superfood teff grain.'},
        {names: ['Barley', 'Pearl Barley', 'Hulled Barley'], base: 'Nutritious barley grain.'},
        {names: ['Sorghum', 'White Sorghum', 'Red Sorghum'], base: 'Drought-resistant grain.'},
        {names: ['Millet', 'Pearl Millet', 'Finger Millet'], base: 'Gluten-free ancient grain.'}
    ],
    spices: [
        {names: ['Red Chili Peppers', 'Dried Chili', 'Chili Powder', 'Berbere Mix'], base: 'Hot spicy peppers for traditional Ethiopian cooking.'},
        {names: ['Ginger', 'Fresh Ginger Root', 'Dried Ginger'], base: 'Fresh aromatic ginger for cooking and tea.'},
        {names: ['Fenugreek', 'Fenugreek Seeds', 'Fenugreek Leaves'], base: 'Aromatic fenugreek for spice blends.'},
        {names: ['Tamarind', 'Tamarind Pods', 'Tamarind Paste'], base: 'Sour fruit for flavoring dishes.'},
        {names: ['Turmeric', 'Fresh Turmeric', 'Turmeric Powder'], base: 'Golden spice with health benefits.'},
        {names: ['Coriander', 'Coriander Seeds', 'Fresh Coriander'], base: 'Aromatic spice and herb.'},
        {names: ['Cardamom', 'Green Cardamom', 'Black Cardamom'], base: 'Fragrant spice for coffee.'},
        {names: ['Black Pepper', 'Whole Peppercorns', 'Cracked Pepper'], base: 'Essential cooking spice.'}
    ],
    legumes: [
        {names: ['Fava Beans', 'Broad Beans', 'Baqela'], base: 'Dried beans perfect for Ful Medames. High protein.'},
        {names: ['Kidney Beans', 'Red Kidney Beans', 'White Kidney Beans'], base: 'Nutritious beans for stews.'},
        {names: ['Pinto Beans', 'Speckled Beans'], base: 'Creamy textured beans.'},
        {names: ['White Beans', 'Navy Beans', 'Cannellini Beans'], base: 'Mild flavored white beans.'},
        {names: ['Black-Eyed Peas', 'Cowpeas'], base: 'Traditional legumes.'},
        {names: ['Adzuki Beans', 'Red Beans'], base: 'Small red beans.'},
        {names: ['Peas', 'Green Peas', 'Field Peas', 'Yellow Peas'], base: 'Dried or fresh peas.'}
    ],
    dairy: [
        {names: ['Fresh Milk', 'Cow Milk', 'Goat Milk'], base: 'Fresh pasteurized milk from local dairy farms.'},
        {names: ['Cheese', 'Ayib (Ethiopian Cheese)', 'Cheddar', 'Mozzarella'], base: 'Fresh local cheese.'},
        {names: ['Butter', 'Clarified Butter (Niter Kibbeh)', 'Fresh Butter'], base: 'Rich creamy butter.'},
        {names: ['Yogurt', 'Plain Yogurt', 'Greek Yogurt'], base: 'Fresh cultured yogurt.'},
        {names: ['Eggs', 'Free-Range Eggs', 'Organic Eggs'], base: 'Fresh farm eggs.'}
    ],
    coffee: [
        {names: ['Arabica Coffee Beans', 'Yirgacheffe Coffee', 'Sidamo Coffee', 'Harar Coffee', 'Limu Coffee'], base: 'Premium Ethiopian coffee beans from famous regions.'},
        {names: ['Roasted Coffee', 'Light Roast', 'Medium Roast', 'Dark Roast'], base: 'Freshly roasted coffee beans.'}
    ],
    tubers: [
        {names: ['Potatoes', 'White Potatoes', 'Red Potatoes', 'Fingerling Potatoes'], base: 'Fresh tubers for cooking.'},
        {names: ['Sweet Potatoes', 'Orange Sweet Potatoes', 'Purple Sweet Potatoes'], base: 'Sweet nutritious tubers.'},
        {names: ['Yams', 'White Yams', 'Yellow Yams'], base: 'Starchy root vegetables.'},
        {names: ['Cassava', 'Fresh Cassava'], base: 'Tropical root vegetable.'},
        {names: ['Taro Root'], base: 'Starchy tuber.'}
    ],
    oilseeds: [
        {names: ['Niger Seed', 'Nug Seed'], base: 'Ethiopian oilseed for cooking oil.'},
        {names: ['Sunflower Seeds', 'Black Sunflower'], base: 'Oil-rich seeds.'},
        {names: ['Sesame Seeds', 'White Sesame', 'Black Sesame'], base: 'Tiny oil-rich seeds.'},
        {names: ['Flaxseeds', 'Golden Flax', 'Brown Flax'], base: 'Omega-3 rich seeds.'}
    ],
    pulses: [
        {names: ['Lentils', 'Red Lentils (Misir)', 'Green Lentils', 'Brown Lentils'], base: 'Protein-rich pulse for traditional Ethiopian dishes.'},
        {names: ['Chickpeas', 'Kabuli Chickpeas', 'Desi Chickpeas'], base: 'Versatile pulse for shiro and hummus.'},
        {names: ['Split Peas', 'Yellow Split Peas', 'Green Split Peas'], base: 'Quick-cooking pulse.'},
        {names: ['Mung Beans', 'Green Gram'], base: 'Small green pulse.'}
    ]
};

// Locations
const locations = ['addis-ababa', 'dire-dawa', 'bahirdar', 'gondar', 'hawassa', 'mekelle', 'jimma', 'ambo', 'holeta', 'sebeta', 'sululta', 'mareko'];

console.log('Starting product generation...');
console.log(`Target counts: Vegetables=245, Fruits=189, Grains=156, Spices=98, Legumes=134, Dairy=67, Coffee=120, Tubers=85, Oilseeds=95, Pulses=110`);
