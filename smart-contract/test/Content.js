const { expect } = require("chai");

describe("ContentPlatform", function () {
  let ContentPlatform, contentPlatform, owner, addr1, addr2;

  beforeEach(async function () {
    ContentPlatform = await ethers.getContractFactory("ContentPlatform");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    contentPlatform = await ContentPlatform.deploy();
  });

  describe("Content Creation", function () {
    it("Should create a new content and emit event", async function () {
      await expect(
        contentPlatform.createContent(
          "Test Title",
          "Test Description",
          "QmTest",
          100,
          0 // ContentType.Ebook
        )
      )
        .to.emit(contentPlatform, "ContentCreated")
        .withArgs(1, owner.address, "Test Title", "Test Description", "QmTest", 100, 0);
    });

    it("Should not create content with existing hash", async function () {
      await contentPlatform.createContent(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0 // ContentType.Ebook
      );
      await expect(
        contentPlatform.createContent(
          "Another Title",
          "Another Description",
          "QmTest", // Same IPFS hash as the previous content
          200,
          1 // ContentType.Video
        )
      ).to.be.reverted;
    });
  });

  describe("Content Update", function () {
    beforeEach(async function () {
      await contentPlatform.createContent(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0 // ContentType.Ebook
      );
    });

    it("Should update content details", async function () {
      await contentPlatform.updateContent(
        1,
        "Updated Title",
        "Updated Description",
        "QmUpdated",
        200,
        1 // ContentType.Video
      );
      const updatedContent = await contentPlatform.getContent(1);
      expect(updatedContent.title).to.equal("Updated Title");
      expect(updatedContent.description).to.equal("Updated Description");
      expect(updatedContent.ipfsHash).to.equal("QmUpdated");
      expect(updatedContent.price).to.equal(200);
      expect(updatedContent.contentType).to.equal(1); // ContentType.Video
    });

    it("Should not update content with existing hash", async function () {
      await contentPlatform.createContent(
        "Another Title",
        "Another Description",
        "QmAnother",
        200,
        1 // ContentType.Video
      );
      await expect(
        contentPlatform.updateContent(
          1,
          "Updated Title",
          "Updated Description",
          "QmAnother", // Existing IPFS hash from another content
          300,
          2 // ContentType.Music
        )
      ).to.be.reverted;
    });

    it("Should only allow creator to update content", async function () {
      await expect(
        contentPlatform.connect(addr1).updateContent(
          1,
          "Updated Title",
          "Updated Description",
          "QmUpdated",
          200,
          1 // ContentType.Video
        )
      ).to.be.reverted;
    });
  });

  describe("Content Purchase", function () {
    beforeEach(async function () {
      await contentPlatform.createContent(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0 // ContentType.Ebook
      );
    });

    it("Should purchase content and emit event", async function () {
      await expect(
        contentPlatform.connect(addr1).purchaseContent(1, { value: 100 })
      )
        .to.emit(contentPlatform, "ContentPurchased")
        .withArgs(1, addr1.address, owner.address, "QmTest", 100);
    });

    it("Should not purchase inactive content", async function () {
      await contentPlatform.toggleContentStatus(1);
      await expect(
        contentPlatform.connect(addr1).purchaseContent(1, { value: 100 })
      ).to.be.reverted;
    });

    it("Should not purchase with insufficient funds", async function () {
      await expect(
        contentPlatform.connect(addr1).purchaseContent(1, { value: 50 })
      ).to.be.revertedWith("Insufficient funds to purchase this content.");
    });

    it("Should not purchase already purchased content", async function () {
      await contentPlatform.connect(addr1).purchaseContent(1, { value: 100 });
      await expect(
        contentPlatform.connect(addr1).purchaseContent(1, { value: 100 })
      ).to.be.reverted;
    });
  });

  describe("Content Retrieval", function () {
    beforeEach(async function () {
      await contentPlatform.createContent(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0 // ContentType.Ebook
      );
      await contentPlatform.createContent(
        "Test Title 2",
        "Test Description 2",
        "QmTest2",
        200,
        1 // ContentType.Video
      );
      await contentPlatform.connect(addr1).createContent(
        "Test Title 3",
        "Test Description 3",
        "QmTest3",
        300,
        2 // ContentType.Music
      );
      await contentPlatform.toggleContentStatus(2);
    });

    it("Should retrieve content details", async function () {
      const content = await contentPlatform.getContent(1);
      expect(content.title).to.equal("Test Title");
      expect(content.description).to.equal("Test Description");
      expect(content.ipfsHash).to.equal("QmTest");
      expect(content.price).to.equal(100);
      expect(content.isActive).to.equal(true);
      expect(content.contentType).to.equal(0); // ContentType.Ebook
    });

    it("Should retrieve creator's contents", async function () {
      const creatorContents = await contentPlatform.getCreatorContents(owner.address);
      expect(creatorContents.length).to.equal(2);
      expect(creatorContents[0].title).to.equal("Test Title");
      expect(creatorContents[1].title).to.equal("Test Title 2");
    });

    it("Should retrieve available contents", async function () {
      const availableContents = await contentPlatform.getAvailableContents();
      expect(availableContents.length).to.equal(2);
      expect(availableContents[0].title).to.equal("Test Title");
      expect(availableContents[1].title).to.equal("Test Title 3");
    });
  });
});