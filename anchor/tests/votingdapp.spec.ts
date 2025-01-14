import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import { Votingdapp as voting} from 'anchor/target/types/votingdapp'; 
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';
const IDL = require('../target/idl/votingdapp.json')

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe('voting', () => {
  it('Initialize Poll', async () => {
    const context = await startAnchor("",[{name:"voting", programId:votingAddress}],[]);
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<voting>(
      IDL,
      provider,
    );

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "what is your favorite: oreo or jimjam?",
      new anchor.BN(0),
      new anchor.BN(1836833176),
    ).rpc();


    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le',8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("what is your favorite: oreo or jimjam?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });
});
