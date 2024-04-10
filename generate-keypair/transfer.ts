import { Connection, Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

// Load environment variables
require('dotenv').config();

// To take the recipient wallet address
const suppliedToPubKey = process.argv[2] || null;

// To terminate the transaction if no recipient wallet address is provided
if (!suppliedToPubKey) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
}

// To load the keypair and secret key from the environment instead of hard-coding it
const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`suppliedToPubKey: ${suppliedToPubKey}`);

const toPubkey = new PublicKey(suppliedToPubKey);

// Establishing connection to the Solana Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// To confirm that the keypair has been loaded including the public key and connection has been established
console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);

// To simulate new transaction
const transaction = new Transaction();

// Fumction that send the transaction
async function sendTransaction() {
    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [
            senderKeypair,
        ]);
        console.log(
            `Finished! Send ${LAMPORTS_TO_SEND} to the address ${toPubkey}.`
        );
    } catch (error) {
        console.log("Error sending transactions:", error);
    }
}

// Function that fund the account
async function fundAccount(account: PublicKey, lamports: number) {
    const senderAccount = senderKeypair.publicKey;
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderAccount,
            toPubkey: account,
            lamports,
        })
    );
    await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
}

const LAMPORTS_TO_SEND = 5000;
const MIN_BALANCE_REQUIRED = 2 * LAMPORTS_TO_SEND; // Minimum balance plus amount to send

// Check if target account has enough balance, fund it if necessary
const targetAccountBalance = await connection.getBalance(toPubkey);
if (targetAccountBalance < MIN_BALANCE_REQUIRED) {
    console.log(`Target account balance is insufficient, funding it...`);
    await fundAccount(toPubkey, MIN_BALANCE_REQUIRED - targetAccountBalance);
    console.log(`Target account funded successfully!`);
}

// Proceed with the transaction
const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

sendTransaction();