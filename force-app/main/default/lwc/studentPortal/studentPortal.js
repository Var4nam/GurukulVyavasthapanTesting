import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import IMAGE from "@salesforce/resourceUrl/AiflyLogo";
import decryptedData from '@salesforce/apex/StudentDetailsController.decryptedData';
import getStudentRecord from '@salesforce/apex/StudentDetailsController.getStudentRecord';

export default class StudentPortal extends NavigationMixin(LightningElement) {
    @track companyLogo = IMAGE;
    @track studentName;
    @track studentUrlId;
    @track studentRecords = [];
    @track showHomeTab = true;
    @track showAttendanceTab = false;
    @track showLeaveApplyTab = false;
    @track showPersonalInformationTab = false;
    @track showLogoutButton = true;
    @track selectedTab = 'reports_home';

    connectedCallback() {
        this.studentUrlId = localStorage.getItem('studentId');
        console.log('this.studentUrlId :::: ',this.studentUrlId);
        this.checkendecryptedData();
    }

    checkendecryptedData() {
        decryptedData({ studentId: this.studentUrlId })
            .then(result => {
                var decryptedStudentId = 'a0zDG0000043sxUYAQ';
                localStorage.setItem('idofStudent', decryptedStudentId);
                getStudentRecord({ studentId: decryptedStudentId })
                    .then((result) => {
                        this.studentName = result;
                        console.log('this.studentName ::: ',this.studentName)
                        localStorage.setItem('studentName', this.studentName);
                    })
                    .catch((error) => {
                        this.error = error;
                    });
            })
            .catch(error => {
                console.error('Error validating login:', error);
            });
    }

    checkUserLogin(studentId) {
        if (studentId != '' && studentId != undefined && studentId != null) {
            this.showLogoutButton = true;
        } else {
            localStorage.removeItem('deviceUniqueIdLogin');
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/login/'
                }
            });
        }
    }

    handleClick() {
        localStorage.removeItem('deviceUniqueIdLogin');
        window.location = '/s/login/';
    }

    checkDeviceStatus() {
        const deviceUniqueIdOld = localStorage.getItem('deviceUniqueIdLogin');

        const fingerprint = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
        const currentDeviceUniqueId = btoa(fingerprint);
        const studentId = localStorage.getItem('idofStudent');
        if (studentId && deviceUniqueIdOld === currentDeviceUniqueId) {
            this.checkUserLogin(studentId);
        } else {
            this.checkUserLogin(null);
        }
    }

    handlePersonalInformationTab() {
        this.showPersonalInformationTab = true;
        this.showHomeTab = false;
        this.showAttendanceTab = false;
        this.showLeaveApplyTab = false;
    }

    handleHomeTab() {
        this.selectedTab = 'reports_home';
        this.showPersonalInformationTab = false;
        this.showHomeTab = true;
        this.showAttendanceTab = false;
        this.showLeaveApplyTab = false;
    }

    handleAttendanceTab() {
        this.selectedTab = 'reports_attendance';
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAttendanceTab = true;
        this.showLeaveApplyTab = false;
    }

    handleLeaveApplyTab() {
        this.selectedTab = 'reports_leaveApply';
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAttendanceTab = false;
        this.showLeaveApplyTab = true;
    }
}