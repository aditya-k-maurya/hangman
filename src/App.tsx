import { useEffect, useState, useCallback } from "react";
import words from "./assets/wordList.json";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";

function getWord() {
	return words[Math.floor(Math.random() * words.length)];
}

const App = () => {
	const [wordToGuess, setWordToGuess] = useState(getWord());

	const [guessedLetter, setGuessedLetters] = useState<string[]>([]);

	const incorrectLetters = guessedLetter.filter(
		(letter) => !wordToGuess.includes(letter)
	);
	const isLoser = incorrectLetters.length >= 6;
	const isWinner = wordToGuess
		.split("")
		.every((letter) => guessedLetter.includes(letter));

	const addGuessedLetter = useCallback(
		(letter: string) => {
			if (guessedLetter.includes(letter) || isWinner || isLoser) return;
			setGuessedLetters((currentLetter) => [...currentLetter, letter]);
		},
		[guessedLetter, isWinner, isLoser]
	);

	// function addGuessedLetter(letter: string) {
	// 	if (guessedLetter.includes(letter)) return

	// 	setGuessedLetters((currentLetters) => [...currentLetters, letter]);
	// }

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;
			if (!key.match(/^[a-z]$/)) return;

			e.preventDefault;
			addGuessedLetter(key);
		};

		document.addEventListener("keydown", handler);

		return () => {
			document.removeEventListener("keydown", handler);
		};
	}, [guessedLetter]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;
			if (key !== "Enter") return;

			e.preventDefault;
			setGuessedLetters([]);
			setWordToGuess(getWord());
		};

		document.addEventListener("keydown", handler);

		return () => {
			document.removeEventListener("keydown", handler);
		};
	}, [guessedLetter]);
	return (
		<div
			style={{
				maxWidth: "800px",
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				margin: "0 auto",
				alignItems: "center",
			}}>
			<div style={{ fontSize: "2rem", textAlign: "center", color: `${isLoser? "red": "green"}` }}>
				{isWinner && "Winner! - Press Enter to try again"}
				{isLoser && "Nice Try - Press Enter to try again"}
			</div>
			<HangmanDrawing numberOfGuesses={incorrectLetters.length} />
			<HangmanWord
				reveal={isLoser}
				guessedLetters={guessedLetter}
				wordToGuess={wordToGuess}
			/>
			<div style={{ alignSelf: "stretch" }}>
				<Keyboard
					disabled={isWinner || isLoser}
					activeLetters={guessedLetter.filter((letter) =>
						wordToGuess.includes(letter)
					)}
					inactiveLetters={incorrectLetters}
					addGuessedLetter={addGuessedLetter}
				/>
			</div>
		</div>
	);
};

export default App;
