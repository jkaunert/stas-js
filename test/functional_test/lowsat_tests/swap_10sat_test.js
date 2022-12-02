const utils = require("../../utils/test_utils");
const bsv = require("bsv");
const expect = require("chai").expect;

require("dotenv").config();

const {
  createSwapOffer,
  acceptSwapOffer,
  allInOneSwap,
  createUnsignedSwapOffer,
  acceptUnsignedSwapOffer,
  acceptUnsignedNativeSwapOffer,
  makerSignSwapOffer,
} = require("../../../index").swap;

const {
  bitcoinToSatoshis,
  getTransaction,
  getRawTransaction,
  getFundsFromFaucet,
} = require("../../../index").utils;

const { contract, issue } = require("../../../index");

let fundingPrivateKey;
let bobPrivateKey;
let alicePrivateKey;
let bobAddr;
let aliceAddr;
let paymentPublicKeyHash;
let tokenAIssueHex;
let tokenBIssueHex;
let tokenAObj;
let tokenBObj;
let tokenAIssueTxid;
let tokenBIssueTx;
let tokenBIssueTxid;
let fundingUTXO;
let alicePublicKeyHash;
let bobPublicKeyHash;
let tokenASymbol;
let tokenBSymbol;

beforeEach(async function () {
  await setup();
});

