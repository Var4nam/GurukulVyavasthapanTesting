import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import IMAGE from "@salesforce/resourceUrl/AiflyLogo";
import decryptedData from '@salesforce/apex/StaffDetailsController.decryptedData';
import getStaffRecord from '@salesforce/apex/StaffDetailsController.getStaffRecord';

export default class StaffPortal extends NavigationMixin(LightningElement) {

    @track companyLogo = IMAGE;
    @track staffName;
    @track staffUrlId;
    @track staffRecords = [];
    @track showHomeTab = true;
    @track showPersonalInformationTab = false;
    @track showAttendanceTab = false;
    @track showLeaveApplyTab = false;
    @track showLogoutButton = true;
    @track selectedTab = 'reports_home';

    connectedCallback() {
        this.staffUrlId = localStorage.getItem('staffId');
        console.log('this.staffUrlId :::: ',this.staffUrlId);
        this.checkendecryptedData();
        // this.checkDeviceStatus();
    }

    checkendecryptedData() {
        decryptedData({ staffId: this.staffUrlId })
            .then(result => {
                var decryptedStaffId = 'a1JDG000002RAdy2AG';
                localStorage.setItem('idofStaff', decryptedStaffId);
                getStaffRecord({ staffId: decryptedStaffId })
                    .then((result) => {
                        this.staffName = result;
                        console.log('this.staffName ::: ',this.staffName)
                        localStorage.setItem('staffName', this.staffName);
                    })
                    .catch((error) => {
                        this.error = error;
                    });
            })
            .catch(error => {
                console.error('Error validating login:', error);
            });
    }

    checkUserLogin(staffId) {
        if (staffId != '' && staffId != undefined && staffId != null) {
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
        const staffId = localStorage.getItem('idofStaff');
        if (staffId && deviceUniqueIdOld === currentDeviceUniqueId) {
            this.checkUserLogin(staffId);
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
        this.showPersonalInformationTab = false;
        this.showHomeTab = true;
        this.showAttendanceTab = false;
        this.showLeaveApplyTab = false;
        this.selectedTab = 'reports_home';
    }

    handleAttendanceTab() {
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAttendanceTab = true;
        this.showLeaveApplyTab = false;
        this.selectedTab = 'reports_attendance';
    }

    handleLeaveApplyTab() {
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAttendanceTab = false;
        this.showLeaveApplyTab = true;
        this.selectedTab = 'reports_leaveApply';
    }
}