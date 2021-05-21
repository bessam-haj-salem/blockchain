const {BlockChain,Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1')

const myKey = ec.keyFromPrivate('6d2392f0a9c83c43b5bed1197e87630635f7c7fc70c7c4ce6c867d0407b6a9ba')
const myWalletAddress = myKey.getPublic('hex')


let savjeecoin = new BlockChain()
savjeecoin.minePendingTransactions(myWalletAddress )
const tx1 = new Transaction(myWalletAddress,'public key goes here',10)
tx1.signTransaction(myKey)
savjeecoin.addTransaction(tx1)

savjeecoin.minePendingTransactions(myWalletAddress )


// savjeecoin.createTransaction(new Transaction('address 1', 'address2', 100))
// savjeecoin.createTransaction(new Transaction('address 2', 'address1', 50))

console.log('\n Starting the miner...');


console.log('\n Balance of xavier is', savjeecoin.getBalanceOfAdress(myWalletAddress));

console.log('Is chain valid?', savjeecoin.isChainValid());