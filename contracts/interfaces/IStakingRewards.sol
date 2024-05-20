pragma solidity ^0.5.16;

// https://docs.synthetix.io/contracts/source/interfaces/istakingrewards
interface IStakingRewards {
    // Views

    function balanceOf(address account) external view returns (uint256);

    function earned(address account) external view returns (uint256);

    function getRewardForDuration() external view returns (uint256);

    function lastTimeRewardApplicable() external view returns (uint256);

    function rewardPerToken() external view returns (uint256);

    function rewardsToken() external view returns (address);

    function totalSupply() external view returns (uint256);

    // Mutative

    function getReward(address account) external;

    function stake(address account, uint256 amount) external;

    function withdraw(address account, uint256 amount) external;
}
