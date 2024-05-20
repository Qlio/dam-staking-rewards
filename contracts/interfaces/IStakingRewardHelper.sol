pragma experimental ABIEncoderV2;
pragma solidity ^0.5.16;

interface IStakingRewardHelper {
    struct PoolInfo {
        address poolAddress;
        uint256 rewardRate;
        uint256 totalSupply;
    }

    function deposit(address account, uint256 amount, uint8 lockYear) external;
    function withdraw(address, uint256) external;

    function getDetailedEarnedInfo(address account) external view returns (uint256, uint256[6] memory);
    function stakingPoolInfos() external view returns (PoolInfo[6] memory);

}
