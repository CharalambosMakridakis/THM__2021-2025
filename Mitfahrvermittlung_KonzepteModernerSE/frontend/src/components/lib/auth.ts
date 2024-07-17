import pb from './pocketbase.ts';

/**
 * [login]
 * Description: [the actual user check in database handled by pocketbase function call]
 *
 * @param {[LoginProp]} [data] - [contains username and password]
 * @returns {[boolean]} [true or false depending on login attempt return]
 */

//interface for Loginprop
interface ILogin {
  email: string;
  password: FormDataEntryValue | null;
}

export async function login(data: ILogin) {
  try {
    //call database provided login function
    await pb
      .collection('users')
      .authWithPassword(data.email, data.password as string);
    //logon worked
    return true;
  } catch (e) {
    //error while login
    return false;
  }
}
