// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";

contract ContentPlatform {
    using Strings for uint256;

    struct Content {
        uint256 id;
        address creator;
        string title;
        string description;
        string ipfsHash;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Content) public contents;
    mapping(address => mapping(uint256 => bool)) public contentPurchases;
    mapping(bytes32 => bool) public existingContentHashes;
    uint256 public contentCount;

    event ContentCreated(uint256 indexed id, address indexed creator, string title, string description, string ipfsHash, uint256 price);
    event ContentPurchased(uint256 indexed id, address indexed buyer, address indexed creator, string ipfsHash, uint256 price);

    modifier onlyCreator(uint256 _id) {
        require(contents[_id].creator == msg.sender, "You are not the creator of this content.");
        _;
    }

    function createContent(string memory _title, string memory _description, string memory _ipfsHash, uint256 _price) public {
        bytes32 contentHash = keccak256(abi.encodePacked(_ipfsHash));
        require(!existingContentHashes[contentHash], "Similar content already exists.");

        contentCount++;
        contents[contentCount] = Content(contentCount, msg.sender, _title, _description, _ipfsHash, _price, true);
        existingContentHashes[contentHash] = true;
        emit ContentCreated(contentCount, msg.sender, _title, _description, _ipfsHash, _price);
    }

    function updateContent(uint256 _id, string memory _title, string memory _description, string memory _ipfsHash, uint256 _price) public onlyCreator(_id) {
        bytes32 contentHash = keccak256(abi.encodePacked(_ipfsHash));
        require(!existingContentHashes[contentHash] || keccak256(abi.encodePacked(contents[_id].ipfsHash)) == keccak256(abi.encodePacked(_ipfsHash)), "Similar content already exists.");

        Content storage content = contents[_id];
        content.title = _title;
        content.description = _description;
        content.ipfsHash = _ipfsHash;
        content.price = _price;

       if (keccak256(abi.encodePacked(content.ipfsHash)) != keccak256(abi.encodePacked(_ipfsHash))) {
        existingContentHashes[keccak256(abi.encodePacked(content.ipfsHash))] = false;
        existingContentHashes[contentHash] = true;
}
    }

    function toggleContentStatus(uint256 _id) public onlyCreator(_id) {
        contents[_id].isActive = !contents[_id].isActive;
    }

    function purchaseContent(uint256 _id) public payable {
        Content storage content = contents[_id];
        require(content.isActive, "This content is not available for purchase.");
        require(msg.value >= content.price, "Insufficient funds to purchase this content.");
        require(!contentPurchases[msg.sender][_id], "You have already purchased this content.");

        contentPurchases[msg.sender][_id] = true;
        payable(content.creator).transfer(content.price);
        emit ContentPurchased(_id, msg.sender, content.creator, content.ipfsHash, content.price);
    }

    function getContent(uint256 _id) public view returns (Content memory) {
        return contents[_id];
    }

     function getCreatorContents(address _creator) public view returns (Content[] memory) {
        uint256 creatorContentCount = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].creator == _creator) {
                creatorContentCount++;
            }
        }

        Content[] memory creatorContents = new Content[](creatorContentCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].creator == _creator) {
                creatorContents[index] = contents[i];
                index++;
            }
        }

        return creatorContents;
    }

    function getAvailableContents() public view returns (Content[] memory) {
        uint256 availableContentCount = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].isActive) {
                availableContentCount++;
            }
        }

        Content[] memory availableContents = new Content[](availableContentCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].isActive) {
                availableContents[index] = contents[i];
                index++;
            }
        }

        return availableContents;
    }
}