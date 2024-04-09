// import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// const suppliedPublicKey = process.argv[2];
// if (!suppliedPublicKey) {
//     throw new Error("Provide a public key to check the balancce of!");
// }

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// const publicKey = new PublicKey(suppliedPublicKey);

// const balanceInLamports = await connection.getBalance(publicKey);

// const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

// console.log(
//     `✅ Finished! The balance of the wallet at address ${publicKey} is ${balanceInSOL}!`
// );


// import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
// import bs58 from 'bs58';
// import axios from 'axios';

// async function isSolanaAddressValid(address: string): Promise<boolean> {
//     try {
//         // Check if the address is a valid base58 encoded string
//         const decodedAddress = bs58.decode(address);

//         // Check if the decoded address has correct length
//         if (decodedAddress.length !== 32) {
//             return false;
//         }

//         // Connect to Solana node and check if account exists
//         const rpcUrl = "https://api.devnet.solana.com";
//         const response = await axios.post(rpcUrl, {
//             jsonrpc: "2.0",
//             id: 1,
//             method: "getAccountInfo",
//             params: [address]
//         });

//         if (response.status === 200) {
//             const result = response.data.result;
//             return result !== null;
//         } else {
//             console.error("Failed to connect to Solana node:", response.statusText);
//             return false;
//         }
//     } catch (error) {
//         console.error("Error:", error.message);
//         return false;
//     }
    
// }

// const suppliedPublicKey = "5Dq8MMSKpcqMDNsJznZFXAcasBZrMSpp6sGExPL3JdFf";
// if (!suppliedPublicKey) {
//     throw new Error("Provide a public key to check the balance of!");
// }

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// const publicKey = new PublicKey(suppliedPublicKey);

// const isValidAddress = await isSolanaAddressValid(publicKey.toBase58());

// if (!isValidAddress) {
//     console.log(
//         `❌ Invalid Solana wallet address: ${suppliedPublicKey}`
//     );
//     process.exit(1);
// }

// const balanceInLamports = await connection.getBalance(publicKey);

// const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

// console.log(
//     `✅ Finished! The balance of the wallet at address ${publicKey} is ${balanceInSOL} SOL!`
// );


import bs58 from 'bs58';
import axios from 'axios';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

async function isSolanaAddressValid(address: string): Promise<boolean> {
    try {
        // Check if the address is a valid base58 encoded string
        const decodedAddress = bs58.decode(address);

        // Check if the encoded address has correct length
        if (decodedAddress.length !== 32) {
            return false;
        }

        // Connect to Solana node and check if account exists
        const rpcUrl = "https://api.devnet.solana.com";
        const response = await axios.post(rpcUrl, {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [address]
        });

        if (response.status === 200) {
            const result = response.data.result;
            return result !== null;
        } else {
            console.error("Failed to connect to Solana node:", response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error:", error.message);
        return false;
    }
}

async function getSolanaBalance(address: string): Promise<number> {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const publicKey = new PublicKey(address);
    const balanceInLamports = await connection.getBalance(publicKey);
    return balanceInLamports / LAMPORTS_PER_SOL;
}

// Test the address validation function
const suppliedPublicKey = "5Dq8MMSKpcqMDNsJznZFXAcasBZrMSpp6sGExPL3JdFf";
const isValidAddress = await isSolanaAddressValid(suppliedPublicKey);

if (!isValidAddress) {
    console.log(`❌ Invalid Solana wallet address: ${suppliedPublicKey}`);
    process.exit(1);
}
    const balanceInSOL = await getSolanaBalance(suppliedPublicKey);
    console.log(`✅ Finished! The balance of the wallet at address ${suppliedPublicKey} is ${balanceInSOL} SOL!`);