# 📊 Comparação de Códigos PIX

## Código PIX Fornecido (Funciona no App)

```
00020126580014br.gov.bcb.pix01363e2c6f86-3e5a-4abe-9200-894843d024545204000053039865802BR5925LORRAN SALDANHA DE OLIVEI6009Sao Paulo62290525REC68F0153D322FA4078750486304CE4F
```

### Decomposição:
| Tag | Campo | Valor |
|-----|-------|-------|
| 00 | Payload Format | 01 |
| 26 | Merchant Account | `580014br.gov.bcb.pix01363e2c6f86-3e5a-4abe-9200-894843d02454` |
| 52 | Category Code | 0000 |
| 53 | Currency | 986 (BRL) |
| **54** | **Amount** | **NÃO TEM (QR estático)** |
| 58 | Country | BR |
| 59 | Merchant Name | LORRAN SALDANHA DE OLIVEI (25 chars) |
| 60 | Merchant City | Sao Paulo (9 chars) |
| 62 | Additional Data | `0525REC68F0153D322FA4078750486` |
| 63 | CRC16 | CE4F |

**Total:** ~160 caracteres (sem campo de valor)

---

## Nosso Código PIX (Gerado Agora)

```
00020126580014br.gov.bcb.pix01363e2c6f86-3e5a-4abe-9200-894843d02454520400005303986540529.905802BR5913Astral Legacy6008BRASILIA62190515ALMGSIRZK2P7GQQ63048BE8
```

### Decomposição:
| Tag | Campo | Valor |
|-----|-------|-------|
| 00 | Payload Format | 01 |
| 26 | Merchant Account | `580014br.gov.bcb.pix01363e2c6f86-3e5a-4abe-9200-894843d02454` |
| 52 | Category Code | 0000 |
| 53 | Currency | 986 (BRL) |
| **54** | **Amount** | **05** + **29.90** (QR dinâmico) |
| 58 | Country | BR |
| 59 | Merchant Name | Astral Legacy (13 chars) |
| 60 | Merchant City | BRASILIA (8 chars) |
| 62 | Additional Data | `0515ALMGSIRZK2P7GQQ` |
| 63 | CRC16 | 8BE8 |

**Total:** 158 caracteres (com valor fixo)

---

## ✅ O Que Está Correto

1. ✅ **Mesma chave PIX**: `3e2c6f86-3e5a-4abe-9200-894843d02454`
2. ✅ **Formato EMV TLV**: Estrutura Tag-Length-Value correta
3. ✅ **CRC16 calculado**: Checksum válido
4. ✅ **Campos obrigatórios**: Todos presentes

---

## 🔍 Diferenças Principais

### 1. **Campo de Valor (Tag 54)**
- **Código do app**: NÃO tem (QR estático - usuário digita o valor)
- **Nosso código**: TEM (QR dinâmico - valor pré-definido)

### 2. **Nome do Beneficiário (Tag 59)**
- **Código do app**: `LORRAN SALDANHA DE OLIVEI` (25 chars, truncado)
- **Nosso código**: `Astral Legacy` (13 chars)

### 3. **Cidade (Tag 60)**
- **Código do app**: `Sao Paulo` (9 chars)
- **Nosso código**: `BRASILIA` (8 chars)

### 4. **Transaction ID (Tag 62)**
- **Código do app**: `REC68F0153D322FA4078750486` (25 chars)
- **Nosso código**: `ALMGSIRZK2P7GQQ` (15 chars)

---

## 💡 Tipos de QR Code PIX

### QR Code Estático (Código do App)
- ❌ **SEM valor fixo** (tag 54 ausente)
- ✅ Usuário digita o valor ao pagar
- ✅ Reutilizável infinitamente
- ✅ Ideal para receber valores variados

### QR Code Dinâmico (Nosso Código)
- ✅ **COM valor fixo** (tag 54 presente)
- ✅ Valor pré-definido no código
- ✅ Uso único (um QR por transação)
- ✅ Ideal para e-commerce e vendas específicas

---

## 🎯 Solução

Ambos os códigos estão **CORRETOS**, mas servem para propósitos diferentes:

1. **Código do app** → Para receber qualquer valor (caixa, doações, etc.)
2. **Nosso código** → Para vendas com valor fixo (planos VIP)

Se você quer testar com o app, use um **QR estático SEM valor**. Para o sistema de vendas, use o **QR dinâmico COM valor** que já está implementado.

---

## 🧪 Como Testar

```bash
# Gerar código de teste
node test-pix.js

# Copiar o código PIX gerado
# Colar no app do banco/PicPay
# Verificar se mostra:
#   - Beneficiário: Astral Legacy
#   - Chave: 3e2c6f86-3e5a-4abe-9200-894843d02454
#   - Valor: R$ 29,90 (ou outro valor do plano)
```

Se o app do banco NÃO aceitar QR code dinâmico (com valor), implementaremos a versão estática também.

