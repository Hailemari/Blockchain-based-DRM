const { expect } = require("chai");

describe("ContentPlatform", function () {
  let ContentPlatform, contentPlatform, owner, addr1, addr2;

  beforeEach(async function () {
    ContentPlatform = await ethers.getContractFactory("ContentPlatform");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    contentPlatform = await ContentPlatform.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contentPlatform.owner()).to.equal(owner.address);
    });
  });

  describe("Content Upload", function () {
    it("Should allow content upload and emit event", async function () {
      await expect(contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      )).to.emit(contentPlatform, "ContentUploaded");
    });

    it("Should not allow duplicate content uploads", async function () {
      await contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      );
  
      await expect(
        contentPlatform.connect(addr2).uploadContent(
          "Another Title",
          "Another Description",
          "Test Hash", // Same content hash as the previous upload
          100,
          200,
          300,
          0
        )
      ).to.be.revertedWith("Content with this hash already exists");
    });
  });

  describe("Subscription", function () {
    it("Should allow subscription and emit event", async function () {
      await contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      );
      await expect(contentPlatform.connect(addr2).subscribe(1, 0, { value: 100 })).to.emit(contentPlatform, "Subscribed");
    });
  });

  describe("Unsubscription", function () {
    it("Should allow unsubscription and emit event", async function () {
      await contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      );
      await contentPlatform.connect(addr2).subscribe(1, 0, { value: 100 });
      await expect(contentPlatform.connect(addr2).unsubscribe(1)).to.emit(contentPlatform, "Unsubscribed");
    });
  });

  describe("isSubscribed", function () {
    it("Should return true if the user is subscribed", async function () {
      await contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      );
      await contentPlatform.connect(addr2).subscribe(1, 0, { value: 100 });
      expect(await contentPlatform.isSubscribed(1, addr2.address)).to.equal(true);
    });
  });

  describe("getSubscribedContents", function () {
    it("Should return the list of content IDs the user is subscribed to", async function () {
      await contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      );
      await contentPlatform.connect(addr2).subscribe(1, 0, { value: 100 });
      const subscribedContents = await contentPlatform.getSubscribedContents(addr2.address);
      expect(Number(subscribedContents[0])).to.equal(1);
    });
  });

  describe("getContentDetails", function () {
    it("Should return the details of the content", async function () {
      await contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      );
      const contentDetails = await contentPlatform.getContentDetails(1);
      expect(contentDetails[0]).to.equal("Test Title");
      expect(contentDetails[1]).to.equal("Test Description");
      expect(contentDetails[2]).to.equal("Test Hash");
    });
  });

  describe("getSubscriptionInfo", function () {
    it("Should return the subscription info of the user for the content", async function () {
      await contentPlatform.connect(addr1).uploadContent(
        "Test Title",
        "Test Description",
        "Test Hash",
        100,
        200,
        300,
        0
      );
      await contentPlatform.connect(addr2).subscribe(1, 0, { value: 100 });
      const subscriptionInfo = await contentPlatform.getSubscriptionInfo(1, addr2.address);
      expect(subscriptionInfo[0]).to.equal(0);
    });
  });
});