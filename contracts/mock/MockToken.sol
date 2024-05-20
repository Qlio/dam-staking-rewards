pragma solidity ^0.5.16;

import "openzeppelin-solidity-2.3.0/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity-2.3.0/contracts/token/ERC20/ERC20Detailed.sol";

contract MockToken is ERC20, ERC20Detailed {
    constructor() public ERC20Detailed("Mock Token", "MT", 18) {
        _mint(msg.sender, 10_000_000_000 * 10 ** 18);
    }
}
