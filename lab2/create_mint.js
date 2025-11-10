import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import fs from "fs"

async function main() {
    const secretKey = JSON.parse(fs.readFileSync("/home/xeqbz/.config/solana/id.json", "utf8")); 
    const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const freezeAuthority = Keypair.generate(); 

    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed'
    );

    const mint = await createMint(
        connection,
        payer,
        payer.publicKey,
        freezeAuthority.publicKey,
        9
    );

    console.log(mint.toBase58());
}

main();