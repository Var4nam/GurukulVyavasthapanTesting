import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import IMAGE from "@salesforce/resourceUrl/AiflyLogo";
import decryptedData from '@salesforce/apex/ParentDetailsContoller.decryptedData';
import getParentGuardianRecords from '@salesforce/apex/ParentDetailsContoller.getParentGuardianRecords';

export default class ParentPortal extends NavigationMixin(LightningElement) {

    @track companyLogo = IMAGE;
    @track parentName;
    @track parentUrlId;
    @track parentRecords = [];
    @track showHomeTab = true;
    @track showAnnouncementTab = false;
    @track showAttendanceTab = false;
    @track showEventCalendarTab = false;
    @track showPersonalInformationTab = false;

    checkendecryptedData() {
        decryptedData({ parentId: this.parentUrlId })
            .then(result => {
                var decryptedParentId = result;
                localStorage.setItem('idofTeacher', decryptedParentId);
                getParentGuardianRecords({ parentId: decryptedParentId })
                    .then((result) => {
                        this.parentName = result;
                        console.log('this.parentName ::: ', this.parentName)
                        localStorage.setItem('parentName', this.parentName);
                    })
                    .catch((error) => {
                        this.error = error;
                    });
            })
            .catch(error => {
                console.error('Error validating login:', error);
            });
    }

    checkUserLogin(parentId) {
        if (parentId != '' && parentId != undefined && parentId != null) {
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
        const parentId = localStorage.getItem('idofTeacher');
        if (parentId && deviceUniqueIdOld === currentDeviceUniqueId) {
            this.checkUserLogin(parentId);
        } else {
            this.checkUserLogin(null);
        }
    }

    handlePersonalInformationTab() {
        this.showHomeTab = false;
        this.showAttendanceTab = false;
        this.showEventCalendarTab = false;
        this.showPersonalInformationTab = true
    }

    handleHomeTab() {
        this.showHomeTab = true;
        this.showAttendanceTab = false;
        this.showEventCalendarTab = false;
        this.showPersonalInformationTab = false
    }

    handleAnnouncementTab() {
        this.showHomeTab = false;
        this.showAttendanceTab = false;
        this.showEventCalendarTab = false;
        this.showPersonalInformationTab = false
    }

    handleAttendanceTab() {
        this.showHomeTab = false;
        this.showAttendanceTab = true;
        this.showEventCalendarTab = false;
        this.showPersonalInformationTab = false
    }

    handleEventCalendarTab() {
        this.showHomeTab = false;
        this.showAttendanceTab = false;
        this.showEventCalendarTab = true;
        this.showPersonalInformationTab = false
    }
}