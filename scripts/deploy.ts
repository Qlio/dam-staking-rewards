import { parseEther } from 'ethers';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment, TaskArguments } from 'hardhat/types';

const MainnetOwner = '';
const BlastOwner = '';
const ApeCoinAddress = '';

const damAddy = '';
const stakingRewardHelperAddy = '';
const stakingRewards1Addy = '';
const stakingRewards2Addy = '';
const stakingRewards3Addy = '';
const stakingRewards4Addy = '';
const stakingRewards5Addy = '';
const stakingRewards6Addy = '';
const stakingRewardsAddys = [
    stakingRewards1Addy,
    stakingRewards2Addy,
    stakingRewards3Addy,
    stakingRewards4Addy,
    stakingRewards5Addy,
    stakingRewards6Addy,
];
const damVaultAddy = '';

const deploy = async (_taskArgs: TaskArguments, { ethers }: HardhatRuntimeEnvironment) => {
    const [deployer] = await ethers.getSigners();
    console.log('[Deployer]:', deployer.address);
    console.log('[Balance]:', await ethers.provider.getBalance(deployer.address));

    const DAM = await ethers.getContractFactory('DAM');
    const _dam = await DAM.deploy(BlastOwner);
    const dam = await _dam.waitForDeployment();
    console.log('[DAM]:', await dam.getAddress());

    const StakingRewardHelper = await ethers.getContractFactory('StakingRewardHelper');
    const _stakingRewardHelper = await StakingRewardHelper.deploy(BlastOwner);
    const stakingRewardHelper = await _stakingRewardHelper.waitForDeployment();
    console.log('[StakingRewardHelper]:', await stakingRewardHelper.getAddress());

    const StakingRewards = await ethers.getContractFactory('StakingRewards');

    const _stakingRewards1 = await StakingRewards.deploy(BlastOwner, damAddy, stakingRewardHelperAddy);
    const stakingRewards1 = await _stakingRewards1.waitForDeployment();
    console.log('[StakingRewards1]:', await stakingRewards1.getAddress());

    const _stakingRewards2 = await StakingRewards.deploy(BlastOwner, damAddy, stakingRewardHelperAddy);
    const stakingRewards2 = await _stakingRewards2.waitForDeployment();
    console.log('[StakingRewards2]:', await stakingRewards2.getAddress());

    const _stakingRewards3 = await StakingRewards.deploy(BlastOwner, damAddy, stakingRewardHelperAddy);
    const stakingRewards3 = await _stakingRewards3.waitForDeployment();
    console.log('[StakingRewards3]:', await stakingRewards3.getAddress());

    const _stakingRewards4 = await StakingRewards.deploy(BlastOwner, damAddy, stakingRewardHelperAddy);
    const stakingRewards4 = await _stakingRewards4.waitForDeployment();
    console.log('[StakingRewards4]:', await stakingRewards4.getAddress());

    const _stakingRewards5 = await StakingRewards.deploy(BlastOwner, damAddy, stakingRewardHelperAddy);
    const stakingRewards5 = await _stakingRewards5.waitForDeployment();
    console.log('[StakingRewards5]:', await stakingRewards5.getAddress());

    const _stakingRewards6 = await StakingRewards.deploy(BlastOwner, damAddy, stakingRewardHelperAddy);
    const stakingRewards6 = await _stakingRewards6.waitForDeployment();
    console.log('[StakingRewards6]:', await stakingRewards6.getAddress());

    // NOTE: configure StakingRewardHelper address in the constant
    const DamVault = await ethers.getContractFactory('DamVault');
    const _damVault = await DamVault.deploy(ApeCoinAddress, MainnetOwner);
    const damVault = await _damVault.waitForDeployment();
    console.log('[DamVault]:', await damVault.getAddress());

    {
        const stakingRewardHelper = await ethers.getContractAt('StakingRewardHelper', stakingRewardHelperAddy);
        await (await stakingRewardHelper.setL1Vault(damVaultAddy)).wait();
        console.log('set L1Vault addy');

        await (await stakingRewardHelper.setStakingRewards(stakingRewardsAddys)).wait();
        console.log('set staking rewards addys');
    }

    {
        const dam = await ethers.getContractAt('DAM', damAddy);
        await (await dam.mint(parseEther('21000000000'))).wait();
        console.log('minted');

        {
            const amount = parseEther('1000000000');
            await (await dam.transfer(stakingRewards1Addy, amount)).wait();
            const stakingRewards = await ethers.getContractAt('StakingRewards', stakingRewards1Addy);
            await (await stakingRewards.notifyRewardAmount(amount)).wait();
            console.log('configured staking rewards #1');
        }
        {
            const amount = parseEther('2000000000');
            await (await dam.transfer(stakingRewards2Addy, amount)).wait();
            const stakingRewards = await ethers.getContractAt('StakingRewards', stakingRewards2Addy);
            await (await stakingRewards.notifyRewardAmount(amount)).wait();
            console.log('configured staking rewards #2');
        }
        {
            const amount = parseEther('3000000000');
            await (await dam.transfer(stakingRewards3Addy, amount)).wait();
            const stakingRewards = await ethers.getContractAt('StakingRewards', stakingRewards3Addy);
            await (await stakingRewards.notifyRewardAmount(amount)).wait();
            console.log('configured staking rewards #3');
        }
        {
            const amount = parseEther('4000000000');
            await (await dam.transfer(stakingRewards4Addy, amount)).wait();
            const stakingRewards = await ethers.getContractAt('StakingRewards', stakingRewards4Addy);
            await (await stakingRewards.notifyRewardAmount(amount)).wait();
            console.log('configured staking rewards #4');
        }
        {
            const amount = parseEther('5000000000');
            await (await dam.transfer(stakingRewards5Addy, amount)).wait();
            const stakingRewards = await ethers.getContractAt('StakingRewards', stakingRewards5Addy);
            await (await stakingRewards.notifyRewardAmount(amount)).wait();
            console.log('configured staking rewards #5');
        }
        {
            const amount = parseEther('6000000000');
            await (await dam.transfer(stakingRewards6Addy, amount)).wait();
            const stakingRewards = await ethers.getContractAt('StakingRewards', stakingRewards6Addy);
            await (await stakingRewards.notifyRewardAmount(amount)).wait();
            console.log('configured staking rewards #6');
        }
    }
};

task('deploy', 'Deploy contracts').setAction(deploy);
