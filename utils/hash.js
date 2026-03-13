import { randomBytes, createHmac } from 'crypto';

export function hashPassword (password, userSalt=undefined){
    const salt=userSalt ?? randomBytes(256).toString('hex');
    const newPassword=createHmac('sha256',salt).update(password).digest('hex')

  return {salt, password:newPassword}

}