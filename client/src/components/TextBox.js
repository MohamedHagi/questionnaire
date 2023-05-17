import React from 'react';
import { TextField, Alert } from '@mui/material';

export default function TextBox({
	name,
	questionText,
	answers,
	handleInputChange,
	mandatory,
	mandatoryCheck,
	unselected,
}) {
	return (
		<div>
			<TextField
				fullWidth
				name={name}
				label={questionText}
				value={answers[name] || ''}
				onChange={handleInputChange}
				required
				margin="normal"
				error={answers[`${name}-error`]}
				helperText={answers[`${name}-helperText`]}
				className="question-text"
			/>

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
		</div>
	);
}
