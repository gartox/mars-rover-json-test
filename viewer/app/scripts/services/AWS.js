'use strict';
/* global AWS, DynamoDB */
/**
 * @ngdoc function
 * @name MSLImageExplorerApp.service:AWS
 * @description
 * # AWS
 * Service of the MSLImageExplorerApp. It initializes AWS SDK with providing credentials
 * either from Cognito Identity service or environment variables as specified in ENV service.
 * It initializes a DynamoDB client instance. The instance is exposed as AWS.dynamoDB. 
 */
angular.module('MSLImageExplorerApp').
    service('AWS', function ($log, ENV){
		if (ENV.useCognitoIdentity) { // Uses Cognito Idenity to get AWS credentials
  		    // Needs to set us-east-1 as the default to get credentials by Cognito
  		    AWS.config.update({region: 'us-east-1'});
  		    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  		    	AccountId: ENV.awsAccountId,
  		    	IdentityPoolId: ENV.identityPoolId,
  		    	RoleArn: ENV.unauthRoleArn
  		    });

  		    AWS.config.credentials.getId(function(){
                localStorage.setItem('userid', AWS.config.credentials.params.IdentityId);
                $log.info('AWS credentials initialized with Cognito Identity');
            });
        } else { // Uses environment variables to get AWS credentials.
            AWS.config.credentials = new AWS.Credentials({
                accessKeyId: ENV.accessKeyId,
                secretAccessKey: ENV.secretAccessKey
            });
            $log.info('AWS credentials initialized with environment variables');
            $log.debug('AWS Accesss Key is ' + ENV.accessKeyId);
            localStorage.setItem('userid', ENV.userId);
            $log.debug('User ID is set to ' + localStorage.getItem('userid'));
        }
 
        /**
        * DynamoDB client object.
        */
        AWS.dynamoDB = new DynamoDB(
            new AWS.DynamoDB({
                region: ENV.dynamoDBRegion,
                endpoint: ENV.dynamoDBEndpoint
            }));

        return AWS;
    });
