import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import IMAGE from "@salesforce/resourceUrl/AiflyLogo";
import decryptedData from '@salesforce/apex/TeacherDetailsController.decryptedData';
import getTeacherRecord from '@salesforce/apex/TeacherDetailsController.getTeacherRecord';

export default class TeacherPortal extends NavigationMixin(LightningElement) {

    @track companyLogo = IMAGE;
    @track teacherName;
    @track teacherUrlId;
    @track teacherRecords = [];
    @track showHomeTab = true;
    @track showPersonalInformationTab = false;
    @track showAnnouncementTab = false;
    @track showAttendanceTab = false;
    @track showAssignedClassesTab = false;
    @track showLeaveApplyTab = false;
    @track showResultTab = false;
    @track showLogoutButton = true;
    @track showDashboard = true;
    @track selectedTab = 'reports_home';

    connectedCallback() {
        this.teacherUrlId = localStorage.getItem('teacherId');
        console.log('this.teacherUrlId :::: ',this.teacherUrlId);
        this.checkendecryptedData();
        // this.checkDeviceStatus();
    }

    checkendecryptedData() {
        decryptedData({ teacherId: this.teacherUrlId })
            .then(result => {
                result = 'a15DG000002L6MxYAK';
                var decryptedTeacherId = result;
                localStorage.setItem('idofTeacher', decryptedTeacherId);
                getTeacherRecord({ teacherId: decryptedTeacherId })
                    .then((result) => {
                        this.teacherName = result;
                        console.log('this.teacherName ::: ',this.teacherName)
                        localStorage.setItem('teacherName', this.teacherName);
                    })
                    .catch((error) => {
                        this.error = error;
                    });
            })
            .catch(error => {
                console.error('Error validating login:', error);
            });
    }

    checkUserLogin(teacherId) {
        if (teacherId != '' && teacherId != undefined && teacherId != null) {
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
        // localStorage.removeItem('deviceUniqueIdLogin');
        // window.location = '/s/login/';
    }

    checkDeviceStatus() {
        const deviceUniqueIdOld = localStorage.getItem('deviceUniqueIdLogin');

        const fingerprint = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
        const currentDeviceUniqueId = btoa(fingerprint);
        const teacherId = localStorage.getItem('idofTeacher');
        if (teacherId && deviceUniqueIdOld === currentDeviceUniqueId) {
            this.checkUserLogin(teacherId);
        } else {
            this.checkUserLogin(null);
        }
    }

    handlePersonalInformationTab() {
        this.showPersonalInformationTab = true;
        this.showHomeTab = false;
        this.showAnnouncementTab = false;
        this.showAttendanceTab = false;
        this.showAssignedClassesTab = false;
        this.showLeaveApplyTab = false;
        this.showResultTab = false;
        this.showDashboard = false;
    }

    handleHomeTab() {
        this.showPersonalInformationTab = false;
        this.showHomeTab = true;
        this.showAnnouncementTab = false;
        this.showAttendanceTab = false;
        this.showAssignedClassesTab = false;
        this.showLeaveApplyTab = false;
        this.showResultTab = false;
        this.showDashboard = true;
        this.selectedTab = 'reports_home';
    }

    handleAnnouncementTab() {
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAnnouncementTab = true;
        this.showAttendanceTab = false;
        this.showAssignedClassesTab = false;
        this.showLeaveApplyTab = false;
        this.showResultTab = false;
        this.showDashboard = false;
    }

    handleAttendanceTab() {
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAnnouncementTab = false;
        this.showAttendanceTab = true;
        this.showAssignedClassesTab = false;
        this.showLeaveApplyTab = false;
        this.showResultTab = false;
        this.showDashboard = false;
    }

    handleAssignedClassesTab() {
        this.selectedTab = 'reports_assign_classes';
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAnnouncementTab = false;
        this.showAttendanceTab = false;
        this.showAssignedClassesTab = true;
        this.showLeaveApplyTab = false;
        this.showResultTab = false;
        this.showDashboard = false;
    }

    handleLeaveApplyTab() {
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAnnouncementTab = false;
        this.showAttendanceTab = false;
        this.showAssignedClassesTab = false;
        this.showLeaveApplyTab = true;
        this.showResultTab = false;
        this.showDashboard = false;
        this.selectedTab = 'reports_leave_apply';
    }

    handleResultTab() {
        this.showPersonalInformationTab = false;
        this.showHomeTab = false;
        this.showAnnouncementTab = false;
        this.showAttendanceTab = false;
        this.showAssignedClassesTab = false;
        this.showLeaveApplyTab = false;
        this.showResultTab = true;
        this.showDashboard = false;
    }
}