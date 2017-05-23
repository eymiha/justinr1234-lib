// /* global AccountsTemplates */
// import { Template } from 'meteor/templating';
//
// const helpers = Object.assign(
//   {
//     any(a, b, c) {
//       return a || b || c ? true : false; // eslint-disable-line no-unneeded-ternary
//     },
//   },
//   AccountsTemplates.atSignupLinkHelpers,
//   AccountsTemplates.atFormHelpers,
//   AccountsTemplates.atPwdFormHelpers
// );
//
// // Simply 'inherites' helpers from AccountsTemplates
// Template.APP_LOGIN.helpers(helpers);
//
// const onEmailFieldChange = function onEmailFieldChange(event) {
//   if (localStorage) {
//     localStorage.currentEmail = event.currentTarget.value;
//   }
// };
//
// const events = {
//   ...AccountsTemplates.atSignupLinkEvents,
//   ...AccountsTemplates.atPwdFormEvents,
//   'change #at-field-email': onEmailFieldChange,
// };
//
// // Simply 'inherites' events from AccountsTemplates
// Template.APP_LOGIN.events(events);
//
// const onAppLoginRendered = function onAppLoginRendered() {
//   const emailEl = document.getElementById('at-field-email');
//
//   if (!emailEl.value && localStorage && localStorage.currentEmail) {
//     emailEl.value = localStorage.currentEmail;
//     document.getElementById('at-field-password').focus();
//   }
// };
//
// Template.APP_LOGIN.onRendered(onAppLoginRendered);
