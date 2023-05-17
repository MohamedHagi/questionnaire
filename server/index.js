const express = require('express');
const app = express();
const uuid = require('uuid');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Array to store the responses
const responses = [];

// Middleware to validate the request body
const validateRequest = (req, res, next) => {
	const { questions } = req.body;

	// Check if 'questions' field exists and is an array
	if (!questions || !Array.isArray(questions)) {
		return res.status(400).json({ error: 'Invalid request body' });
	}

	// Check if 'questions' array is not empty
	if (questions.length === 0) {
		return res.status(400).json({ error: 'No questions provided' });
	}

	// Validate each question object in the array
	for (const question of questions) {
		// Check if 'id' field is a number
		if (typeof question.id !== 'number') {
			return res.status(400).json({ error: 'Invalid question ID' });
		}

		// Check if 'question' field is a string
		if (typeof question.question !== 'string') {
			return res.status(400).json({ error: 'Invalid question text' });
		}

		// Check if 'answer' field is provided and has a valid type
		if (question.answer === undefined || !isValidAnswerType(question.answer)) {
			return res.status(400).json({ error: 'Invalid answer' });
		}
	}

	// If all validation passes, proceed to the next middleware
	next();
};

// Custom function to validate answer types
const isValidAnswerType = (answer) => {
	return typeof answer === 'string' || typeof answer === 'boolean' || Array.isArray(answer);
};

app.post('/api/response', validateRequest, (req, res) => {
	const { questions } = req.body;

	const response = {
		id: uuid.v4(),
		questions: questions.map((question) => {
			const { id, question: questionText, answer } = question;
			return {
				id,
				question: questionText,
				answer,
			};
		}),
	};

	responses.push(response);

	res.json(response);
});

app.get('/api/responses', (req, res) => {
	res.json(responses);
});

app.listen(3000, () => {
	console.log('API server is running on port 3000');
});
