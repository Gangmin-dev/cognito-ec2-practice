const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: "ap-northeast-2_2VMRFBVwT",
  ClientId: "6p54hsa1fo1b3fele5j1n7fsdn",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// let attributeList = [];

function setCognitoAttributeList(attributes) {
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

function getCognitoUser(email) {
  const userData = {
    Username: email,
    Pool: getUserPool(),
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function getAuthDetails(email, password) {
  var authenticationData = {
    Username: email,
    Password: password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}