describe("atomic swap with 10 tokens", function () {
  // this swap function won't be used but is here as a sanity check
  it("Swap - All in one swap with 10 sat", async function () {
    const takerStasInputScriptHex = tokenAObj.outputs[0].script.toHex();
    const makerStasInputScript = tokenBObj.outputs[0].script;

    const makerInputUtxo = {
      txId: tokenBIssueTxid,
      outputIndex: 0,
      script: makerStasInputScript,
      satoshis: tokenBObj.outputs[0].satoshis,
    };

    const wantedInfo = {
      scriptHex: takerStasInputScriptHex,
      satoshis: tokenAObj.outputs[0].satoshis,
    };

    const allInOneSwapHex = await allInOneSwap(
      alicePrivateKey,
      makerInputUtxo,
      wantedInfo,
      tokenBIssueHex,
      0,
      bobPrivateKey,
      tokenAIssueHex,
      0,
      tokenAObj.outputs[0].satoshis,
      tokenBObj.outputs[0].satoshis,
      fundingUTXO,
      fundingPrivateKey
    );

    const swapTxid = await utils.broadcastWithRetry(allInOneSwapHex);
    console.log("swaptxid", swapTxid);
    expect(await utils.getVoutAmount(swapTxid, 0)).to.equal(0.0000001);
    expect(await utils.getVoutAmount(swapTxid, 1)).to.equal(0.0000001);
    await utils.isTokenBalance(aliceAddr, 10);
    await utils.isTokenBalance(bobAddr, 10);
  });

  it("Swap - 2 step token-p2pkh swap with 10 sat", async function () {
    const makerVout = 0;
    const takerVout = 0;
    const makerStasTx = bsv.Transaction(tokenBIssueHex);
    const makerStasInputScript = makerStasTx.outputs[makerVout].script;

    // taker gets some funds
    const bobUtxos = await getFundsFromFaucet(
      bobPrivateKey.toAddress(process.env.NETWORK).toString()
    );
    // get input transaction
    const takerInputTxHex = await getRawTransaction(bobUtxos[0].txid);

    const alicePublicKeyHash = bsv.crypto.Hash.sha256ripemd160(
      alicePrivateKey.publicKey.toBuffer()
    ).toString("hex");

    const makerInputSatoshis = tokenBObj.outputs[makerVout].satoshis;
    const takerOutputSatoshis = makerInputSatoshis;
    const makerOutputSatoshis = bobUtxos[0].satoshis;
    const takerInputSatoshis = makerOutputSatoshis;

    const makerInputUtxo = {
      txId: tokenBIssueTxid,
      outputIndex: takerVout,
      script: makerStasInputScript,
      satoshis: makerInputSatoshis,
    };

    const wantedInfo = { type: "native", satoshis: makerOutputSatoshis };

    const swapOfferHex = await createSwapOffer(
      alicePrivateKey,
      makerInputUtxo,
      wantedInfo
    );
    // now bob takes the offer
    const fundingUTXO = {
      txid: tokenBIssueTxid,
      vout: 1,
      scriptPubKey: tokenBIssueTx.vout[1].scriptPubKey.hex,
      satoshis: bitcoinToSatoshis(tokenBIssueTx.vout[1].value),
    };

    const takerInputUTXO = {
      txId: bobUtxos[0].txid,
      outputIndex: bobUtxos[0].vout,
      script: bsv.Script.fromHex(bobUtxos[0].scriptPubKey),
      satoshis: takerInputSatoshis,
    };

    const fullySignedSwapHex = await acceptSwapOffer(
      swapOfferHex,
      tokenBIssueHex,
      bobPrivateKey,
      takerInputTxHex,
      takerInputUTXO,
      takerOutputSatoshis,
      alicePublicKeyHash,
      fundingUTXO,
      fundingPrivateKey
    );

    const swapTxid = await utils.broadcastWithRetry(fullySignedSwapHex);
    console.log("swaptxid", swapTxid);

    const tokenId = await utils.getToken(swapTxid, 1);
    const response = await utils.getTokenResponse(tokenId, tokenBSymbol);
    expect(response.symbol).to.equal(tokenBSymbol);
    expect(await utils.getVoutAmount(swapTxid, 0)).to.equal(0.01);
    expect(await utils.getVoutAmount(swapTxid, 1)).to.equal(0.0000001);
    await utils.isTokenBalanceTwoTokens(bobAddr, 20);
    await utils.isTokenBalance(aliceAddr, 0);
  });

  it("Swap - 2 step p2pkh-token swap with 10 sat", async function () {
    const takerStasInputScriptHex = tokenAObj.outputs[0].script.toHex();
    // first get some funds
    const aliceUtxos = await getFundsFromFaucet(
      alicePrivateKey.toAddress(process.env.NETWORK).toString()
    );
    // get input transaction
    const makerInputHex = await getRawTransaction(aliceUtxos[0].txid);

    const makerInputSatoshis = aliceUtxos[0].satoshis;
    const takerOutputSatoshis = makerInputSatoshis;
    const makerOutputSatoshis = tokenAObj.outputs[0].satoshis;
    const takerInputSatoshis = makerOutputSatoshis;

    const wantedInfo = {
      scriptHex: takerStasInputScriptHex,
      satoshis: makerOutputSatoshis,
    };

    const makerUtxo = {
      txId: aliceUtxos[0].txid,
      outputIndex: aliceUtxos[0].vout,
      script: bsv.Script.fromHex(aliceUtxos[0].scriptPubKey), // makerStasInputScript,
      satoshis: makerInputSatoshis,
    };
    const swapOfferHex = await createSwapOffer(
      alicePrivateKey,
      makerUtxo,
      wantedInfo
    );

    // console.log('swapOfferHex', swapOfferHex)

    const takerInputUTXO = {
      txId: tokenAIssueTxid,
      outputIndex: 0,
      script: tokenAObj.outputs[0].script, // makerStasInputScript,
      satoshis: takerInputSatoshis,
    };
    // now bob takes the offer
    const fullySignedSwapHex = await acceptSwapOffer(
      swapOfferHex,
      makerInputHex,
      bobPrivateKey,
      tokenAIssueHex,
      takerInputUTXO,
      takerOutputSatoshis,
      alicePublicKeyHash,
      fundingUTXO,
      fundingPrivateKey
    );

    // console.log('fullySignedSwapHex', fullySignedSwapHex)

    const swapTxid = await utils.broadcastWithRetry(fullySignedSwapHex);
    console.log("swaptxid: ", swapTxid);
    expect(await utils.getVoutAmount(swapTxid, 0)).to.equal(0.0000001);
    expect(await utils.getVoutAmount(swapTxid, 1)).to.equal(0.01);
    await utils.isTokenBalanceTwoTokens(aliceAddr, 20);
    await utils.isTokenBalance(bobAddr, 0);
  });

  it("Swap 3 step Token-Token with 10 sat", async function () {
    const takerStasInputScriptHex = tokenAObj.outputs[0].script.toHex();
    const makerStasInputScript = tokenBObj.outputs[0].script;

    const makerInputSatoshis = tokenBObj.outputs[0].satoshis;
    const takerOutputSatoshis = makerInputSatoshis;
    const makerOutputSatoshis = tokenAObj.outputs[0].satoshis;
    const takerInputSatoshis = makerOutputSatoshis;
    const makerInputUtxo = {
      txId: tokenBIssueTxid,
      outputIndex: 0,
      script: makerStasInputScript,
      satoshis: makerInputSatoshis,
    };

    const wantedInfo = {
      scriptHex: takerStasInputScriptHex,
      satoshis: makerOutputSatoshis,
    };

    const unsignedSwapOfferHex = await createUnsignedSwapOffer(
      alicePrivateKey,
      makerInputUtxo,
      wantedInfo
    );

    // now bob takes the offer
    const takerSignedSwapHex = await acceptUnsignedSwapOffer(
      unsignedSwapOfferHex,
      tokenBIssueHex,
      bobPrivateKey,
      tokenAIssueHex,
      0,
      takerInputSatoshis,
      takerOutputSatoshis,
      alicePublicKeyHash,
      fundingUTXO,
      fundingPrivateKey
    );

    const fullySignedSwapHex = await makerSignSwapOffer(
      takerSignedSwapHex,
      tokenBIssueHex,
      tokenAIssueHex,
      alicePrivateKey,
      bobPublicKeyHash,
      paymentPublicKeyHash,
      fundingUTXO
    );
    const swapTxid = await utils.broadcastWithRetry(fullySignedSwapHex);
    expect(await utils.getVoutAmount(swapTxid, 0)).to.equal(0.0000001);
    expect(await utils.getVoutAmount(swapTxid, 1)).to.equal(0.0000001);
    await utils.isTokenBalance(aliceAddr, 10);
    await utils.isTokenBalance(bobAddr, 10);
  });

  it("Swap - 3 step token-p2pkh swap  with 10 token", async function () {
    // first get some funds
    const bobUtxos = await getFundsFromFaucet(
      bobPrivateKey.toAddress(process.env.NETWORK).toString()
    );
    // get input transaction
    const takerInputTx = await getRawTransaction(bobUtxos[0].txid);

    const makerInputSatoshis = tokenBObj.outputs[0].satoshis;
    const takerOutputSatoshis = makerInputSatoshis;
    const makerOutputSatoshis = bobUtxos[0].satoshis;
    const takerInputSatoshis = makerOutputSatoshis;

    const makerInputUtxo = {
      txId: tokenBIssueTxid,
      outputIndex: 0,
      script: tokenBObj.outputs[0].script,
      satoshis: makerInputSatoshis,
    };

    const wantedInfo = { type: "native", satoshis: makerOutputSatoshis };
    const takerInputInfo = {
      type: "native",
      utxo: bobUtxos[0],
      satoshis: takerInputSatoshis,
    };

    const unsignedSwapOfferHex = await createUnsignedSwapOffer(
      alicePrivateKey,
      makerInputUtxo,
      wantedInfo
    );

    const takerSignedSwapHex = await acceptUnsignedNativeSwapOffer(
      unsignedSwapOfferHex,
      takerInputInfo,
      tokenBIssueHex,
      bobPrivateKey,
      takerInputTx,
      bobUtxos[0].vout,
      takerOutputSatoshis,
      alicePublicKeyHash,
      fundingUTXO,
      fundingPrivateKey
    );

    const fullySignedSwapHex = await makerSignSwapOffer(
      takerSignedSwapHex,
      tokenBIssueHex,
      takerInputTx,
      alicePrivateKey,
      bobPublicKeyHash,
      paymentPublicKeyHash,
      fundingUTXO
    );
    const swapTxid = await utils.broadcastWithRetry(fullySignedSwapHex);
    console.log("swaptxid", swapTxid);
    const tokenId = await utils.getToken(swapTxid, 1);
    const response = await utils.getTokenResponse(tokenId, tokenBSymbol);
    expect(response.symbol).to.equal(tokenBSymbol);
    expect(await utils.getVoutAmount(swapTxid, 0)).to.equal(0.01);
    expect(await utils.getVoutAmount(swapTxid, 1)).to.equal(0.0000001);
    await utils.isTokenBalanceTwoTokens(bobAddr, 20);
    await utils.isTokenBalance(aliceAddr, 0);
  });

  // the maker offers sats for a token
  it("Swap - 3 step p2pkh-token swap with 10 token", async function () {
    const takerStasInputScriptHex = tokenAObj.outputs[0].script.toHex();
    // first get some funds
    const aliceUtxos = await getFundsFromFaucet(
      alicePrivateKey.toAddress(process.env.NETWORK).toString()
    );
    // get input transaction
    const makerInputTx = await getRawTransaction(aliceUtxos[0].txid);

    const makerInputSatoshis = aliceUtxos[0].satoshis;
    const takerOutputSatoshis = makerInputSatoshis;
    const makerOutputSatoshis = tokenAObj.outputs[0].satoshis;
    const takerInputSatoshis = makerOutputSatoshis;

    const wantedInfo = {
      scriptHex: takerStasInputScriptHex,
      satoshis: makerOutputSatoshis,
    };

    const unsignedSwapOfferHex = await createUnsignedSwapOffer(
      alicePrivateKey,
      aliceUtxos[0],
      wantedInfo
    );

    // now bob takes the offer
    const takerSignedSwapHex = await acceptUnsignedSwapOffer(
      unsignedSwapOfferHex,
      makerInputTx,
      bobPrivateKey,
      tokenAIssueHex,
      0,
      takerInputSatoshis,
      takerOutputSatoshis,
      alicePublicKeyHash,
      fundingUTXO,
      fundingPrivateKey
    );

    const fullySignedSwapHex = await makerSignSwapOffer(
      takerSignedSwapHex,
      makerInputTx,
      tokenAIssueHex,
      alicePrivateKey,
      bobPublicKeyHash,
      paymentPublicKeyHash,
      fundingUTXO
    );
    const swapTxid = await utils.broadcastWithRetry(fullySignedSwapHex);
    console.log("swaptxid ", swapTxid);
    const tokenId = await utils.getToken(swapTxid, 0);
    const response = await utils.getTokenResponse(tokenId, tokenASymbol);
    expect(response.symbol).to.equal(tokenASymbol);
    expect(await utils.getVoutAmount(swapTxid, 0)).to.equal(0.0000001);
    expect(await utils.getVoutAmount(swapTxid, 1)).to.equal(0.01);
    await utils.isTokenBalanceTwoTokens(aliceAddr, 20);
    await utils.isTokenBalance(bobAddr, 0);
  });
});

