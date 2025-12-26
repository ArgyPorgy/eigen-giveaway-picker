const hre = require("hardhat");

// Sports prediction markets to seed
const markets = [
  // NFL
  {
    question: "Will the Kansas City Chiefs win Super Bowl LIX?",
    category: "NFL",
    imageUrl: "",
    daysUntilEnd: 60,
    initialOddsYes: 25,
  },
  {
    question: "Will Josh Allen throw for 4000+ yards this season?",
    category: "NFL",
    imageUrl: "",
    daysUntilEnd: 45,
    initialOddsYes: 65,
  },
  {
    question: "Will the Detroit Lions make the playoffs?",
    category: "NFL",
    imageUrl: "",
    daysUntilEnd: 30,
    initialOddsYes: 80,
  },
  // NBA
  {
    question: "Will the Boston Celtics repeat as NBA Champions?",
    category: "NBA",
    imageUrl: "",
    daysUntilEnd: 180,
    initialOddsYes: 30,
  },
  {
    question: "Will Victor Wembanyama win MVP this season?",
    category: "NBA",
    imageUrl: "",
    daysUntilEnd: 150,
    initialOddsYes: 15,
  },
  {
    question: "Will LeBron James average 25+ PPG?",
    category: "NBA",
    imageUrl: "",
    daysUntilEnd: 120,
    initialOddsYes: 55,
  },
  // Soccer
  {
    question: "Will Manchester City win the Premier League?",
    category: "Soccer",
    imageUrl: "",
    daysUntilEnd: 150,
    initialOddsYes: 35,
  },
  {
    question: "Will Real Madrid win the Champions League?",
    category: "Soccer",
    imageUrl: "",
    daysUntilEnd: 180,
    initialOddsYes: 20,
  },
  {
    question: "Will Erling Haaland score 30+ league goals?",
    category: "Soccer",
    imageUrl: "",
    daysUntilEnd: 150,
    initialOddsYes: 45,
  },
  // MLB
  {
    question: "Will Shohei Ohtani hit 50+ home runs?",
    category: "MLB",
    imageUrl: "",
    daysUntilEnd: 200,
    initialOddsYes: 40,
  },
  {
    question: "Will the LA Dodgers win the World Series?",
    category: "MLB",
    imageUrl: "",
    daysUntilEnd: 250,
    initialOddsYes: 18,
  },
  // NHL
  {
    question: "Will Connor McDavid win the Hart Trophy?",
    category: "NHL",
    imageUrl: "",
    daysUntilEnd: 120,
    initialOddsYes: 35,
  },
  {
    question: "Will the Edmonton Oilers win the Stanley Cup?",
    category: "NHL",
    imageUrl: "",
    daysUntilEnd: 180,
    initialOddsYes: 15,
  },
  // Tennis
  {
    question: "Will Carlos Alcaraz win the Australian Open?",
    category: "Tennis",
    imageUrl: "",
    daysUntilEnd: 30,
    initialOddsYes: 25,
  },
  {
    question: "Will Novak Djokovic win another Grand Slam in 2025?",
    category: "Tennis",
    imageUrl: "",
    daysUntilEnd: 365,
    initialOddsYes: 60,
  },
  // UFC
  {
    question: "Will Jon Jones defend his heavyweight title?",
    category: "UFC",
    imageUrl: "",
    daysUntilEnd: 90,
    initialOddsYes: 75,
  },
  {
    question: "Will Islam Makhachev remain undefeated this year?",
    category: "UFC",
    imageUrl: "",
    daysUntilEnd: 365,
    initialOddsYes: 70,
  },
  // Golf
  {
    question: "Will Scottie Scheffler win the Masters?",
    category: "Golf",
    imageUrl: "",
    daysUntilEnd: 100,
    initialOddsYes: 20,
  },
  {
    question: "Will Rory McIlroy win a major in 2025?",
    category: "Golf",
    imageUrl: "",
    daysUntilEnd: 365,
    initialOddsYes: 35,
  },
];

async function main() {
  const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("Please set VITE_CONTRACT_ADDRESS in your .env file");
    process.exit(1);
  }

  console.log("Seeding markets to contract:", contractAddress);

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  console.log("Using account:", deployer.address);

  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const contract = PredictionMarket.attach(contractAddress);

  const currentMarketCount = await contract.marketCount();
  console.log("Current market count:", currentMarketCount.toString());

  console.log("\nCreating markets...\n");

  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    const endTime = Math.floor(Date.now() / 1000) + (market.daysUntilEnd * 24 * 60 * 60);

    try {
      console.log(`[${i + 1}/${markets.length}] Creating: ${market.question.substring(0, 50)}...`);
      
      const tx = await contract.createMarket(
        market.question,
        market.category,
        market.imageUrl,
        endTime,
        market.initialOddsYes
      );

      await tx.wait();
      console.log(`   ✅ Created (tx: ${tx.hash.substring(0, 10)}...)`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }

    // Small delay between transactions
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const finalMarketCount = await contract.marketCount();
  console.log("\n✅ Seeding complete!");
  console.log("Total markets:", finalMarketCount.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

