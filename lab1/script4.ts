import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import dotenv from "dotenv"

dotenv.config()

const secretKeyString = process.env.WALLET_SECRET_KEY || "";
const secretKey = Uint8Array.from(JSON.parse(secretKeyString));

const wallet = Keypair.fromSecretKey(secretKey);

async function transferAllLamports(fromKeypair: Keypair, toPubkey: string) {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed") // http://127.0.0.1:8899  https://api.devnet.solana.com
    const balance = await connection.getBalance(fromKeypair.publicKey);
    if (balance === 0) {
        console.log("No lamports available for transfer.");
        return;
    }
    const toPublicKey = new PublicKey(toPubkey);
    const feeBuffer = 5000;
    const lamportsToSend = balance > feeBuffer ? balance - feeBuffer : balance;
    const instruction = SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: lamportsToSend,
    });
    const tx = new Transaction().add(instruction);
    await sendAndConfirmTransaction(connection, tx, [fromKeypair]);
    console.log(`Transferred all lamports (${lamportsToSend}) to ${toPubkey}`);
}

transferAllLamports(wallet, "C3c5xUezWRx7ujECuqviPdaJy24LfYJsT4skJHNT3Lqy");