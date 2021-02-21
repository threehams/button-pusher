import { Record, String, Union, Null, Static } from "runtypes";

export const Login = Record({
  username: Union(String, Null),
  password: Union(String, Null),
});
export type Login = Static<typeof Login>;
