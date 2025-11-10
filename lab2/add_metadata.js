import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey, keypairIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import {
    mplTokenMetadata,
    createMetadataAccountV3,
    findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import fs from "fs";

async function main() {
    const RPC = "https://api.devnet.solana.com";
    const MINT = "CQzUFADs2wTn8j63ydji5zcnT8Gw5H2h6zao6mhc9Jpc" // place MINT address here 
    const URI = "https://raw.githubusercontent.com/xeqbz/TOFD/refs/heads/master/lab2/metadata.json"

    const umi = createUmi(RPC).use(mplTokenMetadata());
    const secret = Uint8Array.from(JSON.parse(fs.readFileSync("/home/xeqbz/.config/solana/id.json", "utf8")));
    const kp = umi.eddsa.createKeypairFromSecretKey(secret);
    umi.use(keypairIdentity(kp));
    const signer = createSignerFromKeypair(umi, kp);

    const mintPk = publicKey(MINT);
    const metadataPda = findMetadataPda(umi, { mint: mintPk });

    await createMetadataAccountV3(umi, {
        metadata: metadataPda,
        mint: mintPk,
        mintAuthority: signer,
        payer: signer,
        updateAuthority: signer,
        data: {
            name: "My token for LR2",
            symbol: "VT",
            uri: URI,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        },
        isMutable: true,
        collectionDetails: null,
    }).sendAndConfirm(umi);

    console.log("Metadata created.")
}

main();