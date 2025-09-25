import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('http://127.0.0.1:8899'); // http://127.0.0.1:8899  https://api.devnet.solana.com

async function airdrop(address: string, amount: number) {
    const publicKey = new PublicKey(address);
    const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    console.log(`Airdropped ${amount} SOL to ${address}`);
}

const address = 'A5edaq3YjX1qMCzihTcQK4gPmsuU74dvu5qdKA8qhNAr';
const amount = 2; 

airdrop(address, amount).catch(console.error);