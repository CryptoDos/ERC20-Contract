import "./interfaces/IERC20.sol";

contract Token is IERC20 {
   
    string public tokenName;
    string public tokenSymbol;
    uint public totalSupply;
    uint public decimal;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowance;

    constructor(string memory _name, string memory _symbol ) {
        tokenName = "TEST"; 
        tokenSymbol = "TEST";
        totalSupply= 1000000000000000000;
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0),msg.sender, totalSupply );

    }

    function totalSupply() public view returns (uint256 value){
        return totalSupply;
    }

    function balanceOf(address account)public view returns(uint256 value){
        return balances[account];
    }

    function transfer(address to, uint256 value) public view returns(bool success){
        
        balances[msg.sender] = balances[msg.sender] - value;
        balances[to] = balances[msg.sender] + value;
        emit Transfer(msg.sender, to, value);
        return true;



    }


 

}
