import { LightningElement, track } from 'lwc';

export default class LoginForm extends LightningElement {
    @track username = '';
    @track password = '';

    handleUsernameChange(event) {
        this.username = event.target.value;
        console.log('this.userName::>>>',this.username);
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
        console.log('this.password::>>>',this.password);
    }

    handleLogin() {
        console.log('Username:', this.username);
        console.log('Password:', this.password);
    }

    handleSignupClick() {
        console.log('Signup clicked');
    }
}