// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IERC20.sol";

contract Token is IERC20 {
    string public tokenName;
    string public tokenSymbol;
    uint public totalSupply;
    uint public decimal;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowance;

    constructor() {
        tokenName = "TEST";
        tokenSymbol = "TEST";
        totalSupply = 100_000_000_000_000_000_000_000;
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function _mint(address to, uint amount) public returns (bool) {
        require(to != address(0), "Invalid address!");
        totalSupply += amount;
        balances[msg.sender] += amount;
        emit Transfer(address(0), to, amount);
        return true;
    }

    function name() public view returns (string memory) {
        return tokenName;
    }

    function symbol() public view returns (string memory) {
        return tokenSymbol;
    }

    function getTotalSupply() public view returns (uint) {
        return totalSupply;
    }

    function balanceOf(address account) public view returns (uint256 value) {
        return balances[account];
    }

    function getAllowance(
        address owner,
        address spender
    ) public view returns (uint) {
        return allowance[owner][spender];
    }

    function transfer(address to, uint value) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender] - value;
        balances[to] = balances[msg.sender] + value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint amount
    ) public returns (bool success) {
        allowance[from][msg.sender] = allowance[from][msg.sender] - amount;
        balances[from] = balances[from] - amount;
        balances[to] = balances[to] + amount;
        emit Transfer(from, to, amount);
        return true;
    }
}
