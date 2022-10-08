const bsv = require('bsv')
const {
  issue
} = require('../../index')
const privateKeyStr = 'Ky5XHRQvYEcEbtGoQQQETbctAgAQKvb3PocfJSnkyHuEj5Nzj1pb'
const privateKey = new bsv.PrivateKey(privateKeyStr)
let symbol = 'TAALT'
let issueInfo = [{
    addr: 'mq7psuJ7Z9h1w4H3YtcCoHx7cPmhVM9UsV',
    satoshis: 6000
},
{
    addr: 'mq7psuJ7Z9h1w4H3YtcCoHx7cPmhVM9UsV',
    satoshis: 4000
}]
let utxo = {
    txid: 'a82ba35634e2ea3a07b5f0d86f0b7868dd646f1d4e8344645d1cf2db711adab0',
    vout: 0,
    scriptPubKey: '76a914377669dd733270abed6737201afa4020629d2e5188ac6a4ded037b226e616d65223a225461616c20546f6b656e222c22746f6b656e4964223a2233373736363964643733333237306162656436373337323031616661343032303632396432653531222c2270726f746f636f6c4964223a22546f2062652064656369646564222c2273796d626f6c223a225441414c54222c226465736372697074696f6e223a224578616d706c6520746f6b656e206f6e2070726976617465205461616c6e6574222c22696d616765223a2268747470733a2f2f7777772e7461616c2e636f6d2f77702d636f6e74656e742f7468656d65732f7461616c5f76322f696d672f66617669636f6e2f66617669636f6e2d39367839362e706e67222c22746f74616c537570706c79223a31303030302c22646563696d616c73223a302c2273617473506572546f6b656e223a312c2270726f70657274696573223a7b226c6567616c223a7b227465726d73223a22c2a92032303230205441414c20544543484e4f4c4f474945532053455a435c6e414c4c205249474854532052455345525645442e20414e5920555345204f46205448495320534f465457415245204953205355424a45435420544f205445524d5320414e4420434f4e444954494f4e53204f46204c4943454e53452e20555345204f46205448495320534f46545741524520574954484f5554204c4943454e534520434f4e535449545554455320494e4652494e47454d454e54204f4620494e54454c4c45435455414c2050524f50455254592e20464f52204c4943454e53452044455441494c53204f462054484520534f4654574152452c20504c4541534520524546455220544f3a207777772e7461616c2e636f6d2f737461732d746f6b656e2d6c6963656e73652d61677265656d656e74222c226c6963656e63654964223a2231323334227d2c22697373756572223a7b226f7267616e69736174696f6e223a225461616c20546563686e6f6c6f676965732053455a43222c226c6567616c466f726d223a224c696d69746564204c696162696c697479205075626c696320436f6d70616e79222c22676f7665726e696e674c6177223a224341222c226d61696c696e6741646472657373223a223120566f6c63616e6f2053747265742c2043616e616461222c22697373756572436f756e747279223a2243594d222c226a7572697364696374696f6e223a22222c22656d61696c223a22696e666f407461616c2e636f6d227d2c226d657461223a7b22736368656d614964223a22746f6b656e31222c2277656273697465223a2268747470733a2f2f7461616c2e636f6d222c226c6567616c223a7b227465726d73223a22626c616820626c6168227d2c226d65646961223a7b2274797065223a226d7034227d7d7d7d',
    satoshis: 10000
  }


