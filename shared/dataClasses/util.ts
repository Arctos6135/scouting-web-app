export const email = {
	unique: true,
	validate: {
		validator: (s: string) => /^.+@.+\..{1,5}$/.test(s),
		message: 'value must be email'
	},
	maxlength: 100,
	minlength: 3
};