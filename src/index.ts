import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from 'tweetnacl'
import bs58 from 'bs58';
import { green, reset, red } from './ansi-colorcodes';

const mnemonic = generateMnemonic(); // or you can use yours to import a wallet, if have any
console.log(`secret phrase: ${green}${mnemonic}${reset}`)
console.log(`${red}warning: if you wish to use these generated solana wallets, make sure you backup/copy the above secret phrase. ignore if done already.${reset}`)

const seed = mnemonicToSeedSync(mnemonic);
console.log('\nmaster seed:', seed.toString('hex'));

const generateWalletKeyPairs = (noOfAcc: number) => {
  for (let i = 0; i < noOfAcc; i++) {
    console.log('\n--- account:', i + 1);
    const solanaDerivationPath = `m/44'/501'/${i}'/0'`;

    const derivedSeed = derivePath(solanaDerivationPath, seed.toString("hex")).key;
    console.log('relative seed:', derivedSeed.toString('hex'));
    
    const privateKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    console.log(`private key: ${green}${bs58.encode(privateKey)}${reset}`);
    
    const walletAddress = Keypair.fromSecretKey(privateKey).publicKey.toBase58();
    console.log(`wallet address: ${green}${walletAddress}${reset}`)
    console.log('---')
  }
}

// pass number of accounts to be generated, eg: 1, 2, ... n
generateWalletKeyPairs(3)