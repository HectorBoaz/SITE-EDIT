// Script para testar a geração de PIX
// Para usar: node --loader ts-node/esm test-pix-validation.mjs

const PIX_KEY = '3e2c6f86-3e5a-4abe-9200-894843d02454'
const MERCHANT_NAME = 'Astral Legacy'
const MERCHANT_CITY = 'BRASILIA'

console.log('🧪 Testando geração de PIX...\n')

function generateTransactionId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `AL${timestamp}${random}`.toUpperCase()
}

function calculateCRC16(data) {
  let crc = 0xFFFF
  
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
  }
  
  crc = crc & 0xFFFF
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function generatePixCopyPaste(amount, description) {
  const txId = generateTransactionId()
  
  // Construir campos EMV no formato TLV (Tag-Length-Value)
  // Seguindo o formato exato do PicPay/código fornecido pelo usuário
  const payloadFormatIndicator = '000201'
  
  // Merchant Account Information (Tag 26)
  // Formato: 26[length]0014br.gov.bcb.pix01[key_length][key]
  const gui = '0014br.gov.bcb.pix' // 18 caracteres
  const keyTag = '01'
  const keyLength = String(PIX_KEY.length).padStart(2, '0')
  const key = PIX_KEY
  const merchantAccountContent = gui + keyTag + keyLength + key
  const merchantAccountInfo = '26' + String(merchantAccountContent.length).padStart(2, '0') + merchantAccountContent
  
  // Merchant Category Code
  const merchantCategoryCode = '52040000'
  
  // Transaction Currency (BRL = 986)
  const transactionCurrency = '5303986'
  
  // Transaction Amount (com valor fixo)
  const amountStr = amount.toFixed(2)
  const transactionAmount = '54' + String(amountStr.length).padStart(2, '0') + amountStr
  
  // Country Code
  const countryCode = '5802BR'
  
  // Merchant Name (normalizando para remover acentos)
  const merchantNameNormalized = MERCHANT_NAME.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantName = '59' + String(merchantNameNormalized.length).padStart(2, '0') + merchantNameNormalized
  
  // Merchant City (normalizando para remover acentos)
  const merchantCityNormalized = MERCHANT_CITY.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantCity = '60' + String(merchantCityNormalized.length).padStart(2, '0') + merchantCityNormalized
  
  // Additional Data Field Template (Tag 62)
  const txIdField = '05' + String(txId.length).padStart(2, '0') + txId
  const additionalData = '62' + String(txIdField.length).padStart(2, '0') + txIdField
  
  // Montar payload sem CRC (SEM o campo Point of Initiation)
  const payload = payloadFormatIndicator + 
                  merchantAccountInfo + 
                  merchantCategoryCode + 
                  transactionCurrency + 
                  transactionAmount + 
                  countryCode + 
                  merchantName + 
                  merchantCity + 
                  additionalData + 
                  '6304'
  
  // Calcular CRC16
  const crc = calculateCRC16(payload)
  
  return payload + crc
}

// Testar diferentes valores
const testCases = [
  { amount: 29.90, description: 'VIP Cosmo' },
  { amount: 49.90, description: 'VIP Astral' },
  { amount: 79.90, description: 'VIP Legacy' }
]

testCases.forEach((testCase, index) => {
  console.log(`📋 Teste ${index + 1}:`)
  console.log(`   Plano: ${testCase.description}`)
  console.log(`   Valor: R$ ${testCase.amount}`)
  
  try {
    const pixCode = generatePixCopyPaste(testCase.amount, testCase.description)
    
    console.log(`   ✅ PIX Copia e Cola:`)
    console.log(`   ${pixCode}`)
    console.log(`   📏 Tamanho: ${pixCode.length} caracteres`)
    console.log('')
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }
})

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🎯 Informações da Chave PIX:')
console.log(`   Chave: ${PIX_KEY}`)
console.log(`   Nome: ${MERCHANT_NAME}`)
console.log(`   Cidade: ${MERCHANT_CITY}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('\n✨ Para testar:')
console.log('   1. Copie o código PIX gerado acima')
console.log('   2. Abra o app do seu banco ou PicPay')
console.log('   3. Escolha "PIX Copia e Cola"')
console.log('   4. Cole o código')
console.log('   5. Verifique se os dados estão corretos')
console.log('')
