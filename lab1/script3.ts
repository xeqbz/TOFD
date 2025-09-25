import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js"
import dotenv from "dotenv"

dotenv.config()

const secretKeyString = process.env.WALLET_SECRET_KEY || "";
const secretKey = Uint8Array.from(JSON.parse(secretKeyString));

const wallet = Keypair.fromSecretKey(secretKey);

async function transferLamports(fromKeypair: Keypair, toPubkey: string, amount: number) {
    const connection = new Connection("http://127.0.0.1:8899", "confirmed"); // http://127.0.0.1:8899  https://api.devnet.solana.com
    const toPublicKey = new PublicKey(toPubkey);
    const instruction = SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
    });
    const tx = new Transaction().add(instruction);
    await sendAndConfirmTransaction(connection, tx, [fromKeypair]);
    console.log(`Transferred ${amount} SOL to ${toPubkey}`);
}

transferLamports(wallet, "C3c5xUezWRx7ujECuqviPdaJy24LfYJsT4skJHNT3Lqy", 2);