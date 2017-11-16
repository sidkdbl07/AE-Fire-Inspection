if(Meteor.isServer) {
  Accounts.onCreateUser(function(options, user){
    if(!options.profile.firstname) {
      console.log("no firstname given");
    }else{
      console.log(options.profile.firstname+" added");
      new_profile = {
        firstname: options.profile.firstname,
        lastname: options.profile.lastname
      }
      user.profile = new_profile;
    }

    return user;
  });
}

AccountsTemplates.configure({
  hideSignUpLink: true,
  onLogoutHook: logoutHook,
  onSubmitHook: loginHook,
  texts: {
      title: {
        changePwd: "",
        enrollAccount: "",
        forgotPwd: "",
        resetPwd: "",
        signIn: "",
        signUp: "",
        verifyEmail: "",
      },
      inputIcons: {
          isValidating: "fa fa-spinner fa-spin",
          hasSuccess: "fa fa-check",
          hasError: "fa fa-times",
      },
      errors: {
            accountsCreationDisabled: "",
            cannotRemoveService: "",
            captchaVerification: "",
            loginForbidden: "",
            mustBeLoggedIn: "",
            pwdMismatch: "",
            validationErrors: "",
            verifyEmailFirst: "",
        }
    }
});

function loginHook(error,state) {
  if (!error) {
    if (state === "signIn") {
      FlowRouter.go('/');
    }
  }else{
    //toast("Login failed");
  }
}

function logoutHook() {
  FlowRouter.go('/login');
}
