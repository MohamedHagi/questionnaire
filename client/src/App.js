import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import questionsData from './data.json';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import TextBox from './components/TextBox';
import Select from './components/Select';
import RadioSelect from './components/RadioSelect';
import CheckboxSelect from './components/CheckboxSelect';

const App = ({ data }) => {
	const questions = data ? data : questionsData;
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState({});
	const [submissionStatus, setSubmissionStatus] = useState(null);
	const [mandatoryCheck, setMandatoryCheck] = useState(false);
	const [unselected, setUnselected] = useState(true);

	const handleNext = () => {
		const question = questions[currentQuestion];
		const { id } = question;
		const name = id.toString();
		const isOtherSelected = answers[name] === 'Other';
		const isOtherCheckbox = answers['otherChecked'];

		// Check if the answer for the current question text is invalid
		if (answers[`${name}-error`]) {
			alert('Please provide a valid response!');
			setAnswers((prevAnswers) => ({
				...prevAnswers,
				[`${name}-error`]: true,
				[`${name}-helperText`]: 'Please provide a valid response.',
			}));
			return;
		}

		// Check if the question has an "Other" option and the Other text field is empty or invalid
		else if ((isOtherSelected || isOtherCheckbox) && answers[`${name}-other-text-error`]) {
			alert('Please provide a valid response!');
			setAnswers((prevAnswers) => ({
				...prevAnswers,
				[`${name}-error`]: true,
				[`${name}-helperText`]: 'Please provide a valid response.',
			}));
			return;
		}

		//proceed to the next question
		setCurrentQuestion((prevQuestion) => prevQuestion + 1);
		//reset the unselected state
		setUnselected(true);
	};

	const handleBack = () => {
		setCurrentQuestion((prevQuestion) => prevQuestion - 1);
		setUnselected(true);
	};

	const handleInputChange = (e) => {
		//we can set the mandatoryCheck and unselected to false since this function is called when a option is selected
		setMandatoryCheck(false);
		setUnselected(false);
		const { name, value } = e.target;
		const baseName = name.replace('-other-text', '');
		const question = questions.find((q) => q.id.toString() === baseName);

		if (!question) {
			return;
		}

		const { input } = question;

		const validationMap = {
			words: {
				regex: /^[A-Za-z\s]+$/,
				errorText: 'Please enter a valid string of words.',
			},
			numbers: {
				regex: /^\d+$/,
				errorText: 'Please enter numbers only.',
			},
			email: {
				regex: /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})$/,
				errorText: 'Please enter a valid email address.',
			},
		};

		if (input in validationMap) {
			const { regex, errorText } = validationMap[input];

			if (value !== '' && !regex.test(value)) {
				setAnswers((prevAnswers) => ({
					...prevAnswers,
					[name]: value,
					[`${baseName}-error`]: true,
					[`${baseName}-helperText`]: errorText,
				}));
				return;
			}
		}

		// Clear the error state if the value is valid
		setAnswers((prevAnswers) => ({
			...prevAnswers,
			[name]: value,
			[`${baseName}-error`]: false,
			[`${baseName}-helperText`]: '',
		}));
	};

	const handleCheckboxChange = (event) => {
		const { name, value, checked } = event.target;
		//checking whether the other option was selected.
		//we want to know this so we can remove the other textbox when unselected.
		const isOtherCheckbox = value === 'Other';

		//setting the answer state with the checked options
		setAnswers((prevAnswers) => {
			const updatedAnswers = {
				...prevAnswers,
				[name]: checked
					? [...(prevAnswers[name] || []), value]
					: (prevAnswers[name] || []).filter((v) => v !== value),
				otherChecked: isOtherCheckbox ? checked : prevAnswers.otherChecked,
			};

			// Reset the "Other" textbox error state when the other option is not checked
			if (name === 'otherChecked' && !checked) {
				updatedAnswers.textboxError = false;
			}

			return updatedAnswers;
		});

		//once this function is called, we know that a option is selected, so we can set unselected to false.
		setUnselected(false);
	};

	useEffect(() => {
		// Reset textboxError when "Other" checkbox is unselected
		if (!answers.otherChecked) {
			setAnswers((prevAnswers) => ({
				...prevAnswers,
				textboxError: false,
			}));
		}
	}, [answers.otherChecked]);

	const handleRadioChange = (e) => {
		//we can set the mandatoryCheck and unselected to false since this function is called when a option is selected
		setMandatoryCheck(false);
		setUnselected(false);

		const { name, value } = e.target;
		//When the other option is delected, remove the error if it exists, and update state accordingly
		const baseName = name.replace('-other-text', '');
		if (value !== 'Other') {
			setAnswers((prevAnswers) => ({
				...prevAnswers,
				[name]: value,
				[`${baseName}-error`]: false,
				[`${baseName}-helperText`]: '',
			}));
		} else {
			//update state with selected value
			setAnswers((prevAnswers) => ({
				...prevAnswers,
				[name]: value,
			}));
		}
	};

	//submit function
	const handleSubmit = () => {
		//filtering all questions for the mandatory ones
		const mandatoryQuestions = questions.filter((question) => question.mandatory);

		//checking if there are unanswered Mandatory questions
		const unansweredMandatoryQuestions = mandatoryQuestions.filter((question) => {
			const answer = answers[question.id.toString()];
			if (typeof answer === 'string') {
				return answer.trim() === ''; // Check if the answer is an empty string
			} else if (Array.isArray(answer)) {
				return answer.length === 0; // Check if the answer array is empty
			}
			return true; // Invalid answer type
		});

		//if there are any unanswered mandatory questions, return an error and go back to unanswered mandatory question
		if (unansweredMandatoryQuestions.length > 0) {
			// Handle the case where unanswered mandatory questions exist
			setMandatoryCheck(true);

			const lastUnansweredQuestion = unansweredMandatoryQuestions[unansweredMandatoryQuestions.length - 1];
			setCurrentQuestion(lastUnansweredQuestion.id - 1); // Set the current question to the last unanswered mandatory question
			const errorMessage = 'Please answer all mandatory questions.';
			alert(errorMessage);
			return;
		}

		// Persist the answers for other questions
		const submissionData = {
			id: uuidv4(),
			questions: questions.map((question) => {
				const { id, question: questionText } = question;
				const answer = answers[id.toString()] || '';

				return {
					id,
					question: questionText,
					answer,
				};
			}),
		};

		console.log(submissionData); // For testing purposes

		// Simulate API call
		fetch('http://localhost:3001/api/response', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(submissionData),
		})
			.then((response) => response.json())
			.then((data) => {
				const transformedResponse = {
					id: data.id,
					questions: Object.values(data).filter((value) => typeof value === 'object'),
				};

				console.log('Questionnaire submitted:', transformedResponse);
				setSubmissionStatus('submitted');
				// Reset form or show success message
			})
			.catch((error) => {
				console.error('Error submitting questionnaire:', error);
				setSubmissionStatus('error');
				// Handle error or show error message
			});
	};

	//set intial answer state, same size as the questions
	useEffect(() => {
		const initialAnswers = questions.reduce((acc, question) => {
			const { id } = question;
			acc[id.toString()] = '';
			return acc;
		}, {});

		setAnswers(initialAnswers);
	}, [questions]);

	//reset answer state when retrying questionnaire
	const handleRetry = () => {
		setAnswers({});
		setCurrentQuestion(0);
		setSubmissionStatus(null);
	};

	const renderQuestion = () => {
		//if we have successfully submitted the questionnaire, return a success message and offer user to retry.
		if (submissionStatus === 'submitted') {
			return (
				<div>
					<h2 data-testid="successSubmit">Your questionnaire has been submitted successfully!</h2>
					<Button variant="contained" onClick={handleRetry}>
						Retry Questionnaire
					</Button>
				</div>
			);
		} else if (submissionStatus === 'error') {
			return (
				<div>
					<h2>Error submitting the questionnaire. Please try again.</h2>
					<Button variant="contained" onClick={handleRetry}>
						Retry Questionnaire
					</Button>
				</div>
			);
		}

		const question = questions[currentQuestion];
		const { id, type, question: questionText, options, mandatory } = question;
		const name = id.toString();

		switch (type) {
			case 'text':
				return (
					<TextBox
						name={name}
						questionText={questionText}
						answers={answers}
						handleInputChange={handleInputChange}
						mandatory={mandatory}
						mandatoryCheck={mandatoryCheck}
						unselected={unselected}
					/>
				);
			case 'select':
				return (
					<Select
						name={name}
						questionText={questionText}
						answers={answers}
						handleInputChange={handleInputChange}
						mandatory={mandatory}
						mandatoryCheck={mandatoryCheck}
						unselected={unselected}
						options={options}
					/>
				);

			case 'checkbox':
				return (
					<CheckboxSelect
						name={name}
						questionText={questionText}
						answers={answers}
						handleInputChange={handleInputChange}
						handleCheckboxChange={handleCheckboxChange}
						mandatory={mandatory}
						mandatoryCheck={mandatoryCheck}
						unselected={unselected}
						options={options}
					/>
				);

			case 'radio':
				return (
					<RadioSelect
						name={name}
						questionText={questionText}
						answers={answers}
						handleInputChange={handleInputChange}
						handleRadioChange={handleRadioChange}
						mandatory={mandatory}
						mandatoryCheck={mandatoryCheck}
						unselected={unselected}
						options={options}
					/>
				);

			default:
				return null;
		}
	};

	const renderButtons = () => {
		return (
			<div className="button-container">
				{/* if we are inbetween the second and last question have a back button */}
				{currentQuestion > 0 && (
					<Button variant="outlined" onClick={handleBack}>
						Back
					</Button>
				)}
				{/* if we are not at the last question have a next button */}
				{currentQuestion < questions.length - 1 && (
					<Button variant="outlined" onClick={handleNext}>
						Next
					</Button>
				)}

				{/* if we are at the last question have a submit button */}
				{currentQuestion === questions.length - 1 && (
					<Button variant="contained" onClick={handleSubmit}>
						Submit
					</Button>
				)}
			</div>
		);
	};

	return (
		<div className="questionnaire-container">
			<h1 className="questionnaire-title">Questionnaire</h1>
			{renderQuestion()}
			{renderButtons()}
		</div>
	);
};

export default App;
