const prisma = require('../prisma');

const dishesData = [
  {
    name: 'Salmão Grelhado',
    description: 'Salmão fresco grelhado com legumes da estação e molho especial.',
    price: 55.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop'
  },
  {
    name: 'Risoto de Cogumelos',
    description: 'Risoto cremoso com uma variedade de cogumelos frescos e parmesão.',
    price: 48.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop'
  },
  {
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer artesanal com queijo, alface e tomate.',
    price: 32.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'
  },
  {
    name: 'Tiramisu',
    description: 'Sobremesa clássica italiana com camadas de biscoitos e mascarpone.',
    price: 25.00,
    category: 'DESSERT',
    active: true,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop'
  },
  {
    name: 'Vinho Tinto Premium',
    description: 'Uma garrafa de vinho tinto premium para acompanhar sua refeição.',
    price: 75.00,
    category: 'DRINK',
    active: true,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop'
  },
  {
    name: 'Suco de Laranja Fresco',
    description: 'Suco de laranja natural, fresco e sem conservantes.',
    price: 12.00,
    category: 'DRINK',
    active: true,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop'
  },
  {
    name: 'Salada Caesar',
    description: 'Salada fresca com alface, croutons, parmesão e molho caesar.',
    price: 28.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop'
  },
  {
    name: 'Pudim de Leite',
    description: 'Pudim de leite condensado com calda de caramelo.',
    price: 18.00,
    category: 'DESSERT',
    active: true,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop'
  }
];

async function seedDishes() {
  console.log('🌱 Iniciando seed de pratos...');

  try {
    // Verificar se já existem pratos no banco
    const existingDishes = await prisma.dish.count();
    
    if (existingDishes > 0) {
      console.log(`⚠️  Já existem ${existingDishes} pratos no banco. Pulando seed...`);
      return;
    }

    // Inserir pratos usando createMany para melhor performance
    const result = await prisma.dish.createMany({
      data: dishesData
    });

    console.log(`✅ ${result.count} pratos inseridos com sucesso!`);

    // Listar os pratos criados
    const createdDishes = await prisma.dish.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        price: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('\n📋 Pratos criados:');
    createdDishes.forEach(dish => {
      console.log(`  • ${dish.name} (${dish.category}) - R$ ${dish.price.toFixed(2)}`);
    });

  } catch (error) {
    console.error('❌ Erro ao executar seed de pratos:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await seedDishes();
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { seedDishes, dishesData };