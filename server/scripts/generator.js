const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")

const privateKey = secp.secp256k1.utils.randomPrivateKey()
const publicKey = secp.secp256k1.getPublicKey(privateKey)

console.log('Private key:', toHex(privateKey))
console.log('Public key:', toHex(publicKey))
console.log('Address:', toHex(publicKey.slice(1).slice(-20)));
