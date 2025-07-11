// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WeatherInsurance {
    struct Policy {
        address buyer;
        string location;
        uint256 createdAt;
        uint256 premium;
        uint256 payout;
        bool active;
        bool paidOut;
    }

    uint256 public nextPolicyId;
    mapping(uint256 => Policy) public policies;

    event PolicyPurchased(uint256 policyId, address indexed buyer, string location);
    event PolicyFulfilled(uint256 policyId, bool paidOut);
    event PayoutSent(uint256 policyId, address indexed to, uint256 amount);

    function buyPolicy(string memory location) external payable {
        require(msg.value > 0, "Must send ETH as premium");

        policies[nextPolicyId] = Policy({
            buyer: msg.sender,
            location: location,
            createdAt: block.timestamp,
            premium: msg.value,
            payout: msg.value * 2,
            active: true,
            paidOut: false
        });

        emit PolicyPurchased(nextPolicyId, msg.sender, location);
        nextPolicyId++;
    }

    function fulfillPolicy(uint256 policyId, bool didRain) external {
        Policy storage policy = policies[policyId];
        require(policy.active, "Policy not active");
        require(!policy.paidOut, "Policy already fulfilled");

        policy.active = false;

        if (didRain) {
            policy.paidOut = true;
            (bool success, ) = policy.buyer.call{value: policy.payout}("");
            require(success, "Payout failed");
            emit PayoutSent(policyId, policy.buyer, policy.payout);
        }

        emit PolicyFulfilled(policyId, policy.paidOut);
    }

    // emergency withdrawal (owner-only logic can be added)
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    // receive fallback
    receive() external payable {}
}
