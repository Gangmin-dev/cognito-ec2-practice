const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const userPoolData = {
  UserPoolId: "ap-northeast-2_2VMRFBVwT",
  ClientId: "g2v9cp4djbldjrkmhaft2siar",
};

const adminPoolData = {
  UserPoolId: "ap-northeast-2_2VMRFBVwT",
  ClientId: "6oh8b64dehgqi8u8pbsft8e4bq",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData);
const adminPool = new AmazonCognitoIdentity.CognitoUserPool(adminPoolData);

function convertJsonAttributesToCognitoAttributeList(attributes) {
  let cognitoAttributeList = [];
  for (const [key, value] of Object.entries(attributes)) {
    cognitoAttributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: key,
        Value: value,
      })
    );
  }
  return cognitoAttributeList;
}

function getCognitoUser(username, type = "user") {
  const userData = {
    Username: username,
    Pool: getUserPool(type),
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool(type = "user") {
  let poolData = type === "user" ? userPoolData : adminPoolData;
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function getAuthDetails(authData) {
  const authenticationData = {
    Username: authData.username,
    Password: authData.password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

function signUp(authData, attributes, type = "user") {
  return new Promise((resolve) => {
    getUserPool(type).signUp(
      authData.username,
      authData.password,
      convertJsonAttributesToCognitoAttributeList(attributes),
      null,
      (err, result) => {
        if (err) return resolve({ statusCode: 422, response: err });
        const response = {
          username: result.user.username,
          userConfirmed: result.userConfirmed,
          userAgent: result.user.client.userAgent,
        };
        console.log(result);
        return resolve({ statusCode: 201, response: response });
      }
    );
  });
}

function confirmRegistration(username, verificationCode) {
  return new Promise((resolve) => {
    getCognitoUser(username).confirmRegistration(
      verificationCode,
      true,
      (err, result) => {
        if (err) return resolve({ statusCode: 422, response: err });
        return resolve({ statusCode: 200, response: result });
      }
    );
  });
}

function signIn(authData, type) {
  return new Promise((resolve) => {
    getCognitoUser(authData.username, type).authenticateUser(
      getAuthDetails(authData),
      {
        onSuccess: (result) => {
          const token = {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          };

          return resolve({
            statusCode: 200,
            response: token,
          });
        },
        onFailure: (err) => {
          return resolve({
            statusCode: 400,
            response: err.message || JSON.stringify(err),
          });
        },
      }
    );
  });
}

module.exports = {
  signUp,
  signIn,
  confirmRegistration,
};
