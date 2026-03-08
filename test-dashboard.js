// Script temporário para testar o endpoint do dashboard
const axios = require('axios');

const baseURL = 'http://localhost:8080/api';

async function testDashboard() {
  try {
    console.log('Testando endpoint /api/dashboard...\n');
    
    const response = await axios.get(`${baseURL}/dashboard`, {
      headers: {
        'X-Tenant-ID': 'oficina-teste' // Ajuste conforme necessário
      }
    });
    
    console.log('Resposta do Dashboard:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n=== ANÁLISE DOS VALORES ===');
    console.log(`Ordens Abertas Hoje: ${response.data.ordensAbertasHoje}`);
    console.log(`Receita Orçamentos: R$ ${response.data.receitaOrcamentos}`);
    console.log(`Receita Ordens: R$ ${response.data.receitaOrdensServico}`);
    console.log(`Receita Mensal: R$ ${response.data.receitaMensal}`);
    
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

testDashboard();
