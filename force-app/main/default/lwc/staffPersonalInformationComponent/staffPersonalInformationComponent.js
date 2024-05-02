import { LightningElement, track } from 'lwc';
export default class StaffPersonalInformationComponent extends LightningElement {

    @track staffId;

    connectedCallback() {
        this.staffId = localStorage.getItem('idofStaff');
        console.log('this.staffId :::: ',this.staffId);
    }
}