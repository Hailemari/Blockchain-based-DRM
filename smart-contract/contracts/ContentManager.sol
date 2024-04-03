// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ContentPlatform is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private contentIdCounter;

    mapping(string => bool) private contentHashExists;

    enum ContentType { EBook, Music }
    enum SubscriptionPeriod { Monthly, Annually, Lifetime }

    struct Content {
        uint256 id;
        string title;
        string description;
        string contentHash; // IPFS hash of the content file
        uint256 monthlyPrice;
        uint256 annualPrice;
        uint256 lifetimePrice;
        ContentType contentType;
        address payable creator;
        uint256 subscriberCount;
        mapping(address => SubscriptionInfo) subscribers;
    }

    struct SubscriptionInfo {
        SubscriptionPeriod period;
        uint256 expirationTime;
    }

    mapping(uint256 => Content) public contents;

    event ContentUploaded(
        uint256 indexed id,
        string title,
        string description,
        string contentHash,
        uint256 monthlyPrice,
        uint256 annualPrice,
        uint256 lifetimePrice,
        ContentType contentType,
        address indexed creator
    );

    event Subscribed(
        uint256 indexed contentId,
        address indexed subscriber,
        SubscriptionPeriod period,
        uint256 expirationTime
    );

    event Unsubscribed(uint256 indexed contentId, address indexed subscriber);

    function uploadContent(
        string memory _title,
        string memory _description,
        string memory _contentHash,
        uint256 _monthlyPrice,
        uint256 _annualPrice,
        uint256 _lifetimePrice,
        ContentType _contentType
    ) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty");
        require(!contentHashExists[_contentHash], "Content with this hash already exists");
        require(_monthlyPrice > 0 || _annualPrice > 0 || _lifetimePrice > 0, "At least one price must be set");

        contentHashExists[_contentHash] = true;

        contentIdCounter.increment();
        uint256 contentId = contentIdCounter.current();

        Content storage newContent = contents[contentId];
        newContent.id = contentId;
        newContent.title = _title;
        newContent.description = _description;
        newContent.contentHash = _contentHash;
        newContent.monthlyPrice = _monthlyPrice;
        newContent.annualPrice = _annualPrice;
        newContent.lifetimePrice = _lifetimePrice;
        newContent.contentType = _contentType;
        newContent.creator = payable(msg.sender);
        newContent.subscriberCount = 0;

        emit ContentUploaded(
            contentId,
            _title,
            _description,
            _contentHash,
            _monthlyPrice,
            _annualPrice,
            _lifetimePrice,
            _contentType,
            msg.sender
        );
    }



    function subscribe(uint256 _contentId, SubscriptionPeriod _period) public payable {
        Content storage content = contents[_contentId];
        require(content.id != 0, "Content does not exist");
        require(!isSubscribed(_contentId, msg.sender), "Already subscribed");

        uint256 price;
        uint256 expirationTime;

        if (_period == SubscriptionPeriod.Monthly) {
            require(content.monthlyPrice > 0, "Monthly subscription not available");
            price = content.monthlyPrice;
            expirationTime = block.timestamp + 30 days;
        } else if (_period == SubscriptionPeriod.Annually) {
            require(content.annualPrice > 0, "Annual subscription not available");
            price = content.annualPrice;
            expirationTime = block.timestamp + 365 days;
        } else {
            require(content.lifetimePrice > 0, "Lifetime subscription not available");
            price = content.lifetimePrice;
            expirationTime = type(uint256).max;
        }

        require(msg.value >= price, "Insufficient payment");

        content.subscribers[msg.sender] = SubscriptionInfo(_period, expirationTime);
        content.subscriberCount++;
        content.creator.transfer(msg.value);

        emit Subscribed(_contentId, msg.sender, _period, expirationTime);
    }

    function unsubscribe(uint256 _contentId) public {
        Content storage content = contents[_contentId];
        require(content.id != 0, "Content does not exist");
        require(isSubscribed(_contentId, msg.sender), "Not subscribed");

        delete content.subscribers[msg.sender];
        content.subscriberCount--;

        emit Unsubscribed(_contentId, msg.sender);
    }

    function isSubscribed(uint256 _contentId, address _subscriber) public view returns (bool) {
        Content storage content = contents[_contentId];
        SubscriptionInfo storage info = content.subscribers[_subscriber];
        return info.expirationTime >= block.timestamp;
    }

    function getSubscribedContents(address _subscriber) public view returns (uint256[] memory) {
        uint256[] memory subscribedContents = new uint256[](contentIdCounter.current());
        uint256 counter = 0;

        for (uint256 i = 1; i <= contentIdCounter.current(); i++) {
            if (isSubscribed(i, _subscriber)) {
                subscribedContents[counter] = i;
                counter++;
            }
        }

        return subscribedContents;
    }

    function getContentDetails(uint256 _contentId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            ContentType,
            address,
            uint256
        )
    {
        Content storage content = contents[_contentId];
        require(content.id != 0, "Content does not exist");

        return (
            content.title,
            content.description,
            content.contentHash,
            content.monthlyPrice,
            content.annualPrice,
            content.lifetimePrice,
            content.contentType,
            content.creator,
            content.subscriberCount
        );
    }

    function getSubscriptionInfo(uint256 _contentId, address _subscriber)
        public
        view
        returns (SubscriptionPeriod, uint256)
    {
        Content storage content = contents[_contentId];
        require(content.id != 0, "Content does not exist");
        SubscriptionInfo storage info = content.subscribers[_subscriber];
        return (info.period, info.expirationTime);
    }
}







// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract ContentPlatform {
//     struct Content {
//         uint256 id;
//         address creator;
//         string title;
//         string description;
//         string ipfsHash;
//         uint256 price;
//         bool isActive;
//     }

//     mapping(uint256 => Content) public contents;
//     mapping(address => mapping(uint256 => bool)) public contentPurchases;
//     uint256 public contentCount;

//     event ContentCreated(uint256 indexed id, address indexed creator, string title, string description, string ipfsHash, uint256 price);
//     event ContentPurchased(uint256 indexed id, address indexed buyer, address indexed creator, string ipfsHash, uint256 price);

//     modifier onlyCreator(uint256 _id) {
//         require(contents[_id].creator == msg.sender, "You are not the creator of this content.");
//         _;
//     }

//     function createContent(string memory _title, string memory _description, string memory _ipfsHash, uint256 _price) public {
//         contentCount++;
//         contents[contentCount] = Content(contentCount, msg.sender, _title, _description, _ipfsHash, _price, true);
//         emit ContentCreated(contentCount, msg.sender, _title, _description, _ipfsHash, _price);
//     }

//     function updateContent(uint256 _id, string memory _title, string memory _description, string memory _ipfsHash, uint256 _price) public onlyCreator(_id) {
//         Content storage content = contents[_id];
//         content.title = _title;
//         content.description = _description;
//         content.ipfsHash = _ipfsHash;
//         content.price = _price;
//     }

//     function toggleContentStatus(uint256 _id) public onlyCreator(_id) {
//         contents[_id].isActive = !contents[_id].isActive;
//     }

//     function purchaseContent(uint256 _id) public payable {
//         Content storage content = contents[_id];
//         require(content.isActive, "This content is not available for purchase.");
//         require(msg.value >= content.price, "Insufficient funds to purchase this content.");
//         require(!contentPurchases[msg.sender][_id], "You have already purchased this content.");

//         contentPurchases[msg.sender][_id] = true;
//         payable(content.creator).transfer(content.price);
//         emit ContentPurchased(_id, msg.sender, content.creator, content.ipfsHash, content.price);
//     }

//     function getContent(uint256 _id) public view returns (Content memory) {
//         return contents[_id];
//     }

//     function getCreatorContents(address _creator) public view returns (Content[] memory) {
//         uint256 creatorContentCount = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].creator == _creator) {
//                 creatorContentCount++;
//             }
//         }

//         Content[] memory creatorContents = new Content[](creatorContentCount);
//         uint256 index = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].creator == _creator) {
//                 creatorContents[index] = contents[i];
//                 index++;
//             }
//         }

//         return creatorContents;
//     }

