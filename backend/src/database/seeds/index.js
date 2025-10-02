const { seedDishes } = require('./dishSeed');

async function runAllSeeds() {
  console.log('🚀 Iniciando execução de todos os seeds...\n');

  try {
    // Executar seed de pratos
    await seedDishes();

    console.log('\n✅ Todos os seeds foram executados com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao executar seeds:', error.message);
    process.exit(1);
  }
}

async function main() {
  await runAllSeeds();
  process.exit(0);
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { runAllSeeds };