import { getOrCreateAssociatedTokenAccount, mintTo, getMint } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";

async function main() {
    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed'
    )

    const MINT = "7pksNotq6AkyCuGZuksikd9hksr5kGTTUULetCzaRRHb"
    const mintPK = new PublicKey(MINT);

    const mintAuthor = "GGbExRdTUPHP6X5TwWxD3SoBD49z3ChBXesX1D7VCmZk"
    const mintAuthorPK = new PublicKey(mintAuthor);

    const secretKey = JSON.parse(fs.readFileSync("/home/xeqbz/.config/solana/id.json", "utf8")); 
    const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mintPK,
        payer.publicKey
    )
    
    console.log("Token Account:", tokenAccount.address.toBase58());

    await mintTo(
        connection,
        payer,
        mintPK,
        tokenAccount.address,
        mintAuthorPK,
        1000000000000
    )

    const mintInfo = await getMint(
        connection,
        mintPK
    )

    console.log(mintInfo.supply);
}

main();
