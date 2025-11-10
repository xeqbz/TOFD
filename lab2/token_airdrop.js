import {
  Connection,
  PublicKey,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const MINT = "7pksNotq6AkyCuGZuksikd9hksr5kGTTUULetCzaRRHb";
  const mintPK = new PublicKey(MINT);

  const secretKey = JSON.parse(
    fs.readFileSync("/home/xeqbz/.config/solana/id.json", "utf8")
  );
  const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));

  const ta = "DZuJ8YToEhbrVpEJE3hvHBccU1h4Td8v1cVSS1TDKeBW";
  const tokenAccount = new PublicKey(ta);

  const recipient1 = Keypair.generate();
  const recipient2 = Keypair.generate();

  console.log("Recipient 1:", recipient1.publicKey.toBase58());
  console.log("Recipient 2:", recipient2.publicKey.toBase58());

  const recipients = [recipient1, recipient2];

  for (const recipient of recipients) {
    const recipientATA = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintPK,
      recipient.publicKey
    );

    try {
      const tx = await transfer(
        connection,
        payer,
        tokenAccount, 
        recipientATA.address,
        payer.publicKey,
        10 * 10 ** 9
      );

      console.log(`Отправлено 10 токенов → ${recipient.publicKey.toBase58()} | Tx: ${tx}`);
    } catch (e) {
      console.error("Ошибка при переводе токенов:", e);
    }
  }
}

main();
