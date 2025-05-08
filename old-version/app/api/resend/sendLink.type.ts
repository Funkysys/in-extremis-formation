export type DEFAULT_STATE = {
  success: string;
  error: string;
  email: string;
  password: string;
  loading: false;
  disabled: false;
  emailError: string;
  passwordError: string;
};

type DEFAULT_STATE_ACTION = {
  formdata: FormData;
  formState: DEFAULT_STATE;
};

export const DEFAULT_STATE_ACTION = {
  formdata: new FormData(),
  formState: {},
};
