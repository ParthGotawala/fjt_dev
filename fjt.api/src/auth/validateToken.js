// const resHandler = require('../resHandler');
// const { STATE } = require('../constant');
const jwt = require('express-jwt');
// const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const { identity_server } = require('../../config/config');


// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const validateToken = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${identity_server.IdentityServerUrl}/.well-known/openid-configuration/jwks` // Port number for IDS host.
    }),

    // Validate the audience and the issuer.
    audience: identity_server.Q2CApiResources.Q2CAPI,
    issuer: `${identity_server.IdentityServerUrl}`,
    algorithms: ['RS256']
});

// const validateToken = (req, res, next) => {
//     //console.log(result);
//     next();
//     return null;
//     //return resHandler.errorRes(res, 500, STATE.FAILED, err);
// };

module.exports = validateToken;

