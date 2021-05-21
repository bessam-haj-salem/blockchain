const crypto = require('crypto');
const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
class Transaction {
  constructor(fromAdress, toAdress, amount) {
    this.fromAdress = fromAdress;
    this.toAdress = toAdress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAdress + this.toAdress + this.amount).toString();
  }

  signTransaction(signinKey) {
    if (signinKey.getPublic("hex") !== this.fromAdress) {
      throw new Error("you cannot sign transactions for other wallets");
    }
    const hashTx = this.calculateHash();
    const sig = signinKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAdress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAdress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("block mined: " + this.hash);
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("01/01/2021", "Genesis Block", "0");
  }
  getLastetBlock() {
    return this.chain[this.chain.length - 1];
  }
  // addBlock(newBlock) {
  //     newBlock.previousHash = this.getLastetBlock().hash
  //     // newBlock.hash = newBlock.calculateHash()
  //     newBlock.mineBlock(this.difficulty)
  //     this.chain.push(newBlock)
  // }
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("block successfully mined!");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }
  addTransaction(transaction) {
    if(!transaction.toAdress || !transaction.fromAdress) {
        throw new Error('Transaction must include from and to address')
    }
    if(!transaction.isValid() ) {
        throw new Error('cannot add invalid transaction to chain')
    }
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAdress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAdress === address) {
          balance -= trans.amount;
        }
        if (trans.toAdress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(!currentBlock.hasValidTransactions()) {
          return "blockchain invalid"
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return "blockchain invalid";
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return "blockchain invalid";
      }
    }
    return "blockchain  valid";
  }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;
