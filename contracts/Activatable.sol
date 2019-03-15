pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Activatable is Ownable {
    event Deactivate(address indexed _sender);
    event Activate(address indexed _sender);

    // 1
    bool public active = false;
    // 2
    modifier whenActive() {
        require(active);
        _;
    }
    // 3
    modifier whenNotActive() {
        require(!active);
        _;
    }
    // 4
    function deactivate() public whenActive onlyOwner {
        active = false;
        emit Deactivate(msg.sender);
    }

    //5
    function activate() public whenNotActive onlyOwner {
        active = true;
        emit Activate(msg.sender);
    }
}