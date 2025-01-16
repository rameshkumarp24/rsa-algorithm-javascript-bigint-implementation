const bigInt = require("big-integer");

// Helper to generate a random large prime number
function generateLargePrime(bits) {
  const min = bigInt(2).pow(bits - 1);
  const max = bigInt(2).pow(bits).subtract(1);
  let prime;
  do {
    prime = bigInt.randBetween(min, max);
  } while (!prime.isProbablePrime(20)); // 20 rounds of Miller-Rabin test
  return prime;
}

// RSA key generation
function generateKeys(bits = 1024) {
  // Step 1: Generate two large primes p and q
  const p = generateLargePrime(bits / 2);
  const q = generateLargePrime(bits / 2);

  // Step 2: Calculate n and φ(n)
  const n = p.multiply(q);
  const phi = p.subtract(1).multiply(q.subtract(1));

  // Step 3: Choose e (public key exponent)
  let e = bigInt(65537); // Commonly used prime
  if (phi.gcd(e).notEquals(1)) {
    throw new Error("e and φ(n) are not coprime");
  }

  // Step 4: Calculate d (private key exponent)
  const d = e.modInv(phi);

  return { publicKey: { e, n }, privateKey: { d, n } };
}

// Encryption: c = m^e mod n
function encrypt(message, publicKey) {
  const { e, n } = publicKey;
  const m = bigInt(message);
  return m.modPow(e, n);
}

// Decryption: m = c^d mod n
function decrypt(ciphertext, privateKey) {
  const { d, n } = privateKey;
  const c = bigInt(ciphertext);
  return c.modPow(d, n);
}

// Example usage
const { publicKey, privateKey } = generateKeys(512); // 512 bits for demonstration
console.log("Public Key:", publicKey);
console.log("Private Key:", privateKey);

const message = "12345"; // Replace with your numeric message
const ciphertext = encrypt(message, publicKey);
console.log("Encrypted:", ciphertext.toString());

const decryptedMessage = decrypt(ciphertext, privateKey);
console.log("Decrypted:", decryptedMessage.toString());
