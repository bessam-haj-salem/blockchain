

truffle console

truffle compile

truffle migrate --reset 

mDai = await DaiToken.deployed() //smart contract info


web3.eth.getAccounts().then(function(acc){ accounts = acc }) // create array of accounts 


balanceAccount1 = await mDai.balanceOf(accounts[1]) // give the balance of account 1 of DAI token

balanceAccount1.toString()

formattedBalance = web3.utils.fromWei(balanceAccount1)  // give a human readable amount (it remove the 18 zeros decimals)


truffle test



// understand area of storage of the VM of etheruem :
https://ethereum.stackexchange.com/questions/1701/what-does-the-keyword-memory-do-exactly
