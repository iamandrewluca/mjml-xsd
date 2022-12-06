module.exports = {
	...require("@allindevelopers/prettier-config"),
	printWidth: 120,
	overrides: [
		{
			files: "*.{mjml,xsd}",
			options: { parser: "html" },
		},
	],
};