//     function getAvailableContents() public view returns (Content[] memory) {
//         uint256 availableContentCount = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].isActive) {
//                 availableContentCount++;
//             }
//         }

//         Content[] memory availableContents = new Content[](availableContentCount);
//         uint256 index = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].isActive) {
//                 availableContents[index] = contents[i];
//                 index++;
//             }
//         }

//         return availableContents;
//     }
// }



// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Strings.sol";

// contract ContentPlatform {
//     using Strings for uint256;

//     struct Content {
//         uint256 id;
//         address creator;
//         string title;
//         string description;
//         string ipfsHash;
//         uint256 price;
//         bool isActive;
//     }

//     mapping(uint256 => Content) public contents;
//     mapping(address => mapping(uint256 => bool)) public contentPurchases;
//     mapping(bytes32 => bool) public existingContentHashes;
//     uint256 public contentCount;

//     event ContentCreated(uint256 indexed id, address indexed creator, string title, string description, string ipfsHash, uint256 price);
//     event ContentPurchased(uint256 indexed id, address indexed buyer, address indexed creator, string ipfsHash, uint256 price);

//     modifier onlyCreator(uint256 _id) {
//         require(contents[_id].creator == msg.sender, "You are not the creator of this content.");
//         _;
//     }

//     function createContent(string memory _title, string memory _description, string memory _ipfsHash, uint256 _price) public {
//         bytes32 contentHash = keccak256(abi.encodePacked(_ipfsHash));
//         require(!existingContentHashes[contentHash], "Similar content already exists.");

//         contentCount++;
//         contents[contentCount] = Content(contentCount, msg.sender, _title, _description, _ipfsHash, _price, true);
//         existingContentHashes[contentHash] = true;
//         emit ContentCreated(contentCount, msg.sender, _title, _description, _ipfsHash, _price);
//     }

//     function updateContent(uint256 _id, string memory _title, string memory _description, string memory _ipfsHash, uint256 _price) public onlyCreator(_id) {
//         bytes32 contentHash = keccak256(abi.encodePacked(_ipfsHash));
//         require(!existingContentHashes[contentHash] || contents[_id].ipfsHash == _ipfsHash, "Similar content already exists.");

//         Content storage content = contents[_id];
//         content.title = _title;
//         content.description = _description;
//         content.ipfsHash = _ipfsHash;
//         content.price = _price;

//         if (content.ipfsHash != _ipfsHash) {
//             existingContentHashes[keccak256(abi.encodePacked(content.ipfsHash))] = false;
//             existingContentHashes[contentHash] = true;
//         }
//     }

//     function toggleContentStatus(uint256 _id) public onlyCreator(_id) {
//         contents[_id].isActive = !contents[_id].isActive;
//     }

//     function purchaseContent(uint256 _id) public payable {
//         Content storage content = contents[_id];
//         require(content.isActive, "This content is not available for purchase.");
//         require(msg.value >= content.price, "Insufficient funds to purchase this content.");
//         require(!contentPurchases[msg.sender][_id], "You have already purchased this content.");

//         contentPurchases[msg.sender][_id] = true;
//         payable(content.creator).transfer(content.price);
//         emit ContentPurchased(_id, msg.sender, content.creator, content.ipfsHash, content.price);
//     }

//     function getContent(uint256 _id) public view returns (Content memory) {
//         return contents[_id];
//     }

//      function getCreatorContents(address _creator) public view returns (Content[] memory) {
//         uint256 creatorContentCount = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].creator == _creator) {
//                 creatorContentCount++;
//             }
//         }

//         Content[] memory creatorContents = new Content[](creatorContentCount);
//         uint256 index = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].creator == _creator) {
//                 creatorContents[index] = contents[i];
//                 index++;
//             }
//         }

//         return creatorContents;
//     }

//     function getAvailableContents() public view returns (Content[] memory) {
//         uint256 availableContentCount = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].isActive) {
//                 availableContentCount++;
//             }
//         }

//         Content[] memory availableContents = new Content[](availableContentCount);
//         uint256 index = 0;
//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (contents[i].isActive) {
//                 availableContents[index] = contents[i];
//                 index++;
//             }
//         }

//         return availableContents;
//     }
// }