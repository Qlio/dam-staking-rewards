pragma solidity >=0.4.24;

interface IMessenger {
    function xDomainMessageSender() external view returns (address);
}
