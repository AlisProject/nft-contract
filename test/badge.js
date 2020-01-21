const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Badge = artifacts.require('Badge');

contract('Badge', (accounts) => {
  let badge;

  function makeRejectMessage(targetMessage) {
    return `Returned error: VM Exception while processing transaction: revert ${targetMessage}`
  }

  function makeRejectMessageWithReason(targetMessage) {
    return `Returned error: VM Exception while processing transaction: revert ${targetMessage} -- Reason given: ${targetMessage}.`
  }

  beforeEach(async () => {
    badge = await Badge.new();
  });

  describe('constructor', () => {
    it('should set token name and symbol', async () => {
      const name = await badge.name();
      name.should.equal('ALIS:Badge');

      const symbol = await badge.symbol();
      symbol.should.equal('ALISB');
    });
  });

  describe('bulkMint', () => {
    it('should bulk mint tokens', async () => {
      await badge.bulkMint([accounts[1], accounts[2]], 1, "https://example.com/1.json");
      const token1 = await badge.tokenOfOwnerByIndex(accounts[1], 0)
      const token2 = await badge.tokenOfOwnerByIndex(accounts[2], 0)
      token1.toNumber().should.equal(100000001)
      token2.toNumber().should.equal(100000002)

      await badge.bulkMint([accounts[1], accounts[2]], 2, "https://example.com/2.json");
      const token3 = await badge.tokenOfOwnerByIndex(accounts[1], 1)
      const token4 = await badge.tokenOfOwnerByIndex(accounts[2], 1)
      token3.toNumber().should.equal(200000001)
      token4.toNumber().should.equal(200000002)
    });

    it('should set tokenURI', async () => {
      await badge.bulkMint([accounts[1]], 1, "https://example.com/1.json");
      const tokenURI = await badge.tokenURI(100000001);
      tokenURI.should.equal("https://example.com/1.json");
    });

    it('should increase supply of the badge type', async () => {
      await badge.bulkMint([accounts[1], accounts[2]], 1, "https://example.com/1.json");
      await badge.bulkMint([accounts[3]], 1, "https://example.com/1.json");
      await badge.bulkMint([accounts[3]], 2, "https://example.com/2.json");

      const badgeTypeSupply1 = await badge.badgeTypeSupply(1)
      const badgeTypeSupply2 = await badge.badgeTypeSupply(2)

      badgeTypeSupply1.toNumber().should.equal(3)
      badgeTypeSupply2.toNumber().should.equal(1)
    });

    it('should fail if sender is not minter', async () => {
      await badge.bulkMint([accounts[1]], 1, "https://example.com/1.json", {
        from: accounts[1]
      }).should.be.rejectedWith(Error,
        makeRejectMessageWithReason('MinterRole: caller does not have the Minter role'));
    });
  });

  describe('setBaseURI', () => {
    it('should set base uri', async () => {
      await badge.setBaseURI("https://example.com/");
      const baseURI1 = await badge.baseURI();
      baseURI1.should.equal("https://example.com/")

      await badge.setBaseURI("");
      const baseURI2 = await badge.baseURI();
      baseURI2.should.equal("")
    });

    it('should fail if sender is not minter', async () => {
      await badge.setBaseURI("https://example.com/", {
        from: accounts[1]
      }).should.be.rejectedWith(Error,
        makeRejectMessageWithReason('MinterRole: caller does not have the Minter role'));
    });
  });

  describe('tokenURI', () => {
    it('should return token uri', async () => {
      // baseURL is empty
      await badge.bulkMint([accounts[1]], 1, "https://example.com/1.json");
      const tokenURI1 = await badge.tokenURI(100000001);
      tokenURI1.should.equal("https://example.com/1.json")

      // baseURL is not empty
      await badge.setBaseURI("https://example.com/");
      await badge.bulkMint([accounts[1]], 2, "2.json");
      const tokenURI2 = await badge.tokenURI(200000001);
      tokenURI2.should.equal("https://example.com/2.json")

      // tokenURI is empty
      await badge.bulkMint([accounts[1]], 3, "");
      const tokenURI3 = await badge.tokenURI(300000001);
      tokenURI3.should.equal("");
    });

    it('should fail if token does not exist', async () => {
      await badge.tokenURI(1).should.be.rejectedWith(Error,
        makeRejectMessage('ERC721Metadata: URI query for nonexistent token'));
    });
  });

  describe('setTokenURI', () => {
    it('should set token uri', async () => {
      await badge.bulkMint([accounts[1]], 1, "");
      await badge.setTokenURI(100000001, "https://example.com/1.json")
      const tokenURI = await badge.tokenURI(100000001);
      tokenURI.should.equal("https://example.com/1.json");
    });

    it('should fail if sender is not minter', async () => {
      await badge.bulkMint([accounts[1]], 1, "");
      await badge.setTokenURI(100000001, "https://example.com/1.json", {
        from: accounts[1]
      }).should.be.rejectedWith(Error,
        makeRejectMessageWithReason('MinterRole: caller does not have the Minter role'));
    });
  });
});