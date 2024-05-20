pragma experimental ABIEncoderV2;
pragma solidity ^0.5.16;

import "./Owned.sol";
import "./interfaces/IStakingRewards.sol";
import "./interfaces/IStakingRewardHelper.sol";
import "./interfaces/IMessenger.sol";

contract StakingRewardHelper is IStakingRewardHelper, Owned {

    IMessenger constant messenger; // = IMessenger(0x4200000000000000000000000000000000000007);
    address public l1Vault;
    address[6] public stakingRewards;

    /* ========== CONSTRUCTOR ========== */

    constructor(address _owner, address _messenger) public Owned(_owner) {
        messenger = IMessenger(_messenger);
    }

    /* ========== VIEWS ========== */

    function getDetailedEarnedInfo(address account) external view returns (uint256, uint256[6] memory) {
        uint256 sum = 0;
        uint256[6] memory earned;
        for (uint8 i = 0; i < 6; i++) {
            uint256 earnedAmount = IStakingRewards(stakingRewards[i]).earned(account);
            sum += earnedAmount;
            earned[i] = earnedAmount;
        }
        return (sum, earned);
    }

    function stakingPoolInfos() external view returns (PoolInfo[6] memory) {
        PoolInfo[6] memory infos;
        for (uint8 i = 0; i < 6; i++) {
            infos[i] = PoolInfo({
                poolAddress: stakingRewards[i],
                rewardRate: IStakingRewards(stakingRewards[i]).rewardPerToken(),
                totalSupply: IStakingRewards(stakingRewards[i]).totalSupply()
            });
        }
        return infos;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function deposit(address account, uint256 amount, uint8 lockYear) external onlyVault {
        IStakingRewards(stakingRewards[lockYear]).stake(account, amount);
    }

    function withdraw(address account, uint256 amount) external onlyVault {
        IStakingRewards(stakingRewards[0]).withdraw(account, amount);
    }

    function claimAll() external {
        for (uint8 i = 0; i < 6; i++) {
            IStakingRewards(stakingRewards[i]).getReward(msg.sender);
        }
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function setL1Vault(address _l1Vault) public onlyOwner {
        l1Vault = _l1Vault;
    }

    function setStakingRewards(address[6] memory _stakingRewards) public onlyOwner {
        stakingRewards = _stakingRewards;
    }

    /* ========== MODIFIERS ========== */

    /// @notice A modifier that only allows the bridge to call
    modifier onlyVault() {
        require(msg.sender == address(messenger) && messenger.xDomainMessageSender() == l1Vault, "Caller is not the Vault");
        _;
    }

}
