// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameItem is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string constant URIBase = "https://test.paxfinancial.ai/obj/obj-afc93eb2842d/";
    string constant URIExt = ".json";

    constructor() ERC721("GameItem", "ITM") {}

    function _concatenate(string memory a, string memory b, string memory c) 
        internal pure returns (string memory) {
            return string(abi.encodePacked(a,b,c));
    }

    function awardItem()
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        
        if (newItemId < 5) {
            _mint(msg.sender, newItemId);
            _setTokenURI(newItemId, _concatenate(URIBase, Strings.toString(newItemId), URIExt));

            _tokenIds.increment();
        }
        return newItemId;
    }
}