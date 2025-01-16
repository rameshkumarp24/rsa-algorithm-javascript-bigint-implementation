# RSA Algorithm Implementation in JavaScript

This repository contains an implementation of the RSA encryption and decryption algorithm using JavaScript. The algorithm is designed to work with large prime numbers, ensuring secure key generation and message encryption.

---

## **Overview of RSA**

The RSA algorithm is a widely used asymmetric cryptographic technique based on the mathematical properties of large prime numbers. It involves:

1. **Key Generation**:
   - Generating two large prime numbers.
   - Computing the public and private keys.

2. **Encryption**:
   - Using the public key to encrypt messages.

3. **Decryption**:
   - Using the private key to decrypt messages.

---

## **Steps in the RSA Algorithm**

### 1. Generate Large Prime Numbers (p and q)
   - Generate two large prime numbers, `p` and `q`.

### 2. Calculate `n` and `φ(n)`
   - \( n = p \times q \)
   - \( φ(n) = (p - 1) \times (q - 1) \)

### 3. Choose Public Key Exponent (e)
   - Choose \( e \) such that \( 1 < e < φ(n) \) and gcd(e, φ(n)) = 1.

### 4. Calculate Private Key (d)
   - \( d \) is the modular multiplicative inverse of \( e \) modulo \( φ(n) \).

### 5. Encrypt and Decrypt Messages
   - **Encryption**: \( c = m^e \mod n \)
   - **Decryption**: \( m = c^d \mod n \)

---

## **Implementation Details**

### **Requirements**

To run the implementation, you need:
- **Node.js** installed on your system.
- The `big-integer` library for handling large numbers.

Install `big-integer` using:
```bash
npm install big-integer
```

---

### **Code Walkthrough**

#### **Helper Function to Generate Large Prime Numbers**
```javascript
function generateLargePrime(bits) {
  const min = bigInt(2).pow(bits - 1);
  const max = bigInt(2).pow(bits).subtract(1);
  let prime;
  do {
    prime = bigInt.randBetween(min, max);
  } while (!prime.isProbablePrime(20)); // 20 rounds of Miller-Rabin test
  return prime;
}
```

#### **Key Generation**
```javascript
function generateKeys(bits = 1024) {
  const p = generateLargePrime(bits / 2);
  const q = generateLargePrime(bits / 2);

  const n = p.multiply(q);
  const phi = p.subtract(1).multiply(q.subtract(1));

  let e = bigInt(65537); // Commonly used prime
  if (phi.gcd(e).notEquals(1)) {
    throw new Error("e and φ(n) are not coprime");
  }

  const d = e.modInv(phi);
  return { publicKey: { e, n }, privateKey: { d, n } };
}
```

#### **Encryption**
```javascript
function encrypt(message, publicKey) {
  const { e, n } = publicKey;
  const m = bigInt(message);
  return m.modPow(e, n);
}
```

#### **Decryption**
```javascript
function decrypt(ciphertext, privateKey) {
  const { d, n } = privateKey;
  const c = bigInt(ciphertext);
  return c.modPow(d, n);
}
```

#### **Example Usage**
```javascript
const { publicKey, privateKey } = generateKeys(512); // 512 bits for demonstration
console.log("Public Key:", publicKey);
console.log("Private Key:", privateKey);

const message = "12345"; // Replace with your numeric message
const ciphertext = encrypt(message, publicKey);
console.log("Encrypted:", ciphertext.toString());

const decryptedMessage = decrypt(ciphertext, privateKey);
console.log("Decrypted:", decryptedMessage.toString());
```

---

## **Notes**

- **Key Size**: For real-world applications, use at least a 2048-bit key size for better security.
- **Security Considerations**:
  - Implement proper message padding schemes like PKCS#1 to avoid vulnerabilities.
  - Ensure the generated primes are sufficiently large and random.
- **Libraries**: Consider using robust cryptographic libraries like [forge](https://github.com/digitalbazaar/forge) or [Node.js crypto](https://nodejs.org/api/crypto.html) for production.

---

## **How to Run**

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd rsa-implementation
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the script:
   ```bash
   node index.js
   ```

---

## **Contributing**

Feel free to open issues or submit pull requests for improvements or bug fixes.

---

## **License**

This project is licensed under the MIT License. See the LICENSE file for details.

