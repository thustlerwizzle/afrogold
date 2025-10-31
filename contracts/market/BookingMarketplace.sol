// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title BookingMarketplace
/// @notice Simple HBAR marketplace for ERC-721 Booking NFTs with expiry guard
contract BookingMarketplace is ReentrancyGuard {
    struct Listing {
        address nft;
        uint256 tokenId;
        address seller;
        uint256 priceHBAR; // price denominated in HBAR's smallest unit (wei-equivalent on Hedera EVM)
        uint64  expiresAt; // unix timestamp (seconds); if 0 = no expiry
    }

    mapping(bytes32 => Listing) public listings; // key = keccak(nft, tokenId)

    event Listed(address indexed nft, uint256 indexed tokenId, address indexed seller, uint256 priceHBAR, uint64 expiresAt);
    event Cancelled(address indexed nft, uint256 indexed tokenId);
    event Purchased(address indexed nft, uint256 indexed tokenId, address seller, address buyer, uint256 priceHBAR);

    function _key(address nft, uint256 tokenId) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(nft, tokenId));
    }

    function list(address nft, uint256 tokenId, uint256 priceHBAR, uint64 expiresAt) external {
        require(priceHBAR > 0, "price=0");
        IERC721 erc = IERC721(nft);
        require(erc.ownerOf(tokenId) == msg.sender, "not owner");
        require(erc.isApprovedForAll(msg.sender, address(this)) || erc.getApproved(tokenId) == address(this), "not approved");
        listings[_key(nft, tokenId)] = Listing(nft, tokenId, msg.sender, priceHBAR, expiresAt);
        emit Listed(nft, tokenId, msg.sender, priceHBAR, expiresAt);
    }

    function cancel(address nft, uint256 tokenId) external {
        bytes32 k = _key(nft, tokenId);
        Listing memory l = listings[k];
        require(l.seller == msg.sender, "not seller");
        delete listings[k];
        emit Cancelled(nft, tokenId);
    }

    function buy(address nft, uint256 tokenId) external payable nonReentrant {
        bytes32 k = _key(nft, tokenId);
        Listing memory l = listings[k];
        require(l.seller != address(0), "not listed");
        if (l.expiresAt != 0) {
            require(block.timestamp <= l.expiresAt, "expired");
        }
        require(msg.value == l.priceHBAR, "bad price");
        delete listings[k];
        IERC721(l.nft).safeTransferFrom(l.seller, msg.sender, l.tokenId);
        // forward funds to seller
        (bool ok, ) = l.seller.call{value: msg.value}("");
        require(ok, "pay fail");
        emit Purchased(l.nft, l.tokenId, l.seller, msg.sender, l.priceHBAR);
    }
}


