//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract nftmarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    mapping(uint256 => Marketplaceitem) private idToMarketItem;

    struct Marketplaceitem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address payable artist;
        uint256 price;
        uint256 royalty;
        bool sold;
        uint256 likeCount;
    }

    constructor() ERC721("TEST", "$NFT") {
        owner = payable(msg.sender);
    }

    function mintToken(
        string memory tokenURI,
        uint256 price,
        uint256 royalty
    ) public payable returns (uint256) {
        //minting logic
        //upload tokenURI to IPFS
        //call to create marketItem.
        require(
            royalty < price,
            "royalty should be less than the listing price"
        );
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current(); 

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketplaceitem(newTokenId, price, royalty);
        return newTokenId;
    
    }

    function createMarketplaceitem(
        uint256 tokenId,
        uint256 price,
        uint256 royalty
    ) private {
        require(price > 0, "selling price must be greater than 0");
        require(
            price >= royalty,
            "Selling price must be atleast greater than royalty"
        );
        idToMarketItem[tokenId] = Marketplaceitem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            payable(msg.sender),
            price,
            royalty,
            false,
            0
        );

        _transfer(msg.sender, address(this), tokenId);
        //emit event
    }

    function buyFromMarketitems(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        uint256 royalty = idToMarketItem[tokenId].royalty;
        address artist = idToMarketItem[tokenId].artist;

        require(msg.value == price, "Sent value is less than asking price");

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);

        //transfer the royalty to the artist (token minter)
        payable(artist).transfer(royalty);
        //transfer the remaining value to the seller;
        payable(seller).transfer(msg.value - royalty);
    }

    function getAllMarketitems()
        public
        view
        returns (Marketplaceitem[] memory)
    {
        uint256 itemCount = _tokenIds.current();
        uint256 currentIndex = 0;
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();

        Marketplaceitem[] memory items = new Marketplaceitem[](unsoldItemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                Marketplaceitem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNfts() public view returns (Marketplaceitem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        Marketplaceitem[] memory items = new Marketplaceitem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                Marketplaceitem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can resell token"
        );
        require(
            idToMarketItem[tokenId].royalty < price,
            "price should be atleast greater than royalty"
        );

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }
}
