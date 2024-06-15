// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ContentPlatform is Ownable {
    using Strings for uint256;

    enum ContentType { Ebook, Video, Music }
    enum ContentStatus { Pending, Approved, Rejected }

    struct Content {
        uint256 id;
        address creator;
        string title;
        string description;
        string ipfsHash;
        uint256 price;
        bool isActive;
        ContentType contentType;
        ContentStatus status;
        Permission permissions;
    }

    struct Permission {
        bool viewOnly;
        bool download;
    }

    

    mapping(uint256 => Content) public contents;
    mapping(address => mapping(uint256 => bool)) public contentPurchases;
    mapping(bytes32 => bool) public existingContentHashes;
    uint256 public contentCount;

    event ContentSubmitted(
        uint256 indexed id,
        address indexed creator,
        string title,
        string description,
        string ipfsHash,
        uint256 price,
        ContentType contentType
    );
    event ContentApproved(uint256 indexed id, address indexed admin);
    event ContentRejected(uint256 indexed id, address indexed admin);
    event ContentCreated(uint256 indexed id, address indexed creator, string title, string description, string ipfsHash, uint256 price, ContentType contentType);
    event ContentPurchased(uint256 indexed id, address indexed buyer, address indexed creator, string ipfsHash, uint256 price);
    event ContentDeleted(uint256 indexed id, address indexed creator);

    modifier onlyCreator(uint256 _id) {
        require(contents[_id].creator == msg.sender, "You are not the creator of this content.");
        _;
    }

    function getContentByHash(string memory _ipfsHash) public view returns (bool, Content memory) {
        for (uint i = 1; i <= contentCount; i++) {
            if (keccak256(abi.encodePacked(contents[i].ipfsHash)) == keccak256(abi.encodePacked(_ipfsHash))) {
                return (true, contents[i]);
            }
        }
        return (false, Content(0, address(0), "", "", "", 0, false, ContentType.Ebook, ContentStatus.Pending, Permission(false, false)));
    }

    
    function submitContentForReview(
            string memory _title,
            string memory _description,
            string memory _ipfsHash,
            uint256 _price,
            ContentType _contentType,
            Permission memory _permissions
        ) public {
            require(bytes(_ipfsHash).length > 0, "IPFS hash is required");

            contentCount++;
            contents[contentCount] = Content(
                contentCount,
                msg.sender,
                _title,
                _description,
                _ipfsHash,
                _price,
                false,
                _contentType,
                ContentStatus.Pending,
                _permissions
            );

            emit ContentSubmitted(
                contentCount,
                msg.sender,
                _title,
                _description,
                _ipfsHash,
                _price,
                _contentType
            );
        }

    function approveContent(uint256 _id, string memory _ipfsHash) public onlyOwner {
        Content storage content = contents[_id];
        require(content.status == ContentStatus.Pending, "Content is not pending approval.");

        bytes32 contentHash = keccak256(abi.encodePacked(_ipfsHash));
        require(!existingContentHashes[contentHash], "Similar content already exists.");

        content.ipfsHash = _ipfsHash;
        content.isActive = true;
        content.status = ContentStatus.Approved;
        existingContentHashes[contentHash] = true;

        emit ContentApproved(_id, msg.sender);
        emit ContentCreated(_id, content.creator, content.title, content.description, _ipfsHash, content.price, content.contentType);
    }

    function rejectContent(uint256 _id) public onlyOwner {
        Content storage content = contents[_id];
        require(content.status == ContentStatus.Pending, "Content is not pending approval.");
        content.status = ContentStatus.Rejected;
        emit ContentRejected(_id, msg.sender);
    }

    

    function getContent(uint256 _id) public view returns (Content memory) {
        return contents[_id];
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

    function getPurchasedContents(address _buyer) public view returns (Content[] memory) {
        uint256 purchasedContentCount = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contentPurchases[_buyer][i]) {
                purchasedContentCount++;
            }
        }
        Content[] memory purchasedContents = new Content[](purchasedContentCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contentPurchases[_buyer][i]) {
                purchasedContents[index] = contents[i];
                index++;
            }
        }
        return purchasedContents;
    }

    function getPendingContents() public view returns (Content[] memory) {
        uint256 pendingContentCount = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].status == ContentStatus.Pending) {
                pendingContentCount++;
            }
        }
        Content[] memory pendingContents = new Content[](pendingContentCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].status == ContentStatus.Pending) {
                pendingContents[index] = contents[i];
                index++;
            }
        }
        return pendingContents;
    }

    function getApprovedContents() public view returns (Content[] memory) {
        uint256 approvedContentCount = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].status == ContentStatus.Approved) {
                approvedContentCount++;
            }
        }
        Content[] memory approvedContents = new Content[](approvedContentCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].status == ContentStatus.Approved) {
                approvedContents[index] = contents[i];
                index++;
            }
        }
        return approvedContents;
    }

    function getRejectedContents() public view returns (Content[] memory) {
        uint256 rejectedContentCount = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].status == ContentStatus.Rejected) {
                rejectedContentCount++;
            }
        }
        Content[] memory rejectedContents = new Content[](rejectedContentCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].status == ContentStatus.Rejected) {
                rejectedContents[index] = contents[i];
                index++;
            }
        }
        return rejectedContents;
    }

    function getContentPermissions(uint256 _id) public view returns (Permission memory) {
        return contents[_id].permissions;
    }

    function getSoldContentsAndIncome(address _creator) public view returns (Content[] memory, uint256) {
        uint256 soldContentCount = 0;
        uint256 totalIncome = 0;

        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].creator == _creator && contents[i].isActive && contents[i].status == ContentStatus.Approved) {
                if (isContentSold(i)) {
                    soldContentCount++;
                    totalIncome += contents[i].price;
                }
            }
        }

        
        Content[] memory soldContents = new Content[](soldContentCount);
        uint256 index = 0;

       
        for (uint256 i = 1; i <= contentCount; i++) {
            if (contents[i].creator == _creator && contents[i].isActive && contents[i].status == ContentStatus.Approved) {
                if (isContentSold(i)) {
                    soldContents[index] = contents[i];
                    index++;
                }
            }
        }

        return (soldContents, totalIncome);
    }

    function isContentSold(uint256 _id) internal view returns (bool) {
        for (uint256 j = 1; j <= contentCount; j++) {
            if (contentPurchases[address(uint160(j))][_id]) {
                return true;
            }
        }
        return false;
    }

}






