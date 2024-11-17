// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropy} from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";

contract Cryck is ERC20, IEntropyConsumer {
    struct Bet {
        bool isWon;
        uint256 betId;
        uint256 reward;
        uint256 betAmount;
        uint256 betOption;
        uint256 betZone;
        uint256 betOver;
        uint256 betBallNumber;
        uint256 betPrediction;
    }

    // Modified event to include the final number between 1-42
    event RandomNumberGenerated(
        uint64 indexed sequenceNumber,
        address indexed provider,
        bytes32 randomNumber,
        uint256 finalNumber
    );

    event RandomNumberRequested(
        uint64 indexed sequenceNumber,
        address indexed provider,
        bytes32 userRandomNumber
    );

    IEntropy public entropy;

    uint256 private constant TOKENS_PER_ETH = 1000;

    mapping(address => Bet[]) public userBets;
    mapping(uint256 => address[]) public betIdToAddress;
    mapping(uint256 => uint256) public betIdToBetPool;
    mapping(uint256 => uint256) public betIdToAnswers;
    mapping(uint256 => uint256) public betIdToRewards;

    uint256 public totalBets;
    uint256 public constant TOTAL_OPTIONS = 43;

    constructor(address entropyAddress) ERC20("CriX", "CRX") {
        entropy = IEntropy(entropyAddress);
    }

    function mintCoins(uint256 CRXAmount) external payable {
        require(CRXAmount > 0, "Requested CRX amount must be greater than 0");
        uint256 requiredEth = (CRXAmount * 1 ether) / TOKENS_PER_ETH;
        require(msg.value >= requiredEth, "Not enough ETH sent");

        _mint(msg.sender, CRXAmount);
    }

    function convertCRXToEth(uint256 ethAmount) external {
        require(ethAmount > 0, "ETH amount must be greater than 0");
        uint256 requiredCRXTokens = (ethAmount * TOKENS_PER_ETH) / 1 ether;

        require(
            balanceOf(msg.sender) >= requiredCRXTokens,
            "Insufficient CRX token balance"
        );
        require(
            address(this).balance >= ethAmount,
            "Contract does not have enough ETH"
        );

        _burn(msg.sender, requiredCRXTokens);
        payable(msg.sender).transfer(ethAmount);
    }

    function checkBetsForBet(uint256 _betId) external view returns (uint256) {
        return betIdToAddress[_betId].length;
    }

    function requestRandomNumber(bytes32 userRandomNumber) external payable {
        address entropyProvider = entropy.getDefaultProvider();
        uint256 fee = entropy.getFee(entropyProvider);

        uint64 sequenceNumber = entropy.requestWithCallback{value: fee}(
            entropyProvider,
            userRandomNumber
        );

        emit RandomNumberRequested(
            sequenceNumber,
            entropyProvider,
            userRandomNumber
        );
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address provider,
        bytes32 randomNumber
    ) internal override {
        // Convert the random bytes to a number between 1 and 42
        uint256 finalNumber = (uint256(randomNumber) % 42) + 1;

        // Store this number as the answer for the bet
        betIdToAnswers[totalBets] = finalNumber;

        // Emit both the original random number and the final number (1-42)
        emit RandomNumberGenerated(
            sequenceNumber,
            provider,
            randomNumber,
            finalNumber
        );
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    function bet(
        uint256 _betAmount,
        uint256 _betId,
        uint256 _betOption,
        uint256 _betZone,
        uint256 _betOver,
        uint256 _betBallNumber,
        uint256 _betPrediction
    ) external {
        require(betIdToAnswers[_betId] == 0, "Bet is over");
        require(
            balanceOf(msg.sender) >= _betAmount,
            "Insufficient tokens for the bet"
        );

        Bet memory newBet = Bet({
            betId: _betId,
            betAmount: _betAmount,
            betOption: _betOption,
            betZone: _betZone,
            betOver: _betOver,
            betBallNumber: _betBallNumber,
            betPrediction: _betPrediction,
            reward: 0,
            isWon: false
        });

        if (betIdToAddress[_betId].length == 0) {
            totalBets++;
        }

        Bet[] memory allUserBets = userBets[msg.sender];
        if (allUserBets.length > 0) {
            Bet memory lastBet = allUserBets[allUserBets.length - 1];
            if (lastBet.betId == _betId) {
                userBets[msg.sender].pop();
            }
        }

        userBets[msg.sender].push(newBet);
        betIdToBetPool[_betId] += _betAmount;
        betIdToAddress[_betId].push(msg.sender);

        _transfer(msg.sender, address(this), _betAmount);
    }

    function uploadAnswerForBet(uint256 _betId, uint256 _optionId) external {
        require(
            _optionId > 0 && _optionId < TOTAL_OPTIONS,
            "Incorrect optionId"
        );
        require(betIdToAnswers[_betId] == 0, "Bet settled");
        require(betIdToAddress[_betId].length > 0, "No bets placed by anyone");

        betIdToAnswers[_betId] = _optionId;
        _calculateRewards(_betId);
    }

    function getBetsByAddress(
        address user
    ) external view returns (Bet[] memory bets) {
        return userBets[user];
    }

    function canWithdrawTokens(uint256 _betId) external view returns (bool) {
        return betIdToAnswers[_betId] > 0;
    }

    function resolveBet(uint256 _betId) external {
        require(betIdToAnswers[_betId] > 0, "Bet not resolved");

        bool betFound = false;
        uint256 betIndex;

        for (int256 i = int256(userBets[msg.sender].length) - 1; i >= 0; i--) {
            if (userBets[msg.sender][uint256(i)].betId == _betId) {
                betFound = true;
                betIndex = uint256(i);
                break;
            }
        }

        require(betFound, "No bet placed");

        Bet storage bet = userBets[msg.sender][betIndex];

        require(bet.betAmount > 0, "No bet placed");
        require(bet.isWon, "You lost bet");

        bet.isWon = false;

        _transfer(
            address(this),
            msg.sender,
            betIdToRewards[_betId] + bet.betAmount
        );
    }

    function _calculateRewards(uint256 _betId) internal {
        uint256 correctOptionId = betIdToAnswers[_betId];
        uint256 totalLoserBetAmount = 0;
        uint256 totalWinners = 0;

        for (uint256 i = 0; i < betIdToAddress[_betId].length; i++) {
            address bettor = betIdToAddress[_betId][i];
            for (int256 j = int256(userBets[bettor].length) - 1; j >= 0; j--) {
                Bet storage bet = userBets[bettor][uint256(j)];
                if (bet.betId == _betId) {
                    if (bet.betOption != correctOptionId) {
                        totalLoserBetAmount += bet.betAmount;
                        bet.isWon = false;
                    } else {
                        bet.isWon = true;
                        totalWinners++;
                    }
                    break;
                }
            }
        }

        if (totalWinners == 0 || totalLoserBetAmount == 0) return;

        uint256 rewardPerWinner = totalLoserBetAmount / totalWinners;
        betIdToRewards[_betId] = rewardPerWinner;
    }
}
