import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Alert, TextField } from '@mui/material';

export default function CheckboxSelect({
	name,
	questionText,
	answers,
	handleInputChange,
	handleCheckboxChange,
	mandatory,
	mandatoryCheck,
	unselected,
	options,
}) {
	const isOtherChecked = answers['otherChecked'];
	return (
		<FormControl component="fieldset">
			<FormLabel component="legend">{questionText}</FormLabel>
			<FormGroup>
				{options.map((option) => (
					<FormControlLabel
						key={option}
						control={
							<Checkbox
								name={name}
								value={option}
								checked={(answers[name] || []).includes(option)}
								onChange={handleCheckboxChange}
							/>
						}
						label={option}
					/>
				))}

				{isOtherChecked && (
					<TextField
						fullWidth
						name={`${name}-other-text`}
						label="Other"
						value={answers[`${name}-other-text`] || ''}
						onChange={handleInputChange}
						margin="normal"
						className="question-text"
						error={!answers['textboxError'] ? answers[`${name}-error`] : false}
						helperText={!answers['textboxError'] ? answers[`${name}-helperText`] : ''}
					/>
				)}
			</FormGroup>
			{unselected &&
				(mandatory ? (
					<Alert severity={mandatoryCheck ? 'error' : 'warning'} style={{ marginTop: '10px' }}>
						*This is a required question
					</Alert>
				) : (
					<Alert severity="info" style={{ marginTop: '10px' }}>
						*This is an optional question
					</Alert>
				))}
		</FormControl>
	);
}
