// Serviço para geração de PIX real
export interface PixData {
  merchantName: string
  merchantCity: string
  amount: number
  description: string
  pixKey: string
  txId: string
}

export const PIX_CONFIG = {
  MERCHANT_NAME: 'Astral Legacy',
  MERCHANT_CITY: 'BRASILIA',
  PIX_KEY: '3e2c6f86-3e5a-4abe-9200-894843d02454', // Sua chave PicPay
  MERCHANT_ACCOUNT: 'BR', // Brasil
}

export function generatePixCode(amount: number, description: string): string {
  const txId = generateTransactionId()
  
  const pixData: PixData = {
    merchantName: PIX_CONFIG.MERCHANT_NAME,
    merchantCity: PIX_CONFIG.MERCHANT_CITY,
    amount,
    description,
    pixKey: PIX_CONFIG.PIX_KEY,
    txId
  }

  // Gerar código PIX no formato EMV (EMVCo)
  const pixCode = buildPixCode(pixData)
  
  return pixCode
}

function generateTransactionId(): string {
  // Gerar ID único para transação
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `AL${timestamp}${random}`.toUpperCase()
}

function buildPixCode(pixData: PixData): string {
  // Construir código PIX no formato EMV
  const payloadFormatIndicator = '01' + '02' + '01' // Payload Format Indicator
  const pointOfInitiationMethod = '02' + '02' + '12' // Point of Initiation Method (dynamic)
  
  // Merchant Account Information - PicPay
  const merchantAccountInfo = buildMerchantAccountInfo(pixData.pixKey)
  
  // Merchant Category Code
  const merchantCategoryCode = '52' + '04' + '0000' // MCC para jogos/entretenimento
  
  // Transaction Currency
  const transactionCurrency = '53' + '03' + '986' // BRL
  
  // Transaction Amount
  const transactionAmount = '54' + formatAmount(pixData.amount)
  
  // Country Code
  const countryCode = '58' + '02' + 'BR'
  
  // Merchant Name
  const merchantName = '59' + formatString(pixData.merchantName)
  
  // Merchant City
  const merchantCity = '60' + formatString(pixData.merchantCity)
  
  // Additional Data Field Template
  const additionalData = '62' + buildAdditionalData(pixData)
  
  // CRC16
  const crc = '63' + '04'
  
  // Construir payload completo
  const payload = payloadFormatIndicator + 
                 pointOfInitiationMethod + 
                 merchantAccountInfo + 
                 merchantCategoryCode + 
                 transactionCurrency + 
                 transactionAmount + 
                 countryCode + 
                 merchantName + 
                 merchantCity + 
                 additionalData + 
                 crc

  // Calcular CRC16
  const crcValue = calculateCRC16(payload + '6304')
  
  return payload + crcValue
}

function buildMerchantAccountInfo(pixKey: string): string {
  // PicPay Merchant Account Information
  const gui = '0014br.gov.bcb.pix' // GUI do Banco Central
  const pixKeyData = '01' + formatString(pixKey)
  
  const merchantAccountInfo = gui + pixKeyData
  const length = merchantAccountInfo.length.toString().padStart(2, '0')
  return '26' + length + merchantAccountInfo
}

function buildAdditionalData(pixData: PixData): string {
  // Transaction ID
  const txId = '05' + formatString(pixData.txId)
  
  const additionalData = txId
  return formatString(additionalData)
}

function formatAmount(amount: number): string {
  const formatted = amount.toFixed(2)
  return String(formatted.length).padStart(2, '0') + formatted
}

function formatString(str: string): string {
  return String(str.length).padStart(2, '0') + str
}

function calculateCRC16(data: string): string {
  // Implementação simplificada do CRC16 para PIX
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

// Função para gerar PIX Copia e Cola (formato mais simples)
export function generatePixCopyPaste(amount: number, description: string): string {
  const txId = generateTransactionId()
  
  // Construir campos EMV no formato TLV (Tag-Length-Value)
  // Seguindo o formato exato do PicPay
  const payloadFormatIndicator = '000201' // Payload Format Indicator
  
  // Merchant Account Information (Tag 26)
  // Formato: 26[length]0014br.gov.bcb.pix01[key_length][key]
  const gui = '0014br.gov.bcb.pix' // 18 caracteres
  const keyTag = '01'
  const keyLength = String(PIX_CONFIG.PIX_KEY.length).padStart(2, '0')
  const key = PIX_CONFIG.PIX_KEY
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
  
  // Merchant Name (normalizando o nome para evitar problemas)
  const merchantNameNormalized = PIX_CONFIG.MERCHANT_NAME.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantName = '59' + String(merchantNameNormalized.length).padStart(2, '0') + merchantNameNormalized
  
  // Merchant City (normalizando a cidade)
  const merchantCityNormalized = PIX_CONFIG.MERCHANT_CITY.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantCity = '60' + String(merchantCityNormalized.length).padStart(2, '0') + merchantCityNormalized
  
  // Additional Data Field Template (Tag 62)
  const txIdField = '05' + String(txId.length).padStart(2, '0') + txId
  const additionalData = '62' + String(txIdField.length).padStart(2, '0') + txIdField
  
  // Montar payload sem CRC
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

// Função para gerar PIX estático (sem valor fixo)
export function generateStaticPixCode(): string {
  const txId = generateTransactionId()
  
  // Construir campos EMV no formato TLV (Tag-Length-Value)
  const payloadFormatIndicator = '000201'
  
  // Merchant Account Information (Tag 26)
  const gui = '0014br.gov.bcb.pix'
  const keyTag = '01'
  const keyLength = String(PIX_CONFIG.PIX_KEY.length).padStart(2, '0')
  const key = PIX_CONFIG.PIX_KEY
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
  const merchantNameNormalized = PIX_CONFIG.MERCHANT_NAME.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantName = '59' + String(merchantNameNormalized.length).padStart(2, '0') + merchantNameNormalized
  
  // Merchant City
  const merchantCityNormalized = PIX_CONFIG.MERCHANT_CITY.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const merchantCity = '60' + String(merchantCityNormalized.length).padStart(2, '0') + merchantCityNormalized
  
  // Additional Data Field Template (Tag 62)
  const txIdField = '05' + String(txId.length).padStart(2, '0') + txId
  const additionalData = '62' + String(txIdField.length).padStart(2, '0') + txIdField
  
  // Montar payload sem CRC (SEM valor fixo)
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

// Função para validar se o código PIX está correto
export function validatePixCode(pixCode: string): boolean {
  try {
    // Verificar se começa com 000201
    if (!pixCode.startsWith('000201')) {
      return false
    }
    
    // Verificar se termina com 6304 + CRC
    if (!pixCode.endsWith('6304')) {
      return false
    }
    
    // Verificar tamanho mínimo
    if (pixCode.length < 50) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}