async function setup() {
  const tokenAIssuerPrivateKey = bsv.PrivateKey();
  const tokenBIssuerPrivateKey = bsv.PrivateKey();
  fundingPrivateKey = bsv.PrivateKey();
  paymentPublicKeyHash = bsv.crypto.Hash.sha256ripemd160(
    fundingPrivateKey.publicKey.toBuffer()
  ).toString("hex");
  alicePrivateKey = bsv.PrivateKey();
  bobPrivateKey = bsv.PrivateKey();

  bobAddr = bobPrivateKey.toAddress(process.env.NETWORK).toString();
  aliceAddr = alicePrivateKey.toAddress(process.env.NETWORK).toString();

  const tokenAContractUtxos = await getFundsFromFaucet(
    tokenAIssuerPrivateKey.toAddress(process.env.NETWORK).toString()
  );
  const tokenBContractUtxos = await getFundsFromFaucet(
    tokenBIssuerPrivateKey.toAddress(process.env.NETWORK).toString()
  );
  const tokenAFundingUtxos = await getFundsFromFaucet(
    fundingPrivateKey.toAddress(process.env.NETWORK).toString()
  );
  const tokenBFundingUtxos = await getFundsFromFaucet(
    fundingPrivateKey.toAddress(process.env.NETWORK).toString()
  );
  const tokenAIssuerPublicKeyHash = bsv.crypto.Hash.sha256ripemd160(
    tokenAIssuerPrivateKey.publicKey.toBuffer()
  ).toString("hex");
  const tokenBIssuerPublicKeyHash = bsv.crypto.Hash.sha256ripemd160(
    tokenBIssuerPrivateKey.publicKey.toBuffer()
  ).toString("hex");
  alicePublicKeyHash = bsv.crypto.Hash.sha256ripemd160(
    alicePrivateKey.publicKey.toBuffer()
  ).toString("hex");
  bobPublicKeyHash = bsv.crypto.Hash.sha256ripemd160(
    bobPrivateKey.publicKey.toBuffer()
  ).toString("hex");

  // Token A
  tokenASymbol = "TOKENA";
  const tokenASupply = 10;
  const tokenASchema = utils.schema(
    tokenAIssuerPublicKeyHash,
    tokenASymbol,
    tokenASupply
  );
  const tokenAContractHex = await contract(
    tokenAIssuerPrivateKey,
    tokenAContractUtxos,
    tokenAFundingUtxos,
    fundingPrivateKey,
    tokenASchema,
    tokenASupply
  );
  const tokenAContractTxid = await utils.broadcastWithRetry(tokenAContractHex);
  const tokenAContractTx = await getTransaction(tokenAContractTxid);

  tokenAIssueHex = await issue(
    tokenAIssuerPrivateKey,
    [
      {
        addr: bobAddr,
        satoshis: 10,
        data: "one",
      },
    ],
    utils.getUtxo(tokenAContractTxid, tokenAContractTx, 0),
    utils.getUtxo(tokenAContractTxid, tokenAContractTx, 1),
    fundingPrivateKey,
    true,
    tokenASymbol,
    2
  );
  await utils.broadcastWithRetry(tokenAIssueHex);
  tokenAObj = new bsv.Transaction(tokenAIssueHex);

  // Token B
  tokenBSymbol = "TOKENB";
  const tokenBSupply = 10;
  const tokenBSchema = utils.schema(
    tokenBIssuerPublicKeyHash,
    tokenBSymbol,
    tokenBSupply
  );
  const tokenBContractHex = await contract(
    tokenBIssuerPrivateKey,
    tokenBContractUtxos,
    tokenBFundingUtxos,
    fundingPrivateKey,
    tokenBSchema,
    tokenBSupply
  );
  const tokenBContractTxid = await utils.broadcastWithRetry(tokenBContractHex);
  const tokenBContractTx = await getTransaction(tokenBContractTxid);

  tokenBIssueHex = await issue(
    tokenBIssuerPrivateKey,
    [
      {
        addr: aliceAddr,
        satoshis: 10,
        data: "one",
      },
    ],
    utils.getUtxo(tokenBContractTxid, tokenBContractTx, 0),
    utils.getUtxo(tokenBContractTxid, tokenBContractTx, 1),
    fundingPrivateKey,
    true,
    tokenBSymbol,
    2
  );
  tokenBIssueTxid = await utils.broadcastWithRetry(tokenBIssueHex);
  tokenBIssueTx = await getTransaction(tokenBIssueTxid);
  tokenBObj = new bsv.Transaction(tokenBIssueHex);
  fundingUTXO = {
    txid: tokenBIssueTxid,
    vout: 1,
    scriptPubKey: tokenBIssueTx.vout[1].scriptPubKey.hex,
    satoshis: bitcoinToSatoshis(tokenBIssueTx.vout[1].value),
  };
}
