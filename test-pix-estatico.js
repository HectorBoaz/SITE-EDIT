// Script para testar QR code PIX ESTÁTICO (sem valor fixo)

const PIX_KEY = '3e2c6f86-3e5a-4abe-9200-894843d02454'
const MERCHANT_NAME = 'Astral Legacy'
const MERCHANT_CITY = 'BRASILIA'

console.log('🧪 Testando QR Code PIX ESTÁTICO...\n')

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

function generateStaticPixCode() {
  const txId = generateTransactionId()
  
  // Construir campos EMV no formato TLV
  const payloadFormatIndicator = '000201'
  
  // Merchant Account Information (Tag 26)
  const gui = '0014br.gov.bcb.pix'
  const keyTag = '01'
  const keyLength = String(PIX_KEY.length).padStart(2, '0')
  const key = PIX_KEY
  const merchantAccountContent = gui + keyTag + keyLength + key
  const merchantAccountInfo = '26' + String(merchantAccountContent.length).padStart(2, '0') + merchantAccountContent
  
  // Merchant Category Code
  const merchantCategoryCode = '52040000'
  
  // Transaction Currency (BRL = 986)
  const transactionCurrency = '5303986'
  
  // NÃO ADICIONAR Tag 54 (valor) para QR estático
  
  // Country Code
  const countryCode = '5802BR'
  
  // Merchant Name
  const merchantNameNormalized = MERCHANT_NAME.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantName = '59' + String(merchantNameNormalized.length).padStart(2, '0') + merchantNameNormalized
  
  // Merchant City
  const merchantCityNormalized = MERCHANT_CITY.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantCity = '60' + String(merchantCityNormalized.length).padStart(2, '0') + merchantCityNormalized
  
  // Additional Data Field Template (Tag 62)
  const txIdField = '05' + String(txId.length).padStart(2, '0') + txId
  const additionalData = '62' + String(txIdField.length).padStart(2, '0') + txIdField
  
  // Montar payload sem CRC
  const payload = payloadFormatIndicator + 
                  merchantAccountInfo + 
                  merchantCategoryCode + 
                  transactionCurrency + 
                  countryCode + 
                  merchantName + 
                  merchantCity + 
                  additionalData + 
                  '6304'
  
  // Calcular CRC16
  const crc = calculateCRC16(payload)
  
  return payload + crc
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📱 CÓDIGO DO SEU APP (fornecido):')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
const codigoApp = '00020126580014br.gov.bcb.pix01363e2c6f86-3e5a-4abe-9200-894843d024545204000053039865802BR5925LORRAN SALDANHA DE OLIVEI6009Sao Paulo62290525REC68F0153D322FA4078750486304CE4F'
console.log(codigoApp)
console.log(`📏 Tamanho: ${codigoApp.length} caracteres`)
console.log('')

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🆕 CÓDIGO GERADO (estático, sem valor):')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
const codigoGerado = generateStaticPixCode()
console.log(codigoGerado)
console.log(`📏 Tamanho: ${codigoGerado.length} caracteres`)
console.log('')

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 COMPARAÇÃO:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Comparar início
const inicio = codigoGerado.substring(0, 70)
const inicioApp = codigoApp.substring(0, 70)
console.log(`\n🔍 Início (70 primeiros chars):`)
console.log(`   App:    ${inicioApp}`)
console.log(`   Gerado: ${inicio}`)
console.log(`   ${inicio === inicioApp ? '✅ IGUAL' : '❌ DIFERENTE'}`)

// Chave PIX
const chavePix = '3e2c6f86-3e5a-4abe-9200-894843d02454'
console.log(`\n🔑 Chave PIX:`)
console.log(`   ${chavePix}`)
console.log(`   App:    ${codigoApp.includes(chavePix) ? '✅' : '❌'} Contém`)
console.log(`   Gerado: ${codigoGerado.includes(chavePix) ? '✅' : '❌'} Contém`)

// Tags principais
console.log(`\n📋 Tags Principais:`)
console.log(`   000201 (Payload):        App: ${codigoApp.startsWith('000201') ? '✅' : '❌'}  Gerado: ${codigoGerado.startsWith('000201') ? '✅' : '❌'}`)
console.log(`   2658 (Account Info):     App: ${codigoApp.includes('2658') ? '✅' : '❌'}  Gerado: ${codigoGerado.includes('2658') ? '✅' : '❌'}`)
console.log(`   52040000 (Category):     App: ${codigoApp.includes('52040000') ? '✅' : '❌'}  Gerado: ${codigoGerado.includes('52040000') ? '✅' : '❌'}`)
console.log(`   5303986 (Currency BRL):  App: ${codigoApp.includes('5303986') ? '✅' : '❌'}  Gerado: ${codigoGerado.includes('5303986') ? '✅' : '❌'}`)
console.log(`   5802BR (Country):        App: ${codigoApp.includes('5802BR') ? '✅' : '❌'}  Gerado: ${codigoGerado.includes('5802BR') ? '✅' : '❌'}`)
console.log(`   6304 (CRC):              App: ${codigoApp.includes('6304') ? '✅' : '❌'}  Gerado: ${codigoGerado.includes('6304') ? '✅' : '❌'}`)

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('✨ TESTE NO CELULAR:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Copie o código gerado acima')
console.log('2. Abra o app do banco/PicPay')
console.log('3. Escolha "PIX Copia e Cola"')
console.log('4. Cole o código')
console.log('5. O app deve reconhecer:')
console.log('   - Beneficiário: Astral Legacy')
console.log('   - Chave: 3e2c6f86-3e5a-4abe-9200-894843d02454')
console.log('   - Valor: VOCÊ digita (QR estático)')
console.log('')

