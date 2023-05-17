import React from 'react';
import { NativeSelect, FormControl, Alert, TextField } from '@mui/material';
export default function Select({
	name,
	questionText,
	answers,
	handleInputChange,
	mandatory,
	mandatoryCheck,
	unselected,
	options,
}) {
	const isOtherSelected = answers[name] === 'Other';
	return (
		<FormControl fullWidth>
			<NativeSelect
				name={name}
				value={answers[name] || ''}
				onChange={handleInputChange}
				data-testid="select"
				required
			>
				<option value="" disabled>
					{questionText}
				</option>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</NativeSelect>
			{isOtherSelected && (
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
