// import { LightningElement, track } from 'lwc';
// import IMAGE from "@salesforce/resourceUrl/AiflyLogo";
// import validateLoginPage from '@salesforce/apex/TeacherLoginController.validateLoginPage';
// import { NavigationMixin } from 'lightning/navigation';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import decryptedData from '@salesforce/apex/TeacherLoginController.decryptedData';
// import getRecord from '@salesforce/apex/TeacherLoginController.getRecord';

// const TOAST_VARIANT_ERROR = 'error';
// const TOAST_VARIANT_SUCCESS = 'success';

// export default class TeacherLoginPage extends NavigationMixin(LightningElement) {
//     @track username = '';
//     @track password = '';
//     @track eyeIcon = 'utility:hide';
//     @track inputType = 'password';
//     @track showWelcomeMessage = false;
//     @track loginError = false;
//     @track aiflyLogo = IMAGE;
//     showError = '';

//     handleUsernameChange(event) {
//         this.username = event.target.value;
//     }

//     handlePasswordChange(event) {
//         this.password = event.target.value;
//     }

//     togglePasswordVisibility() {
//         this.inputType = this.inputType === 'password' ? 'text' : 'password';
//         this.eyeIcon = this.inputType === 'password' ? 'utility:hide' : 'utility:preview';
//     }

//     showToast(message, variant) {
//         const toastEvent = new ShowToastEvent({
//             title: 'Toast Message',
//             message: message,
//             variant: variant,
//         });
//         this.dispatchEvent(toastEvent);
//     }

//     handleLoginClick() {
//         if (this.username != '' && this.password != '') {
//             console.log('userName ::: ',this.username)
//             console.log('password ::: ',this.password)
//             validateLoginPage({ username: this.username, password: this.password })
//                 .then(result => {
//                     if (result != '') {
//                         this.showWelcomeMessage = true;
//                         console.log('result >>', result);
//                         var message = 'You are successfully login';
//                         this.showToast(message, TOAST_VARIANT_SUCCESS);
//                         localStorage.setItem('teacherId', result);
//                         this.createUniqueDeviceIdentity();
//                         decryptedData({ teacherId: result })
//                             .then(result => {
//                                 var decryptedTeacherId = result;
//                                 console.log('decryptedTeacherId ---- > ',decryptedTeacherId);
//                                 getRecord({ id: decryptedTeacherId })
//                                     .then((result) => {
//                                         console.log('result ---- > ',result);
//                                         if(result == 'Teacher') {
//                                             this[NavigationMixin.Navigate]({
//                                                 type: 'standard__webPage',
//                                                 attributes: {
//                                                     url: '/s/teacher'
//                                                 }
//                                             });
//                                         } else if(result == 'Admin') {
//                                             localStorage.setItem('adminId', decryptedTeacherId);
//                                             this[NavigationMixin.Navigate]({
//                                                 type: 'standard__webPage',
//                                                 attributes: {
//                                                     url: '/s/admin'
//                                                 }
//                                             });
//                                         } else if(result == 'Student') {
//                                             localStorage.setItem('studentId', decryptedTeacherId);
//                                             this[NavigationMixin.Navigate]({
//                                                 type: 'standard__webPage',
//                                                 attributes: {
//                                                     url: '/s/student'
//                                                 }
//                                             });
//                                         } else {
//                                             this[NavigationMixin.Navigate]({
//                                                 type: 'standard__webPage',
//                                                 attributes: {
//                                                     url: '/s/login'
//                                                 }
//                                             });
//                                         }
//                                     })
//                                     .catch((error) => {
//                                         this.error = error;
//                                     });
//                             })
//                             .catch(error => {
//                                 console.error('Error validating login:', error);
//                             });                        
//                     } else {
//                         var message = 'Invalid username or password';
//                         this.showToast(message, TOAST_VARIANT_ERROR);
//                         console.log('Invalid username or password');
//                         this.showErrorToast('Invalid username or password');
//                     }
//                 })
//                 .catch(error => {
//                     //this.showError = 'Invalid username or password';
//                     console.log('Error validating login: ' + JSON.stringify(error));
//                 });
//         }
//     }

//     createUniqueDeviceIdentity() {
//         console.log('in login page');
//         const fingerprint = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
//         const hash = btoa(fingerprint);
//         localStorage.setItem('deviceUniqueIdLogin', hash)
//     }
// }