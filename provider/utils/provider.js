const { Provider } = require("oidc-provider");
const configuration = require("../configuration");

module.exports = new Provider(`${process.env.PROVIDER_URL}oidc`, configuration);
