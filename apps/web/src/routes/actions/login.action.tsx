import { ActionFunctionArgs, redirect } from "react-router";

import { IAuthContext } from "@/context";

type LoginFormData = {
  trainerName: string;
};

export const loginAction =
  ({ login }: IAuthContext) =>
  async ({ request }: ActionFunctionArgs<any>) => {
    const { trainerName } = Object.fromEntries(
      await request.formData()
    ) as LoginFormData;

    const { error } = await login(trainerName);

    if (error) redirect("/login");

    return redirect("/");
  };
