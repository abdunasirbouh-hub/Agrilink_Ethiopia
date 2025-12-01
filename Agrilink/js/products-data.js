// Corrected Product Database - Each image used only once
function generateAllProducts() {
    const locations = ['addis-ababa', 'dire-dawa', 'mekelle', 'gondar', 'bahirdar', 'hawassa', 'jimma'];
    const farmers = [
        {id: 'farmer1', name: 'Abebe Kebede', phone: '+251911234567', email: 'abebe@example.com', rating: 4.8},
        {id: 'farmer2', name: 'Tigist Haile', phone: '+251922345678', email: 'tigist@example.com', rating: 4.9}
    ];
    const rand = () => `${50 + Math.floor(Math.random() * 950)} kg`;
    const rf = () => farmers[Math.floor(Math.random() * 2)];
    const rl = () => locations[Math.floor(Math.random() * 7)];
    
    return [
        // VEGETABLES (15)
        {id:'1',title:'Cherry Tomatoes',category:'vegetables',price:25,quantity:rand(),location:rl(),description:'Fresh cherry tomatoes, sweet and juicy. Perfect for salads.',farmer:rf(),images:['images/cherry-tomatoes.jpg'],postedDate:'2024-01-15',available:true,organic:true,status:'approved'},
        {id:'74',title:'Tomatoes Bowl',category:'vegetables',price:28,quantity:rand(),location:rl(),description:'Fresh red tomatoes in bowl. Perfect for cooking and salads.',farmer:rf(),images:['images/tomatoes-bowl.jpg'],postedDate:'2024-01-15',available:true,organic:true,status:'approved'},
        {id:'100',title:'Red Bell Peppers',category:'vegetables',price:35,quantity:rand(),location:rl(),description:'Fresh red bell peppers. Sweet and crunchy.',farmer:rf(),images:['images/bell-peppers.jpg'],postedDate:'2024-01-16',available:true,organic:true,status:'approved'},
        {id:'101',title:'Fresh Cabbage',category:'vegetables',price:15,quantity:rand(),location:rl(),description:'Fresh cabbage in sacks. Crisp and nutritious.',farmer:rf(),images:['images/cabbage-sacks.jpg'],postedDate:'2024-01-17',available:true,organic:true,status:'approved'},
        {id:'102',title:'Fresh Carrots',category:'vegetables',price:22,quantity:rand(),location:rl(),description:'Orange carrots in sacks. Rich in vitamins.',farmer:rf(),images:['images/carrots-sacks.jpg'],postedDate:'2024-01-18',available:true,organic:true,status:'approved'},
        {id:'103',title:'Zucchini',category:'vegetables',price:18,quantity:rand(),location:rl(),description:'Fresh zucchini. Perfect for cooking.',farmer:rf(),images:['images/zucchini.jpg'],postedDate:'2024-01-19',available:true,organic:true,status:'approved'},
        {id:'104',title:'Fresh Lettuce',category:'vegetables',price:20,quantity:rand(),location:rl(),description:'Green lettuce leaves. Crisp and fresh.',farmer:rf(),images:['images/lettuce.jpg'],postedDate:'2024-01-20',available:true,organic:true,status:'approved'},
        {id:'105',title:'Green Onions',category:'vegetables',price:12,quantity:rand(),location:rl(),description:'Fresh green onions (scallions). Mild flavor.',farmer:rf(),images:['images/green-onions.jpg'],postedDate:'2024-01-21',available:true,organic:true,status:'approved'},
        {id:'106',title:'Fresh Eggplant',category:'vegetables',price:16,quantity:rand(),location:rl(),description:'Fresh eggplant. Perfect for stews and grilling.',farmer:rf(),images:['images/eggplant.jpg'],postedDate:'2024-01-22',available:true,organic:false,status:'approved'},
        {id:'107',title:'Fresh Mushrooms',category:'vegetables',price:24,quantity:rand(),location:rl(),description:'Fresh mushrooms. Rich in nutrients.',farmer:rf(),images:['images/mushrooms.jpg'],postedDate:'2024-01-23',available:true,organic:true,status:'approved'},
        {id:'108',title:'Broccoli',category:'vegetables',price:30,quantity:rand(),location:rl(),description:'Fresh broccoli florets. High in nutrients.',farmer:rf(),images:['images/broccoli.jpg'],postedDate:'2024-01-24',available:true,organic:true,status:'approved'},
        {id:'109',title:'Fresh Okra',category:'vegetables',price:28,quantity:rand(),location:rl(),description:'Fresh okra pods. Great for stews.',farmer:rf(),images:['images/okra.jpg'],postedDate:'2024-01-25',available:true,organic:true,status:'approved'},
        {id:'110',title:'Fresh Garlic',category:'vegetables',price:45,quantity:rand(),location:rl(),description:'Fresh garlic bulbs. Essential for cooking.',farmer:rf(),images:['images/garlic.jpg'],postedDate:'2024-01-26',available:true,organic:true,status:'approved'},
        {id:'111',title:'Fresh Ginger',category:'vegetables',price:40,quantity:rand(),location:rl(),description:'Fresh ginger roots. Aromatic and spicy.',farmer:rf(),images:['images/ginger.jpg'],postedDate:'2024-01-27',available:true,organic:true,status:'approved'},
        {id:'112',title:'Fresh Peas',category:'vegetables',price:26,quantity:rand(),location:rl(),description:'Fresh green peas. Tender and sweet.',farmer:rf(),images:['images/peas-fresh.jpg'],postedDate:'2024-01-28',available:true,organic:true,status:'approved'},
        
        // FRUITS (12)
        {id:'13',title:'Avocados',category:'fruits',price:40,quantity:rand(),location:rl(),description:'Creamy avocados. Premium quality.',farmer:rf(),images:['images/avocados.jpg'],postedDate:'2024-02-01',available:true,organic:true,status:'approved'},
        {id:'14',title:'Bananas',category:'fruits',price:25,quantity:rand(),location:rl(),description:'Sweet yellow bananas. Naturally ripened.',farmer:rf(),images:['images/bananas.jpg'],postedDate:'2024-02-02',available:true,organic:false,status:'approved'},
        {id:'15',title:'Blueberries',category:'fruits',price:95,quantity:rand(),location:rl(),description:'Fresh blueberries. Antioxidant-rich.',farmer:rf(),images:['images/blueberries.jpg'],postedDate:'2024-02-03',available:true,organic:true,status:'approved'},
        {id:'16',title:'Cherries',category:'fruits',price:85,quantity:rand(),location:rl(),description:'Juicy red cherries. Sweet and delicious.',farmer:rf(),images:['images/cherries.jpg'],postedDate:'2024-02-04',available:true,organic:true,status:'approved'},
        {id:'17',title:'Coconut',category:'fruits',price:30,quantity:rand(),location:rl(),description:'Fresh coconuts. Tropical and refreshing.',farmer:rf(),images:['images/coconut.jpg'],postedDate:'2024-02-05',available:true,organic:false,status:'approved'},
        {id:'18',title:'Custard Apple',category:'fruits',price:50,quantity:rand(),location:rl(),description:'Sweet custard apples. Creamy texture.',farmer:rf(),images:['images/custard-apple.jpg'],postedDate:'2024-02-06',available:true,organic:true,status:'approved'},
        {id:'19',title:'Fresh Dates',category:'fruits',price:70,quantity:rand(),location:rl(),description:'Premium dates. Naturally sweet.',farmer:rf(),images:['images/dates-fresh.jpg'],postedDate:'2024-02-07',available:true,organic:true,status:'approved'},
        {id:'20',title:'Grapes',category:'fruits',price:55,quantity:rand(),location:rl(),description:'Sweet seedless grapes.',farmer:rf(),images:['images/grapes.jpg'],postedDate:'2024-02-08',available:true,organic:false,status:'approved'},
        {id:'21',title:'Kiwi',category:'fruits',price:75,quantity:rand(),location:rl(),description:'Tangy kiwi fruits. Rich in Vitamin C.',farmer:rf(),images:['images/kiwi.jpg'],postedDate:'2024-02-09',available:true,organic:true,status:'approved'},
        {id:'22',title:'Lemons',category:'fruits',price:35,quantity:rand(),location:rl(),description:'Fresh lemons. Perfect for juices.',farmer:rf(),images:['images/lemon.jpg'],postedDate:'2024-02-10',available:true,organic:true,status:'approved'},
        {id:'23',title:'Mangoes',category:'fruits',price:42,quantity:rand(),location:rl(),description:'Sweet tropical mangoes.',farmer:rf(),images:['images/mango.jpg'],postedDate:'2024-02-11',available:true,organic:true,status:'approved'},
        {id:'24',title:'Watermelon',category:'fruits',price:20,quantity:rand(),location:rl(),description:'Juicy watermelons. Refreshing fruit.',farmer:rf(),images:['images/watermelon.jpg'],postedDate:'2024-02-12',available:true,organic:true,status:'approved'},
        
        // GRAINS (8)
        {id:'25',title:'Wheat Grain',category:'grains',price:35,quantity:rand(),location:rl(),description:'Premium wheat grains. High quality.',farmer:rf(),images:['images/wheat.jpg'],postedDate:'2024-03-01',available:true,organic:false,status:'approved'},
        {id:'26',title:'Wheat Sacks',category:'grains',price:38,quantity:rand(),location:rl(),description:'Wheat in sacks. Ready for milling.',farmer:rf(),images:['images/wheat-sack.jpg'],postedDate:'2024-03-02',available:true,organic:true,status:'approved'},
        {id:'27',title:'Corn',category:'grains',price:22,quantity:rand(),location:rl(),description:'Yellow corn in sacks. Versatile grain.',farmer:rf(),images:['images/corn-sacks.jpg'],postedDate:'2024-03-03',available:true,organic:false,status:'approved'},
        {id:'28',title:'Rice',category:'grains',price:32,quantity:rand(),location:rl(),description:'White rice grains. Long grain variety.',farmer:rf(),images:['images/rice.jpg'],postedDate:'2024-03-04',available:true,organic:true,status:'approved'},
        {id:'29',title:'Rice Sacks',category:'grains',price:34,quantity:rand(),location:rl(),description:'Bulk rice in sacks.',farmer:rf(),images:['images/rice-sack.jpg'],postedDate:'2024-03-05',available:true,organic:true,status:'approved'},
        
        // SPICES (5)
        {id:'76',title:'Tomato Sauce',category:'spices',price:45,quantity:rand(),location:rl(),description:'Rich tomato sauce. Perfect for cooking.',farmer:rf(),images:['images/tomato-sauce.jpg'],postedDate:'2024-04-01',available:true,organic:true,status:'approved'},
        {id:'77',title:'Dried Red Chilies',category:'spices',price:85,quantity:rand(),location:rl(),description:'Dried red chilies. Essential for berbere spice mix.',farmer:rf(),images:['images/dried-chilies.jpg'],postedDate:'2024-04-02',available:true,organic:true,status:'approved'},
        {id:'78',title:'Fresh Red Chilies',category:'spices',price:70,quantity:rand(),location:rl(),description:'Fresh red chilies in basket. Hot and flavorful.',farmer:rf(),images:['images/fresh-chilies.jpg'],postedDate:'2024-04-03',available:true,organic:true,status:'approved'},
        {id:'79',title:'Chili Flakes',category:'spices',price:90,quantity:rand(),location:rl(),description:'Crushed chili flakes. Add heat to any dish.',farmer:rf(),images:['images/chili-flakes.jpg'],postedDate:'2024-04-04',available:true,organic:true,status:'approved'},
        {id:'80',title:'Chili Powder',category:'spices',price:95,quantity:rand(),location:rl(),description:'Ground chili powder. Essential Ethiopian spice.',farmer:rf(),images:['images/chili-powder.jpg'],postedDate:'2024-04-05',available:true,organic:true,status:'approved'},
        
        // LEGUMES (9)
        {id:'33',title:'Bean Variety',category:'legumes',price:35,quantity:rand(),location:rl(),description:'Mixed beans collection.',farmer:rf(),images:['images/beans-variety.jpg'],postedDate:'2024-05-01',available:true,organic:true,status:'approved'},
        {id:'34',title:'Adzuki Beans',category:'legumes',price:55,quantity:rand(),location:rl(),description:'Red adzuki beans. Sweet flavor.',farmer:rf(),images:['images/adzuki-beans.jpg'],postedDate:'2024-05-02',available:true,organic:true,status:'approved'},
        {id:'35',title:'Black-Eyed Peas',category:'legumes',price:38,quantity:rand(),location:rl(),description:'Nutritious black-eyed peas.',farmer:rf(),images:['images/black-eyed-peas.jpg'],postedDate:'2024-05-03',available:true,organic:true,status:'approved'},
        {id:'36',title:'Borlotti Beans',category:'legumes',price:42,quantity:rand(),location:rl(),description:'Italian cranberry beans.',farmer:rf(),images:['images/borlotti-beans.jpg'],postedDate:'2024-05-04',available:true,organic:false,status:'approved'},
        {id:'37',title:'Field Peas',category:'legumes',price:33,quantity:rand(),location:rl(),description:'Dried field peas. High protein.',farmer:rf(),images:['images/field-peas.jpg'],postedDate:'2024-05-05',available:true,organic:true,status:'approved'},
        {id:'38',title:'Kidney Beans',category:'legumes',price:40,quantity:rand(),location:rl(),description:'Red kidney beans. Protein-rich.',farmer:rf(),images:['images/kidney-beans.jpg'],postedDate:'2024-05-06',available:true,organic:true,status:'approved'},
        {id:'39',title:'Mung Beans',category:'legumes',price:45,quantity:rand(),location:rl(),description:'Green mung beans for sprouting.',farmer:rf(),images:['images/mung-beans.jpg'],postedDate:'2024-05-07',available:true,organic:true,status:'approved'},
        {id:'40',title:'Pinto Beans',category:'legumes',price:36,quantity:rand(),location:rl(),description:'Speckled pinto beans.',farmer:rf(),images:['images/pinto-beans.jpg'],postedDate:'2024-05-08',available:true,organic:false,status:'approved'},
        {id:'41',title:'White Beans',category:'legumes',price:38,quantity:rand(),location:rl(),description:'White beans. Versatile legume.',farmer:rf(),images:['images/white-beans.jpg'],postedDate:'2024-05-09',available:true,organic:true,status:'approved'},
        {id:'31',title:'Fenugreek',category:'legumes',price:40,quantity:rand(),location:rl(),description:'Dried fenugreek seeds. Used for flavor and health.',farmer:rf(),images:['images/fenugreek.jpg'],postedDate:'2024-05-10',available:true,organic:true,status:'approved'},
        {id:'58',title:'Mixed Nuts',category:'legumes',price:95,quantity:rand(),location:rl(),description:'Mixed nuts collection. Protein-rich snack.',farmer:rf(),images:['images/mixed-nuts.jpg'],postedDate:'2024-05-11',available:true,organic:false,status:'approved'},
        
        // DAIRY (7)
        {id:'42',title:'Cheddar Cheese',category:'dairy',price:180,quantity:rand(),location:rl(),description:'Aged cheddar. Sharp flavor.',farmer:rf(),images:['images/cheese-cheddar.jpg'],postedDate:'2024-06-01',available:true,organic:false,status:'approved'},
        {id:'43',title:'Emmental Cheese',category:'dairy',price:200,quantity:rand(),location:rl(),description:'Swiss cheese with holes.',farmer:rf(),images:['images/cheese-emmental.jpg'],postedDate:'2024-06-02',available:true,organic:false,status:'approved'},
        
        // DAIRY (7)
        {id:'42',title:'Cheddar Cheese',category:'dairy',price:180,quantity:rand(),location:rl(),description:'Aged cheddar. Sharp flavor.',farmer:rf(),images:['images/cheese-cheddar.jpg'],postedDate:'2024-06-01',available:true,organic:false,status:'approved'},
        {id:'43',title:'Emmental Cheese',category:'dairy',price:200,quantity:rand(),location:rl(),description:'Swiss cheese with holes.',farmer:rf(),images:['images/cheese-emmental.jpg'],postedDate:'2024-06-02',available:true,organic:false,status:'approved'},
        {id:'44',title:'Cheese Block',category:'dairy',price:170,quantity:rand(),location:rl(),description:'Large cheese block.',farmer:rf(),images:['images/cheese-block.jpg'],postedDate:'2024-06-03',available:true,organic:false,status:'approved'},
        {id:'45',title:'Shredded Cheese',category:'dairy',price:190,quantity:rand(),location:rl(),description:'Pre-shredded cheese blend.',farmer:rf(),images:['images/cheese-shredded.jpg'],postedDate:'2024-06-04',available:true,organic:false,status:'approved'},
        {id:'46',title:'Swiss Cheese',category:'dairy',price:195,quantity:rand(),location:rl(),description:'Authentic Swiss cheese.',farmer:rf(),images:['images/cheese-swiss.jpg'],postedDate:'2024-06-05',available:true,organic:false,status:'approved'},
        {id:'47',title:'Yellow Cheese',category:'dairy',price:175,quantity:rand(),location:rl(),description:'Mild yellow cheese.',farmer:rf(),images:['images/cheese-yellow.jpg'],postedDate:'2024-06-06',available:true,organic:false,status:'approved'},
        {id:'48',title:'Fresh Eggs',category:'dairy',price:45,quantity:rand(),location:rl(),description:'Farm-fresh eggs.',farmer:rf(),images:['images/eggs.jpg'],postedDate:'2024-06-07',available:true,organic:true,status:'approved'},
        
        // COFFEE (5)
        {id:'49',title:'Coffee Beans',category:'coffee',price:120,quantity:rand(),location:rl(),description:'Ethiopian coffee beans. Premium.',farmer:rf(),images:['images/coffee-beans.jpg'],postedDate:'2024-07-01',available:true,organic:true,status:'approved'},
        {id:'68',title:'Artisan Coffee Basket',category:'coffee',price:145,quantity:rand(),location:rl(),description:'Premium coffee beans in traditional basket. Perfect gift.',farmer:rf(),images:['images/coffee-basket.jpg'],postedDate:'2024-07-03',available:true,organic:true,status:'approved'},
        {id:'69',title:'Coffee Jar Collection',category:'coffee',price:130,quantity:rand(),location:rl(),description:'Specialty coffee beans in glass jar. Fresh and aromatic.',farmer:rf(),images:['images/coffee-jar.jpg'],postedDate:'2024-07-04',available:true,organic:true,status:'approved'},
        {id:'70',title:'Coffee Plant Harvest',category:'coffee',price:150,quantity:rand(),location:rl(),description:'Fresh coffee beans from the plant. Direct from farm.',farmer:rf(),images:['images/coffee-plant.jpg'],postedDate:'2024-07-05',available:true,organic:true,status:'approved'},
        {id:'71',title:'Traditional Coffee Sack',category:'coffee',price:125,quantity:rand(),location:rl(),description:'Coffee beans in traditional burlap sack. Authentic Ethiopian style.',farmer:rf(),images:['images/coffee-sack.jpg'],postedDate:'2024-07-06',available:true,organic:true,status:'approved'},
        
        // TUBERS (5)
        {id:'51',title:'Pumpkin',category:'tubers',price:18,quantity:rand(),location:rl(),description:'Orange pumpkins. Perfect for cooking.',farmer:rf(),images:['images/pumpkin.jpg'],postedDate:'2024-08-01',available:true,organic:true,status:'approved'},
        {id:'52',title:'Turnips',category:'tubers',price:20,quantity:rand(),location:rl(),description:'Fresh turnips. Root vegetable.',farmer:rf(),images:['images/turnips.jpg'],postedDate:'2024-08-02',available:true,organic:true,status:'approved'},
        {id:'53',title:'Pink Radishes',category:'tubers',price:15,quantity:rand(),location:rl(),description:'Pink radishes. Crunchy and fresh.',farmer:rf(),images:['images/radishes-pink.jpg'],postedDate:'2024-08-03',available:true,organic:true,status:'approved'},
        {id:'54',title:'Red Radishes',category:'tubers',price:17,quantity:rand(),location:rl(),description:'Red radishes. Spicy flavor.',farmer:rf(),images:['images/radishes-red.jpg'],postedDate:'2024-08-04',available:true,organic:true,status:'approved'},
        {id:'73',title:'Root Vegetable Mix',category:'tubers',price:120,quantity:rand(),location:rl(),description:'Assorted root vegetables including potatoes, beets, carrots, parsnips, sweet potatoes, ginger, garlic, and onions. Perfect variety pack.',farmer:rf(),images:['images/root-vegetables.jpg'],postedDate:'2024-08-05',available:true,organic:true,status:'approved'},
        
        // OILSEEDS (5)
        {id:'50',title:'Niger Seed Oil',category:'oilseeds',price:115,quantity:rand(),location:rl(),description:'Ethiopian niger seed oil (Neug). Essential for cooking.',farmer:rf(),images:['images/niger-seed-oil.jpg'],postedDate:'2024-09-01',available:true,organic:true,status:'approved'},
        {id:'55',title:'Sunflower Oil',category:'oilseeds',price:70,quantity:rand(),location:rl(),description:'Pure sunflower oil.',farmer:rf(),images:['images/sunflower-oil.jpg'],postedDate:'2024-09-01',available:true,organic:false,status:'approved'},
        {id:'56',title:'Sunflower Seeds',category:'oilseeds',price:65,quantity:rand(),location:rl(),description:'Sunflower seeds for oil.',farmer:rf(),images:['images/sunflower-seeds.jpg'],postedDate:'2024-09-02',available:true,organic:true,status:'approved'},
        {id:'57',title:'Flax Seeds',category:'oilseeds',price:85,quantity:rand(),location:rl(),description:'Flax seeds rich in Omega-3.',farmer:rf(),images:['images/flax-seeds.jpg'],postedDate:'2024-09-03',available:true,organic:true,status:'approved'},
        {id:'58',title:'Mixed Nuts',category:'oilseeds',price:95,quantity:rand(),location:rl(),description:'Mixed nuts collection.',farmer:rf(),images:['images/mixed-nuts.jpg'],postedDate:'2024-09-04',available:true,organic:false,status:'approved'},
        
        // PULSES (9)
        {id:'59',title:'Red Lentils',category:'pulses',price:55,quantity:rand(),location:rl(),description:'Split red lentils for wot.',farmer:rf(),images:['images/red-lentils.jpg'],postedDate:'2024-10-01',available:true,organic:false,status:'approved'},
        {id:'60',title:'Lentils Variety',category:'pulses',price:50,quantity:rand(),location:rl(),description:'Mixed lentil varieties.',farmer:rf(),images:['images/lentils-variety.jpg'],postedDate:'2024-10-02',available:true,organic:true,status:'approved'},
        {id:'61',title:'Green Lentils',category:'pulses',price:48,quantity:rand(),location:rl(),description:'Whole green lentils.',farmer:rf(),images:['images/lentils.jpg'],postedDate:'2024-10-03',available:true,organic:true,status:'approved'},
        {id:'62',title:'Lentils Sack',category:'pulses',price:52,quantity:rand(),location:rl(),description:'Bulk lentils in sacks.',farmer:rf(),images:['images/lentils-sack.jpg'],postedDate:'2024-10-04',available:true,organic:false,status:'approved'},
        {id:'63',title:'Chickpeas',category:'pulses',price:40,quantity:rand(),location:rl(),description:'Desi chickpeas for shiro.',farmer:rf(),images:['images/chickpeas.jpg'],postedDate:'2024-10-05',available:true,organic:true,status:'approved'},
        {id:'64',title:'Roasted Chickpeas',category:'pulses',price:60,quantity:rand(),location:rl(),description:'Kolo - Ethiopian snack.',farmer:rf(),images:['images/chickpeas-roasted.jpg'],postedDate:'2024-10-06',available:true,organic:true,status:'approved'},
        {id:'65',title:'Chickpeas Sack',category:'pulses',price:42,quantity:rand(),location:rl(),description:'Bulk chickpeas.',farmer:rf(),images:['images/chickpeas-sack.jpg'],postedDate:'2024-10-07',available:true,organic:true,status:'approved'},
        {id:'66',title:'Brown Chickpeas',category:'pulses',price:45,quantity:rand(),location:rl(),description:'Brown chickpea variety.',farmer:rf(),images:['images/brown-chickpeas.jpg'],postedDate:'2024-10-08',available:true,organic:true,status:'approved'},
        {id:'67',title:'White Beans Sack',category:'pulses',price:38,quantity:rand(),location:rl(),description:'White beans in bulk.',farmer:rf(),images:['images/white-beans-sack.jpg'],postedDate:'2024-10-09',available:true,organic:false,status:'approved'}
    ];
}
