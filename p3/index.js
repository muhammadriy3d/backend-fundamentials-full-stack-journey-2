const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const MIN = 0;
const MAX = 100;

const difficulties = new Map([
  ["1", { label: "Easy", chances: 10 }],
  ["2", { label: "Medium", chances: 5 }],
  ["3", { label: "Hard", chances: 3 }],
]);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function describeAttempts(count) {
  return `${count} attempt${count === 1 ? "" : "s"}`;
}

function parseDifficulty(answer) {
  return difficulties.get(answer.trim()) ?? null;
}

function parseGuess(answer) {
  const text = answer.trim();
  if (!/^\d+$/.test(text)) return null;

  const guess = Number(text);
  if (guess < MIN || guess > MAX) return null;

  return guess;
}

async function ask(rl, prompt, parse, errorMessage) {
  for (let i = 0; i <= Infinity; i++) {
    const answer = await rl.question(prompt);
    const value = parse(answer);
    if (value !== null) return value;
    console.log(errorMessage);
  }
}

function parseNewGame(answer) {
  if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
    return "y";
  }

  if (answer.toLowerCase() === "n" || answer.toLowerCase() === "no") {
    return "n";
  }

  return null;
}

async function playGame(rl, { label, chances }) {
  const target = randomInt(MIN, MAX);
  const startTime = Date.now();

  console.log(`\nGreat! You have selected the ${label} difficulty level.`);
  console.log(`You have ${chances} chances to guess the correct number.`);
  console.log("Let's start the game!");

  for (let attemptsLeft = chances; attemptsLeft > 0; attemptsLeft -= 1) {
    const guess = await ask(
      rl,
      "\nEnter your guess: ",
      parseGuess,
      `Please enter a whole number between ${MIN} and ${MAX}.`,
    );

    if (guess === target) {
      const attempts = chances - attemptsLeft + 1;
      const ellapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `\nCongratulations! You guessed the number in ${describeAttempts(attempts)}. you took ${ellapsedTime} seconds to guess!`,
      );
      return;
    }

    const hint = guess < target ? "greater" : "less";
    console.log(`\nIncorrect! The number is ${hint} than ${guess}.`);

    if (attemptsLeft > 1) {
      console.log(`You have ${describeAttempts(attemptsLeft - 1)} left.`);
    }
  }

  const ellapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `\nOut of chances! The number was ${target}. you took ${ellapsedTime} seconds!`,
  );
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    console.log("Welcome to the Number Guessing Game!");

    while (true) {
      console.log(`I'm thinking of a number between ${MIN} and ${MAX}.`);
      console.log("\nPlease select the difficulty level:");
      console.log("1. Easy (10 chances)");
      console.log("2. Medium (5 chances)");
      console.log("3. Hard (3 chances)");

      const difficulty = await ask(
        rl,
        "\nEnter your choice: ",
        parseDifficulty,
        "Please enter 1, 2, or 3.",
      );

      await playGame(rl, difficulty);
      const playAgain = await ask(
        rl,
        "\nWant to play another round? (y/n): ",
        parseNewGame,
        "You must choose (y) or (n).",
      );

      if (playAgain === "n") {
        console.log("\nThank you for playing!");
        break;
      }

      console.clear();
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  if (error?.code === "ERR_USE_AFTER_CLOSE" || error?.name === "AbortError")
    return;
  console.error(error);
  process.exitCode = 1;
});
