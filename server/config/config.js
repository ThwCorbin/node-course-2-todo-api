// Set up different production, development, and test environments
// Heroku takes care of production environment
// We need to set up dev and test environments with different dbases

let env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
  let config = require("./config.json");
  let envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}

