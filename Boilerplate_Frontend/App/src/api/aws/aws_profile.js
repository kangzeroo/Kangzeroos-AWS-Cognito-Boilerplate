import { CognitoUserPool } from 'amazon-cognito-identity-js';
import 'amazon-cognito-js'


const REGION = "ap-southeast-1"
const USER_POOL_ID = 'ap-southeast-1_BLUKR5uV9'
const CLIENT_ID = '2tqtf10aa36j23j7dahej17mb1'

AWS.config.update({
	region: REGION
})
const userData = {
    UserPoolId : USER_POOL_ID,
    ClientId : CLIENT_ID
}

export const BUCKET_NAME = 'hebcognito'
export const userPool = new CognitoUserPool(userData);
export const USERPOOL_ID = 'cognito-idp.'+REGION+'.amazonaws.com/'+USER_POOL_ID
export const IDENTITY_POOL_ID = 'ap-southeast-1:d43eb293-2ce0-46ba-af3e-ff853259ebec'