describe('Issue Unit Tests', () => {

    afterEach(async () => {
        issueInfo[0].addr = 'mq7psuJ7Z9h1w4H3YtcCoHx7cPmhVM9UsV',
        issueInfo[0].satoshis = 6000
        symbol = 'TAALT'
      })
      
  
    it('should create issue', async () => {
        const hex = await issue(
            privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
        )
        expect(hex).toBe('0100000002b0da1a71dbf21c5d6444834e1d6f64dd68780b6fd8f0b5073aeae23456a32ba8000000006b483045022100e0a748e149e03b9a8788499186f3f70ee21674cc093f54b5a822ba830dd33f03022052b0b13d576dd4cf2c718b0351e6469ad72587f41f56b700e7abace7ec3d73e141210270d2ae2d5eb30c142347b26b2b4684145b6934d7964127637eaf9ace366945b1ffffffffb0da1a71dbf21c5d6444834e1d6f64dd68780b6fd8f0b5073aeae23456a32ba8000000006b483045022100e0a748e149e03b9a8788499186f3f70ee21674cc093f54b5a822ba830dd33f03022052b0b13d576dd4cf2c718b0351e6469ad72587f41f56b700e7abace7ec3d73e141210270d2ae2d5eb30c142347b26b2b4684145b6934d7964127637eaf9ace366945b1ffffffff037017000000000000fd9f0576a91469517ff3b4d1cf991a263489a49078b118492f3088ac6976aa607f5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7c5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01007e818b21414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff007d976e7c5296a06394677768827601249301307c7e23022079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798027e7c7e7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01417e21038ff83d8cf12121491609c4939dc11c4aa35503508fe432dc5a5c1905608b9218ad547f7701207f01207f7701247f517f7801007e8102fd00a063546752687f7801007e817f727e7b01177f777b557a766471567a577a786354807e7e676d68aa880067765158a569765187645294567a5379587a7e7e78637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6867567a6876aa587a7d54807e577a597a5a7a786354807e6f7e7eaa727c7e676d6e7eaa7c687b7eaa587a7d877663516752687c72879b69537a647500687c7b547f77517f7853a0916901247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77788c6301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f777852946301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77686877517f7c52797d8b9f7c53a09b91697c76638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6876638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6863587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f7768587f517f7801007e817602fc00a06302fd00a063546752687f7801007e81727e7b7b687f75537f7c0376a9148801147f775379645579887567726881766968789263556753687a76026c057f7701147f8263517f7c766301007e817f7c6775006877686b537992635379528763547a6b547a6b677c6b567a6b537a7c717c71716868547a587f7c81547a557964936755795187637c686b687c547f7701207f75748c7a7669765880748c7a76567a876457790376a9147e7c7e557967041976a9147c7e0288ac687e7e5579636c766976748c7a9d58807e6c0376a9147e748c7a7e6c7e7e676c766b8263828c007c80517e846864745aa0637c748c7a76697d937b7b58807e56790376a9147e748c7a7e55797e7e6868686c567a5187637500678263828c007c80517e846868647459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e687459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e68687c537a9d547963557958807e041976a91455797e0288ac7e7e68aa87726d77776a14fe5697f24aa6e72a1d5f034121156a81d4f46f950100055441414c54a00f000000000000fd9f0576a91469517ff3b4d1cf991a263489a49078b118492f3088ac6976aa607f5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7c5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01007e818b21414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff007d976e7c5296a06394677768827601249301307c7e23022079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798027e7c7e7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01417e21038ff83d8cf12121491609c4939dc11c4aa35503508fe432dc5a5c1905608b9218ad547f7701207f01207f7701247f517f7801007e8102fd00a063546752687f7801007e817f727e7b01177f777b557a766471567a577a786354807e7e676d68aa880067765158a569765187645294567a5379587a7e7e78637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6867567a6876aa587a7d54807e577a597a5a7a786354807e6f7e7eaa727c7e676d6e7eaa7c687b7eaa587a7d877663516752687c72879b69537a647500687c7b547f77517f7853a0916901247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77788c6301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f777852946301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77686877517f7c52797d8b9f7c53a09b91697c76638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6876638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6863587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f7768587f517f7801007e817602fc00a06302fd00a063546752687f7801007e81727e7b7b687f75537f7c0376a9148801147f775379645579887567726881766968789263556753687a76026c057f7701147f8263517f7c766301007e817f7c6775006877686b537992635379528763547a6b547a6b677c6b567a6b537a7c717c71716868547a587f7c81547a557964936755795187637c686b687c547f7701207f75748c7a7669765880748c7a76567a876457790376a9147e7c7e557967041976a9147c7e0288ac687e7e5579636c766976748c7a9d58807e6c0376a9147e748c7a7e6c7e7e676c766b8263828c007c80517e846864745aa0637c748c7a76697d937b7b58807e56790376a9147e748c7a7e55797e7e6868686c567a5187637500678263828c007c80517e846868647459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e687459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e68687c537a9d547963557958807e041976a91455797e0288ac7e7e68aa87726d77776a14fe5697f24aa6e72a1d5f034121156a81d4f46f950100055441414c546e260000000000001976a914fe5697f24aa6e72a1d5f034121156a81d4f46f9588ac00000000')
    })

    it('should fail with null issuer private key', async () => {
        await expect(() => issue(
            null,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('Issuer private key is null')
    });
    
    it('should fail with null issueInfo', async () => {
        await expect(() => issue(
          privateKey,
            null,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo is invalid')
    });
    
    it('should fail with null contract utxo', async () => {
        await expect(() => issue(
          privateKey,
            issueInfo,
            null,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('contractUtxo is invalid')
    });
    
    it('should fail with null funding privatekey', async () => {
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            null,
            true,
            symbol
          )).rejects.toThrow('Payment UTXO provided but payment private key is null')
    });
    
    it('should fail with null isSplittable', async () => {
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            null,
            symbol
          )).rejects.toThrow('isSplittable must be a boolean value')
    });
    
    test.each([
        { invalidCharsSymbol: '!invalid..;' },
        { invalidCharsSymbol: '&@invalid"\'+=' },
        { invalidCharsSymbol: null },
      ])('should fail with null symbol', async ({invalidCharsSymbol}) => {
        await expect(() => issue(
            privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            invalidCharsSymbol
          )).rejects.toThrow('Invalid Symbol. Must be between 1 and 128 long and contain alpahnumeric, \'-\', \'_\' chars.')
      });
    
    it('should fail with invalid issue amount', async () => {
        issueInfo[0].satoshis = -1
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo Satoshis must be a natural number')
    });

    it('should fail with zero issue amount', async () => {
        issueInfo[0].satoshis = 0
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo satoshis < 1')
    });

    it('should fail with too few sats issue amount', async () => {
        issueInfo[0].satoshis = 2000
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('total out amount 6000 must equal total in amount 10000')
    });

    it('should fail with too many sats issue amount', async () => {
        issueInfo[0].satoshis = 10000
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('total out amount 14000 must equal total in amount 10000')
    });

    
    it('should fail with decimal issue amount', async () => {
        issueInfo[0].satoshis = 6000.5
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo Satoshis must be a natural number')
    });

    it('should fail with empty issueInfo', async () => {
        await expect(() => issue(
          privateKey,
            [],
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo is invalid')
    });

    it('should fail with issuer address too short', async () => {
        issueInfo[0].addr = '1bc1qxy2kgdygjrsqtzq2'
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo address must be between 26 and 35')
    });

    it('should fail with issuer address too long', async () => {
        issueInfo[0].addr = '1zP1eP5QGefi2DMPTfTL5SLmv7DivfNabc1qxymv7'
        await expect(() => issue(
          privateKey,
            issueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo address must be between 26 and 35')
    });

    it('should fail with issueInfo object', async () => {
        invalidIssueInfo = {
            addr: 'mq7psuJ7Z9h1w4H3YtcCoHx7cPmhVM9UsV',
            satoshis: 10000
        }
        await expect(() => issue(
          privateKey,
            invalidIssueInfo,
            utxo,
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('issueInfo is invalid')
    });

    it('should fail with empty contract utxo', async () => {
        await expect(() => issue(
          privateKey,
            issueInfo,
            [],
            utxo,
            privateKey,
            true,
            symbol
          )).rejects.toThrow('contractUtxo is invalid')
    });

})
