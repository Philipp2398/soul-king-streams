module.exports = {
	moduleNameMapper: {
		"^@root/(.*)$": "<rootDir>/$1",
		"^@controllers/(.*)$": "<rootDir>/src/api/controllers/$1",
		"^@middlewares/(.*)$": "<rootDir>/src/api/middlewares/$1",
		"^@routes/(.*)$": "<rootDir>/src/api/routes/$1",
		"^@emitters/(.*)$": "<rootDir>/src/emitters/$1",
		"^@listeners/(.*)$": "<rootDir>/src/listeners/$1",
		"^@lib/(.*)$": "<rootDir>/lib/$1",
		"^@kafka/(.*)$": "<rootDir>/src/api/$1"
	}
};