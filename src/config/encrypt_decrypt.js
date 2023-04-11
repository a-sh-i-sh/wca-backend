//Checking the crypto module
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
const EncryptedData = (id) => {
  try {
    let text = id.toString();
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
    //    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  } catch (err) {}
};

// Decrypting text
const DecryptedData = (text) => {
  try {
    // let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    return err;
  }
};

module.exports = { EncryptedData, DecryptedData };
