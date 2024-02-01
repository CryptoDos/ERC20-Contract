// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function getTotalSupply() external view returns (uint);

    function _mint(address to, uint amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address from, uint value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint amount
    ) external returns (bool);

    function getAllowance(
        address owner,
        address spender
    ) external returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed to, uint256 value);
}
