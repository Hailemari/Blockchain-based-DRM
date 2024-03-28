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







// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract ContentManager {
//     struct Content {
//         uint256 id;
//         address creator;
//         string title;
//         string description;
//         uint256 price;
//         string contentHash; // IPFS content hash
//         bool isActive;
//         string contentType; // e.g., "music", "book"
//         string author; // Author/artist name
//     }

//     mapping(uint256 => Content) public contents;
//     uint256 public contentCount;

//     mapping(address => mapping(uint256 => bool)) public purchasedContents;

//     mapping(address => string) public userOffChainAccounts;

//     event ContentUploaded(uint256 indexed contentId, address indexed creator, string title, uint256 price, string contentHash);
//     event ContentPurchased(uint256 indexed contentId, address indexed buyer);

//     modifier onlyCreator() {
//         require(bytes(userOffChainAccounts[msg.sender]).length > 0, "User not registered");
//         _;
//     }

//     function registerOffChainAccount(string memory offChainAccount) public {
//         userOffChainAccounts[msg.sender] = offChainAccount;
//     }

//     function uploadContent(string memory title, string memory description, uint256 price, string memory contentHash, string memory contentType, string memory author) public onlyCreator {
//         contentCount++;
//         contents[contentCount] = Content(contentCount, msg.sender, title, description, price, contentHash, true, contentType, author);
//         emit ContentUploaded(contentCount, msg.sender, title, price, contentHash);
//     }

//     function purchaseContent(uint256 contentId) public payable {
//         Content memory content = contents[contentId];
//         require(content.isActive, "Content is not available for purchase");
//         require(msg.value >= content.price, "Insufficient funds");
//         require(!purchasedContents[msg.sender][contentId], "Content already purchased");

//         purchasedContents[msg.sender][contentId] = true;
//         payable(content.creator).transfer(msg.value);

//         emit ContentPurchased(contentId, msg.sender);
//     }

//     function getContent(uint256 contentId) public view returns (Content memory) {
//         return contents[contentId];
//     }

//     function getOwnedContents(address user) public view returns (uint256[] memory) {
//         uint256[] memory ownedContentsIds = new uint256[](contentCount);
//         uint256 count = 0;

//         for (uint256 i = 1; i <= contentCount; i++) {
//             if (purchasedContents[user][i]) {
//                 ownedContentsIds[count] = i;
//                 count++;
//             }
//         }

//         return ownedContentsIds;
//     }
// }
