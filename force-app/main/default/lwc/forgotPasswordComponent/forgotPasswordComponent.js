import { LightningElement, track } from 'lwc';
import resetPassword from '@salesforce/apex/ForgotPasswordComponentController.resetPassword';
import forgetPassword from '@salesforce/apex/ForgotPasswordComponentController.forgetPassword';
import IMAGE from "@salesforce/resourceUrl/AiflyLogo";

export default class ForgotPasswordComponent extends LightningElement {

    @track aiflyLogo = IMAGE;
    @track email = '';
    @track showVerifyPage = false;
    @track showEmailPage = false;
    @track resetPasswordPage = false;
    @track verfiyeNumber = 123;
    @track newPassword;
    @track confirmPassword;
    @track changeVerfiyeNumber;
    @track uniqueTeacherId = '';
    showErrorEmali = ''
    showErrorVerify = ''
    showErrorConfirm = ''

    connectedCallback() {
        console.log('called forget')
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleForgotPasswordClick() {
        if (this.email) {
            resetPassword({ teacherEmail: this.email })
                .then(result => {
                    if (result) {
                        var parsedResult = JSON.parse(result);
                        this.verfiyeNumber = parsedResult.verificationCode;
                        this.uniqueTeacherId = parsedResult.Teacher_SN__c;
                        this.showEmailPage = true
                        this.showVerifyPage = true;
                    } else {
                        this.showEmailPage = false;
                        this.showVerifyPage = false;
                        this.showErrorEmali = 'Please Enter A Valid Email';
                    }
                })
                .catch(error => {
                    this.showErrorEmali = 'Please Enter A Valid Email';
                });
        }
    }

    handleVerifyCodeChange() {
        this.changeVerfiyeNumber = event.target.value;
    }

    handleVerifyClick() {
        if (this.changeVerfiyeNumber == this.verfiyeNumber) {
            this.resetPasswordPage = true;
            this.showEmailPage = true;
            this.showVerifyPage = false;
        }
        else {
            this.showErrorVerify = 'Please Enter Valid Verification Code';
        }
    }

    handleNewPasswordChange() {
        this.newPassword = event.target.value;
    }

    handleOldPasswordChange() {
        this.confirmPassword = event.target.value;
    }

    handleChangePasswordClick() {
        if (this.newPassword === this.confirmPassword) {
            forgetPassword({ teacherId: this.uniqueTeacherId, newPassword: this.confirmPassword })
                .then(result => {
                    if (result) {
                        window.location = '/s/';
                    } else {
                        this.showErrorConfirm = 'Please Confirm Your Password';
                    }
                })
                .catch(error => {

                });
        }
    }
}