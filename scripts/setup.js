#!/usr/bin/env node

/**
 * Script de configuração inicial do projeto Astral Legacy
 * Execute com: node scripts/setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando configuração do Astral Legacy...\n');

// Verificar se node_modules existe
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Instalando dependências...');
  console.log('Execute: npm install\n');
} else {
  console.log('✅ Dependências já instaladas\n');
}

// Verificar pasta public/images
const publicImagesPath = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImagesPath)) {
  console.log('⚠️  Pasta public/images não encontrada');
  console.log('As imagens devem estar em public/images/\n');
} else {
  console.log('✅ Pasta public/images existe\n');
  
  // Verificar imagens essenciais
  const requiredImages = [
    '512xnewhypixel.png',
    'wallpaperwebsite2.jpg'
  ];
  
  const missingImages = requiredImages.filter(img => {
    return !fs.existsSync(path.join(publicImagesPath, img));
  });
  
  if (missingImages.length > 0) {
    console.log('⚠️  Imagens faltando:');
    missingImages.forEach(img => console.log(`   - ${img}`));
    console.log();
  } else {
    console.log('✅ Todas as imagens essenciais presentes\n');
  }
}

// Verificar arquivo .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('⚠️  Arquivo .env.local não encontrado');
  console.log('Crie um baseado em .env.example\n');
} else {
  console.log('✅ Arquivo .env.local existe\n');
}

// Resumo
console.log('📋 Próximos passos:\n');
console.log('1. npm install          # Instalar dependências');
console.log('2. npm run dev          # Iniciar servidor de desenvolvimento');
console.log('3. Abrir http://localhost:3000\n');

console.log('📚 Para mais informações, consulte:');
console.log('   - README.md');
console.log('   - GETTING_STARTED.md\n');

console.log('✨ Configuração concluída!\n');

