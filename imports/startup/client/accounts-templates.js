/* global AccountsTemplates  */
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Router } from 'meteor/justinr1234:lib';

const onLogoutHook = () => FlowRouter.go('/');

// Options
AccountsTemplates.configure({
  defaultTemplate: '',
  defaultLayout: 'App_Body',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {
    nav: 'Header',
    footer: 'Footer',
  },
  showForgotPasswordLink: false,
  overrideLoginErrors: true,
  lowercaseUsername: false,
  focusFirstInput: true,
  forbidClientAccountCreation: false,
  homeRoutePath: '/', // ROOT path set by client app, can't use Router.routeMap.ROOT.path it won't exist
  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: true,
  onLogoutHook,
});

const successfulSignInRedirect = function successfulSignInRedirect() {
  return FlowRouter.go('/'); // ROOT path set by client app, can't use Router.routeMap.ROOT.path it won't exist
};

// Routes
// // AccountsTemplates.configureRoute('changePwd');
// // AccountsTemplates.configureRoute('forgotPwd');
// // AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn', {
  name: 'Login',
  path: Router.routeMap.APP_LOGIN.path,
  template: 'APP_LOGIN',
  redirect: successfulSignInRedirect,
});
AccountsTemplates.configureRoute('signUp', {
  name: 'SignUp',
  path: Router.routeMap.APP_REGISTER.path,
  template: 'APP_REGISTER',
});
// // AccountsTemplates.configureRoute('verifyEmail');

const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email'); // Won't re-add this ref

const emailLabel = 'Email Address';
AccountsTemplates.addFields([
  {
    _id: 'email',
    type: 'email',
    displayName: emailLabel,
    placeholder: emailLabel,
    required: true,
    minLength: 5,
    func: function isNotValid(value) {
      const emailReg = /^(?!.{253,})[\w'-]+(?:\.[\w'-]+)*(?:\+[\w'-]+(\.[\w'-]+)*)?@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ig; // eslint-disable-line max-len
      const isBadValue = !emailReg.exec(value);

      return isBadValue;
    },
    transform(value) {
      const normalizedValue = (value || '').toLowerCase();

      return normalizedValue;
    },
    errStr: 'Invalid email!',
  },
  pwd,
]);

const fnameLabel = 'First Name';
AccountsTemplates.addFields([
  {
    _id: 'fname',
    type: 'text',
    displayName: fnameLabel,
    placeholder: fnameLabel,
    required: true,
    minLength: 2,
  },
]);

const lnameLabel = 'Last Name';
AccountsTemplates.addFields([
  {
    _id: 'lname',
    type: 'text',
    displayName: lnameLabel,
    placeholder: lnameLabel,
    required: true,
    minLength: 2,
  },
]);

const phoneLabel = 'Mobile Phone';
AccountsTemplates.addField({
  _id: 'phone',
  type: 'tel',
  displayName: phoneLabel,
  placeholder: phoneLabel,
  minLength: 10,
  maxLength: 14,
  required: true,
  func: function isNotValid(value) {
    const isBadValue = !value | value.length !== 14;

    return isBadValue;
  },
  transform(value) {
    const digits = value.replace(/[^0-9]+/g, '');

    if (digits) {
      return digits.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');
    }

    return '';
  },
  errStr: 'Invalid Phone number!',
});
