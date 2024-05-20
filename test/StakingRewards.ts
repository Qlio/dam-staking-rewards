import { expect } from "chai";
import hre from "hardhat";

describe("StakingRewards", function () {
  let ethers = hre.ethers;
  let deployer: any;
  let owner: any;
  let user: any;
  let rewardToken: any;
  let messenger: any;
  let helper: any;
  let stakingRewardArray: any[];

  beforeEach(async function () {
    [deployer, owner, user] = await ethers.getSigners();
    rewardToken = await ethers.deployContract("MockToken");
    messenger = await ethers.deployContract("MockMessenger");
    helper = await ethers.deployContract("StakingRewardHelper", [owner.address, messenger]);

    const mockL1Vault = "0x000000000000000000000000000000000000dEaD";
    await helper.connect(owner).setL1Vault(mockL1Vault);

    stakingRewardArray = [
      await ethers.deployContract("StakingRewards", [owner.address, rewardToken, helper]),
      await ethers.deployContract("StakingRewards", [owner.address, rewardToken, helper]),
      await ethers.deployContract("StakingRewards", [owner.address, rewardToken, helper]),
      await ethers.deployContract("StakingRewards", [owner.address, rewardToken, helper]),
      await ethers.deployContract("StakingRewards", [owner.address, rewardToken, helper]),
      await ethers.deployContract("StakingRewards", [owner.address, rewardToken, helper]),
    ];

    await helper.connect(owner).setStakingRewards(stakingRewardArray);
  });

  it("Flex pool only, stake -> claim -> withdraw", async function () {
    let stakingRewardFlex = stakingRewardArray[0];
    const rewardAmountFlex = ethers.parseEther("700000"); // 700k $DAM
    await rewardToken.connect(deployer).transfer(stakingRewardFlex, rewardAmountFlex);
    await stakingRewardFlex.connect(owner).notifyRewardAmount(rewardAmountFlex);

    // check reward duration
    expect(await stakingRewardFlex.rewardsDuration()).to.equal(86400 * 180);

    // check total reward amount for duration
    expect(await stakingRewardFlex.getRewardForDuration()).to.lte(rewardAmountFlex);

    const poolInfos = await helper.stakingPoolInfos();
    expect(poolInfos[1].rewardRate).to.lte(rewardAmountFlex / 86400n / 180n);
    expect(await stakingRewardFlex.rewardsDuration()).to.equal(86400 * 180);

    const userStakeAmount = ethers.parseEther("1000"); // 1000 $APE
    await messenger.sendDeposit(helper, user.address, userStakeAmount, 0); // Flex pool
    expect(await stakingRewardFlex.balanceOf(user.address)).to.equal(userStakeAmount, "user balance is not correct");

    await hre.network.provider.request({
      method: "evm_increaseTime",
      params: [86400 * 90],
    });

    // claim single pool
    await stakingRewardFlex.connect(user).claimReward();
    expect(await rewardToken.balanceOf(user.address)).to.gte(rewardAmountFlex / 2n - 1000000000000000000n);
    expect(await rewardToken.balanceOf(user.address)).to.lte(rewardAmountFlex / 2n + 1000000000000000000n);

    await messenger.sendWithdraw(helper, user.address, userStakeAmount);

    expect(await stakingRewardFlex.balanceOf(user.address)).to.equal(0);
  });

  it("Multiple pools, stake -> claim -> withdraw", async function () {
    const initialRewardAmounts = [
      // https://docs.google.com/spreadsheets/d/11AeDbapwJQn8L1aiy05sxsf0lZSihjF6wFpazEWDibY/edit#gid=2023961244
      187_613, // flex
      3_088_505, // 1Y
      4_870_179, // 2Y
      7_672_934, // 3Y
      12_078_109, // 4Y
      18_995_852, // 5Y
    ];

    const [, , , user1, user2] = await ethers.getSigners();

    // test bypass helper
    expect(stakingRewardArray[0].connect(user).stake(user.address, 1000n)).to.be.revertedWith(
      "Caller is not the helper"
    );

    // user 1 join before reward started
    const user1StakeAmount = ethers.parseEther("1000"); // 1000 $APE
    await messenger.sendDeposit(helper, user1.address, user1StakeAmount, 0); // 1 Y
    await messenger.sendDeposit(helper, user1.address, user1StakeAmount, 1); // 1 Y
    await messenger.sendDeposit(helper, user1.address, user1StakeAmount, 2); // 2 Y
    await messenger.sendDeposit(helper, user1.address, user1StakeAmount, 3); // 3 Y
    await messenger.sendDeposit(helper, user1.address, user1StakeAmount, 4); // 4 Y
    await messenger.sendDeposit(helper, user1.address, user1StakeAmount, 5); // 5 Y

    for (let i = 0; i < stakingRewardArray.length; i++) {
      const stakingReward = stakingRewardArray[i];
      const rewardAmount = ethers.parseEther(initialRewardAmounts[i].toString());
      await rewardToken.connect(deployer).transfer(stakingReward, rewardAmount);
      await stakingReward.connect(owner).notifyRewardAmount(rewardAmount);
    }

    await hre.network.provider.request({
      method: "evm_increaseTime",
      params: [86400 * 2],
    });

    // user 2 whale join 2 days after reward started
    const user2StakeAmount = ethers.parseEther("10000"); // 10000 $APE
    await messenger.sendDeposit(helper, user2.address, user2StakeAmount, 3); // 3 Y
    await messenger.sendDeposit(helper, user2.address, user2StakeAmount, 5); // 5 Y

    await hre.network.provider.request({
      method: "evm_increaseTime",
      params: [86400 * 178],
    });

    await helper.connect(user1).claimAll();
    await helper.connect(user2).claimAll();

    expect(await rewardToken.balanceOf(stakingRewardArray[0])).to.lt(ethers.parseEther("1"));
    expect(await rewardToken.balanceOf(stakingRewardArray[1])).to.lt(ethers.parseEther("1"));
    expect(await rewardToken.balanceOf(stakingRewardArray[2])).to.lt(ethers.parseEther("1"));
    expect(await rewardToken.balanceOf(stakingRewardArray[3])).to.lt(ethers.parseEther("1"));
    expect(await rewardToken.balanceOf(stakingRewardArray[4])).to.lt(ethers.parseEther("1"));
    expect(await rewardToken.balanceOf(stakingRewardArray[5])).to.lt(ethers.parseEther("1"));
  });
});
