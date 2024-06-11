const { expect } = require("chai");

describe("ContentPlatform", function () {
  let ContentPlatform, contentPlatform, owner, addr1, addr2;

  beforeEach(async function () {
    ContentPlatform = await ethers.getContractFactory("ContentPlatform");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    contentPlatform = await ContentPlatform.deploy();
  });

  describe("Content Submission and Approval", function () {
    it("Should submit a new content for review and emit event", async function () {
      await expect(
        contentPlatform.submitContentForReview(
          "Test Title",
          "Test Description",
          "QmTest",
          100,
          0, // ContentType.Ebook
          { viewOnly: true, download: false }
        )
      )
        .to.emit(contentPlatform, "ContentSubmitted")
        .withArgs(1, owner.address, "Test Title", "Test Description", "QmTest", 100, 0);
    });

    it("Should approve submitted content and emit event", async function () {
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
      await expect(contentPlatform.approveContent(1, "QmTest"))
        .to.emit(contentPlatform, "ContentApproved")
        .withArgs(1, owner.address);
    });

    it("Should reject submitted content and emit event", async function () {
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
      await expect(contentPlatform.rejectContent(1))
        .to.emit(contentPlatform, "ContentRejected")
        .withArgs(1, owner.address);
    });

    it("Should not approve already approved content", async function () {
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
      await contentPlatform.approveContent(1, "QmTest");
      await expect(contentPlatform.approveContent(1, "QmTest")).to.be.reverted;
    });

    it("Should not approve content with existing hash", async function () {
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
      await contentPlatform.approveContent(1, "QmTest");
      await contentPlatform.submitContentForReview(
        "Another Title",
        "Another Description",
        "QmTest",
        200,
        1, // ContentType.Video
        { viewOnly: true, download: false }
      );
      await expect(contentPlatform.approveContent(2, "QmTest")).to.be.reverted;
    });

    it("Should not reject already rejected content", async function () {
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
      await contentPlatform.rejectContent(1);
      await expect(contentPlatform.rejectContent(1)).to.be.reverted;
    });
  });

  describe("Content Purchase", function () {
    beforeEach(async function () {
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
      await contentPlatform.approveContent(1, "QmTest");
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
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
      await contentPlatform.approveContent(1, "QmTest");
      await contentPlatform.submitContentForReview(
        "Test Title 2",
        "Test Description 2",
        "QmTest2",
        200,
        1, // ContentType.Video
        { viewOnly: true, download: false }
      );
      await contentPlatform.approveContent(2, "QmTest2");
      await contentPlatform.connect(addr1).submitContentForReview(
        "Test Title 3",
        "Test Description 3",
        "QmTest3",
        300,
        2, // ContentType.Music
        { viewOnly: true, download: false }
      );
      await contentPlatform.connect(owner).approveContent(3, "QmTest3");
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

    it("Should retrieve active contents", async function () {
      const availableContents = await contentPlatform.getAvailableContents();
      expect(availableContents.length).to.equal(2);
      expect(availableContents[0].title).to.equal("Test Title");
      expect(availableContents[1].title).to.equal("Test Title 3");
    });

    it("Should retrieve contents by owner", async function () {
      const creatorContents = await contentPlatform.getCreatorContents(owner.address);
      expect(creatorContents.length).to.equal(2);
      expect(creatorContents[0].title).to.equal("Test Title");
      expect(creatorContents[1].title).to.equal("Test Title 2");
    });
  });

  describe("Ownership and Access Control", function () {
    beforeEach(async function () {
      await contentPlatform.submitContentForReview(
        "Test Title",
        "Test Description",
        "QmTest",
        100,
        0, // ContentType.Ebook
        { viewOnly: true, download: false }
      );
    });

    it("Should only allow owner to approve content", async function () {
      await expect(contentPlatform.connect(addr1).approveContent(1, "QmTest")).to.be.reverted;
    });

    it("Should only allow owner to reject content", async function () {
      await expect(contentPlatform.connect(addr1).rejectContent(1)).to.be.reverted;
    });
  });
});
