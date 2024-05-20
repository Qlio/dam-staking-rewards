// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAM is ERC20 {
    constructor() ERC20("Digital Art Movement", "DAM") {
        _mint(msg.sender, 10_000_000_000 * 10 ** decimals());
    }
}
