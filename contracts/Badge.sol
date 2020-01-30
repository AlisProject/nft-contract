pragma solidity 0.5.12;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Badge is ERC721Full, MinterRole {
    using SafeMath for uint256;

    //////// Storage ////////
    uint256 public constant TYPE_ID_OFFSET = 100000000;

    mapping(uint256 => string) public tokenURIs;
    string public baseURI;

    mapping(uint256 => uint256) public badgeTypeSupply;

    //////// Constructor ////////
    constructor() public ERC721Full("ALIS:Badge", "ALISB") {
    }

    //////// Function ////////
    function bulkMint(address[] calldata toAddresses, uint256 typeId, string calldata _tokenURI) external onlyMinter returns (bool) {
        for (uint256 i = 0; i < toAddresses.length; i++) {
            badgeTypeSupply[typeId]++;
            uint256 tokenId = typeId.mul(TYPE_ID_OFFSET).add(badgeTypeSupply[typeId]);
            _mint(toAddresses[i], tokenId);
            tokenURIs[tokenId] = _tokenURI;
        }

        return true;
    }

    function setBaseURI(string calldata _baseURI) external onlyMinter {
        baseURI = _baseURI;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = tokenURIs[tokenId];
        if (bytes(_tokenURI).length == 0) {
            return "";
        } else {
            return string(abi.encodePacked(baseURI, _tokenURI));
        }
    }

    function setTokenURI(uint256 tokenId, string calldata uri) external onlyMinter {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        tokenURIs[tokenId] = uri;
    }
}

