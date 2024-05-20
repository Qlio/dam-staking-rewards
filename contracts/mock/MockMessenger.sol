pragma solidity ^0.5.16;

import "../interfaces/IStakingRewardHelper.sol";

contract MockMessenger {

    address public l1Vault = 0x000000000000000000000000000000000000dEaD;

    function xDomainMessageSender() external view returns (address) {
        return l1Vault;
    }

    function sendDeposit(address helper, address account, uint256 amount, uint8 lockYear) external {
        IStakingRewardHelper(helper).deposit(account, amount, lockYear);
    }

    function sendWithdraw(address helper, address account, uint256 amount) external {
        IStakingRewardHelper(helper).withdraw(account, amount);
    }
}
