import React from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Alert, TextField } from '@mui/material';

export default function RadioSelect({
	name,
	questionText,
	answers,
	handleInputChange,
	handleRadioChange,
	mandatory,
	mandatoryCheck,
	unselected,
	options,
}) {
	const isOtherRadioSelected = answers[name] === 'Other';
	return (
		<FormControl component="fieldset">
			<FormLabel component="legend">{questionText}</FormLabel>
			<RadioGroup name={name} value={answers[name] || ''} onChange={handleRadioChange}>
				{options.map((option) => (
					<FormControlLabel key={option} value={option} control={<Radio />} label={option} />
				))}
				{isOtherRadioSelected && (
					<TextField
						fullWidth
						name={`${name}-other-text`}
						label="Other"
						value={answers[`${name}-other-text`] || ''}
						onChange={handleInputChange}
						margin="normal"
						className="question-text"
						error={answers[`${name}-error`]}
						helperText={answers[`${name}-helperText`]}
					/>
				)}
			</RadioGroup>
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
