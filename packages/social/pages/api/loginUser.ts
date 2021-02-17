import { data } from "../../static/example_data";
const loginUser = data?.loginUser;

export default function LoginUser(req: any, res: any) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(loginUser));
}
