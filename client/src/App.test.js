import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

//create data object with all different types of questions from questionnaire
const questionnaireData = [
	{
		id: 1,
		type: 'text',
		question: 'What is your name?',
		mandatory: false,
		input: 'words',
	},
	{
		id: 2,
		type: 'select',
		question: 'Select your favorite color:',
		options: ['Red', 'Blue', 'Green', 'Yellow', 'Other'],
		mandatory: true,
		input: 'words',
	},
	{
		id: 3,
		type: 'checkbox',
		question: 'Select your hobbies:',
		options: ['Sports', 'Reading', 'Music', 'Travel', 'Other'],
		mandatory: false,
		input: 'words',
	},
	{
		id: 4,
		type: 'radio',
		question: 'Select your gender:',
		options: ['Male', 'Female', 'Other'],
		mandatory: true,
		input: 'words',
	},
];

describe('Form rendering', () => {
	test('renders all question types correctly', () => {
		render(<App data={questionnaireData} />);

		//define next button to be clicked after each question
		const nextButton = screen.getByRole('button', { name: 'Next' });

		// Check if the textbox is rendered correctly
		const textbox = screen.getByText('What is your name?');
		expect(textbox).toBeInTheDocument();

		fireEvent.click(nextButton);

		// Check if the dropdown is rendered correctly
		const dropdown = screen.getByText('Select your favorite color:');
		expect(dropdown).toBeInTheDocument();
		// Open the select dropdown
		dropdown.click();

		// Check if the options are rendered correctly
		const dropdownOptions = screen.getAllByRole('option');
		expect(dropdownOptions).toHaveLength(6); // Assuming 'Other' option is not displayed initially

		// Close the select dropdown
		dropdown.click();

		fireEvent.click(nextButton);

		// Check if the checkbox is rendered correctly
		const checkbox = screen.getByText('Select your hobbies:');
		expect(checkbox).toBeInTheDocument();
		const checkboxOptions = screen.getAllByRole('checkbox');
		expect(checkboxOptions).toHaveLength(5);

		fireEvent.click(nextButton);

		// Check if the radio is rendered correctly
		const radio = screen.getByText('Select your gender:');
		expect(radio).toBeInTheDocument();
		const radioOptions = screen.getAllByRole('radio');
		expect(radioOptions).toHaveLength(3);
	});

	test('displays an error message when text validation fails', () => {
		const textData = [
			{
				id: 1,
				type: 'text',
				question: 'What is your name?',
				mandatory: false,
				input: 'words',
			},
			{
				id: 2,
				type: 'text',
				question: 'Whats your email?',
				mandatory: true,
				input: 'email',
			},
		];
		render(<App data={textData} />);

		// Find the next button
		const nextButton = screen.getByRole('button', { name: 'Next' });

		// Find the text input
		const textInput = screen.getByRole('textbox');

		// Click the next button without entering a value in the text input
		fireEvent.change(textInput, {
			target: { value: '123' },
		});

		// Check if the error message is displayed
		const textErrorMessage = screen.getByText('Please enter a valid string of words.');
		expect(textErrorMessage).toBeInTheDocument();

		//entering valid text input
		fireEvent.change(textInput, {
			target: { value: 'mohamed' },
		});

		fireEvent.click(nextButton);

		//testing email textbox

		//entering invalid email input
		fireEvent.change(textInput, {
			target: { value: 'mohamed.com' },
		});

		const emailErrorMessage = screen.getByText('Please enter a valid email address.');
		expect(emailErrorMessage).toBeInTheDocument();
	});

	test('displays an alert if a mandatory question is unanswered on submit', () => {
		render(<App data={questionnaireData} />);
		window.alert = jest.fn();
		// Go through the questions one by one
		const nextButton = screen.getByRole('button', { name: 'Next' });
		questionnaireData.forEach((question, index) => {
			// If it's the last question, click the submit button without answering the mandatory question
			if (index === questionnaireData.length - 1) {
				fireEvent.click(nextButton);
				fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
				expect(window.alert).toHaveBeenCalledWith('Please answer all mandatory questions.');
			} else {
				// move to the next question
				fireEvent.click(nextButton);
			}
		});
	});

	test('displays alert when trying to go to next question with a invalid input', () => {
		render(<App data={questionnaireData} />);
		window.alert = jest.fn();
		const nextButton = screen.getByRole('button', { name: 'Next' });

		//Assumption: The first question is a textbox
		const textInput = screen.getByRole('textbox');

		// Click the next button without entering a value in the text input
		fireEvent.change(textInput, {
			target: { value: '123' },
		});

		fireEvent.click(nextButton);
		expect(window.alert).toHaveBeenCalledWith('Please provide a valid response!');
	});

	test('displays alert when trying to go to next question with invalid/empty input in other textbox', () => {
		render(<App data={questionnaireData} />);
		window.alert = jest.fn();
		const nextButton = screen.getByRole('button', { name: 'Next' });
		fireEvent.click(nextButton);
		fireEvent.click(nextButton);

		const checkboxOptions = screen.getAllByRole('checkbox');

		const otherOption = checkboxOptions.at(4);

		act(() => {
			//click the Other option
			otherOption.click();
		});

		//try clicking next with an empty Other option
		fireEvent.click(nextButton);
		expect(window.alert).toHaveBeenCalledWith('Please provide a valid response!');

		//now with a invalid other option textbox
		const textInput = screen.getByRole('textbox');

		fireEvent.change(textInput, {
			target: { value: '123' },
		});

		fireEvent.click(nextButton);
		expect(window.alert).toHaveBeenCalledWith('Please provide a valid response!');
	});
});
