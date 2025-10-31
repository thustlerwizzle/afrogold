// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PropertyNFTRegistry
/// @notice Minimal ERC-721 registry to mint NFTs for property listings and booking receipts
contract PropertyNFTRegistry is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    // propertyId (off-chain) -> tokenId mapping for deterministic lookup if needed
    mapping(bytes32 => uint256) public propertyIdToTokenId;

    event PropertyMinted(uint256 indexed tokenId, bytes32 indexed propertyIdHash, address indexed to, string tokenURI);

    constructor() ERC721("AfroGold Property", "AFGPROP") Ownable(msg.sender) {}

    /// @notice Mint a property NFT to the host wallet
    /// @param to recipient wallet (host)
    /// @param propertyId arbitrary string id used by the app (e.g., property_<timestamp>)
    /// @param tokenURI metadata URI (ipfs:// or https://)
    function mintProperty(address to, string calldata propertyId, string calldata tokenURI) external onlyOwner returns (uint256 tokenId) {
        tokenId = ++nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        bytes32 pid = keccak256(bytes(propertyId));
        propertyIdToTokenId[pid] = tokenId;
        emit PropertyMinted(tokenId, pid, to, tokenURI);
    }

    /// @notice Batch mint multiple property NFTs in a single transaction
    function mintBatch(
        address[] calldata to,
        string[] calldata propertyIds,
        string[] calldata tokenURIs
    ) external onlyOwner returns (uint256[] memory tokenIds) {
        require(to.length == propertyIds.length && propertyIds.length == tokenURIs.length, "len");
        tokenIds = new uint256[](to.length);
        for (uint256 i = 0; i < to.length; i++) {
            uint256 tokenId = ++nextTokenId;
            _safeMint(to[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            bytes32 pid = keccak256(bytes(propertyIds[i]));
            propertyIdToTokenId[pid] = tokenId;
            emit PropertyMinted(tokenId, pid, to[i], tokenURIs[i]);
            tokenIds[i] = tokenId;
        }
    }
}


