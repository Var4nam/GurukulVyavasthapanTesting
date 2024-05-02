import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import IMAGE from "@salesforce/resourceUrl/AiflyLogo";
//import decryptedData from '@salesforce/apex/TeacherDetailsController.decryptedData';
//import getTeacherRecord from '@salesforce/apex/TeacherDetailsController.getTeacherRecord';

export default class AdmissionCellPortal extends LightningElement {

    @track companyLogo = IMAGE;
    @track showLogoutButton = true;

    handleClick() {
        // localStorage.removeItem('deviceUniqueIdLogin');
        // window.location = '/s/login/';
    }
}