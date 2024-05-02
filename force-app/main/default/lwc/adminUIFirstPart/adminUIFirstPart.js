import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import IMAGE from "@salesforce/resourceUrl/AiflyLogo";
import getTeacherRecords from '@salesforce/apex/AdminUIFirstPartController.getTeacherRecords';
import getParentRecords from '@salesforce/apex/AdminUIFirstPartController.getParentRecords';
import getStudentRecords from '@salesforce/apex/AdminUIFirstPartController.getStudentRecords';
import getEmployeeRecord from '@salesforce/apex/AdminUIFirstPartController.showEmployeeRecord';
import getSchoolRecord from '@salesforce/apex/AdminUIFirstPartController.getSchoolRecord';
import getAssignClassRecord from '@salesforce/apex/AdminUIFirstPartController.getAssignClassRecord';
import getAdminRecords from '@salesforce/apex/AdminUIFirstPartController.getAdminRecords';
import getAdminName from '@salesforce/apex/AdminUIFirstPartController.getAdminName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AdminUIFirstPart extends NavigationMixin(LightningElement) {

    //Variables for admin
    @track companyLogo = IMAGE;
    @track adminName;
    @track adminId;
    @track showAdminDashboard = true;
    @track showSchoolModal = false;
    @track showClassAndAssignedSubject = false;
    @track assignedClasses = [];
    @track index = 1;
    @track fetchedRecords = false;
    @track selectedTeacher;
    @track schoolRecord;
    @track showLogoutButton = false;

    @track schoolColumns = [
        { label: 'Class', fieldName: 'Class__c', editable: 'false' },
        { label: 'Number of Period', fieldName: 'No_Of_Period__c', editable: 'true' },
        { label: 'Duration', fieldName: 'Duration__c', editable: 'true' },
    ];

    //Variables for teacher
    @track showTeacherDashboard = false;
    @track showTeacherPannel = true;
    @track showTeacherTable = false;
    @track showAssignClassTable = false;
    @track totalTeachers;
    @track showTeacherAttendanceTable = false;

    //Variables for student
    @track showStudentDashboard = false;
    @track showStudentTable = false;
    @track showStudentPannel = true;
    @track totalStudents;

    //Variables for Announcement
    @track showAnnouncementDashboard = false;
    @track showAnnouncementTable = false;
    @track showAnnouncementPannel = true;

    //Variables for Parent-Guardian
    @track showParentDashboard = false;
    @track showParentPannel = true;
    @track showParentTable = false;
    @track totalParents;

    //Variables for class
    @track showClassDashboard = false;
    @track showClassTable = false;
    @track showClassPannel = true;

    //Variables for event calendar
    @track showEventCalendarDashboard = false;

    //Variables for event management
    @track showEventManagementDashboard = false;
    @track showEventManagementTable = false;
    @track showEventManagementPannel = true;

    //Variables for employee
    @track showEmployeeDashboard = false;
    @track showEmployeeTable = false;
    @track showEmployeePannel = true;
    @track totalEmployees;

    //Variable for admin tab
    @track showAdminTab = false;
    @track totalAdmins;

    //Variables for fee management
    @track showFeeManagementDashboard = false;
    @track showFeeManagementTable = false;
    @track showFeeManagementPannel = true;

    //Variables for attendance
    @track showAttendanceDashboard = false;

    //Variables for timeTable
    @track showTimeTableDashboard = false;

    //Variable for subject
    @track showSubjectDashboard = false;

    //Varibale for spinner
    @track waitForASection = false;

    //Variable for paper
    @track showPaperDashboard = false;
    @track showPaperTable = false;
    @track showPaperPannel = true;

    //Variable for result
    @track showResultDashboard = false;
    @track showResultTable = false;
    @track showResultPannel = true;
    @track showPublishTable = false;


    get serialNumber() {
        return this.index++;
    }

    connectedCallback() {
        // this.checkDeviceStatus();
        // this.checkendecryptedData();
    }

    checkendecryptedData() {
        const adminId = localStorage.getItem('adminId');
        getAdminName({ adminId: adminId })
            .then((data) => {
                const now = new Date();
                const hours = now.getHours();
                if (hours >= 0 && hours < 12) {
                    this.adminName = 'Good Morning, ' + data;
                } else if (hours > 12 && hours < 17) {
                    this.adminName = 'Good Afternoon, ' + data;
                } else {
                    this.adminName = 'Good Evening, ' + data;
                }
            })
            .catch((error) => {
                this.error = error;
            });

    }

    checkUserLogin(adminId) {
        if (adminId != '' && adminId != undefined && adminId != null) {
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

    handleLogoutClick() {
        localStorage.removeItem('deviceUniqueIdLogin');
        window.location = '/s/login/';
    }

    checkDeviceStatus() {
        const deviceUniqueIdOld = localStorage.getItem('deviceUniqueIdLogin');

        const fingerprint = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
        const currentDeviceUniqueId = btoa(fingerprint);
        this.adminId = localStorage.getItem('adminId');
        console.log('adminId :::: ', this.adminId);
        if (this.adminId && deviceUniqueIdOld === currentDeviceUniqueId) {
            this.checkUserLogin(this.adminId);
        } else {
            this.checkUserLogin(null);
        }
    }

    @wire(getTeacherRecords)
    wiredTeachers({ data, error }) {
        if (data) {
            this.totalTeachers = data.length;
        }
        else if (error) {
            window.console.log(error);
        }
    }

    @wire(getParentRecords)
    wiredParents({ data, error }) {
        if (data) {
            this.totalParents = data.length;
        }
        else if (error) {
            window.console.log(error);
        }
    }

    @wire(getStudentRecords)
    wiredStudents({ data, error }) {
        if (data) {
            this.totalStudents = data.length;
        }
        else if (error) {
            window.console.log(error);
        }
    }

    @wire(getEmployeeRecord)
    wiredEmployees({ data, error }) {
        if (data) {
            this.totalEmployees = data.length;
        }
        else if (error) {
            window.console.log(error);
        }
    }

    @wire(getAdminRecords)
    wiredAdmin({ data, error }) {
        if (data) {
            this.totalAdmins = data.length;
        }
        else if (error) {
            window.console.log(error);
        }
    }

    handleLogoClick() {
        this.showAdminDashboard = true;
        this.showTeacherDashboard = false;
        this.showTeacherTable = false;
        this.showTeacherPannel = true;
        this.showAnnouncementDashboard = false;
        this.showAnnouncementTable = false;
        this.showAnnouncementPannel = true;
        this.showParentDashboard = false;
        this.showParentTable = false;
        this.showParentPannel = true;
        this.showStudentDashboard = false;
        this.showStudentTable = false;
        this.showStudentPannel = true;
        this.showClassDashboard = false;
        this.showClassTable = false;
        this.showClassPannel = true;
        this.showEventCalendarDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEventManagementTable = false;
        this.showEventManagementPannel = true;
        this.showEmployeeDashboard = false;
        this.showEmployeeTable = false;
        this.showEmployeePannel = true;
        this.showAssignClassTable = false;
        this.showFeeManagementDashboard = false;
        this.showFeeManagementTable = false;
        this.showFeeManagementPannel = true;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showTeacherAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showPaperTable = false;
        this.showPaperPannel = true;
        this.showResultDashboard = false;
        this.showResultTable = false;
        this.showResultPannel = true;
    }

    handleTeacherTab() {
        this.showAdminDashboard = false;
        this.showTeacherDashboard = true;
        this.showAnnouncementDashboard = false;
        this.showParentDashboard = false;
        this.showStudentDashboard = false;
        this.showClassDashboard = false;
        this.showEventCalendarDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleTeacherBack() {
        this.showTeacherTable = false;
        this.showAssignClassTable = false;
        this.showTeacherAttendanceTable = false;
        this.showTeacherPannel = true;
    }

    handleAllTeacherClick() {
        this.showTeacherPannel = false;
        this.showAssignClassTable = false;
        this.showTeacherAttendanceTable = false;
        this.showTeacherTable = true;
    }

    handleTeacherAttendanceClick() {
        this.showTeacherPannel = false; 
        this.showTeacherAttendanceTable = true;
    }

    handleAssignClassClick() {
        this.showTeacherPannel = false;
        this.showAssignClassTable = true;
    }

    handleStudentTab() {
        this.showAdminDashboard = false;
        this.showTeacherDashboard = false;
        this.showParentDashboard = false;
        this.showStudentDashboard = true;
        this.showAnnouncementDashboard = false;
        this.showClassDashboard = false;
        this.showEventCalendarDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleStudentBack() {
        this.showStudentTable = false;
        this.showStudentAttendanceTable = false;
        this.showStudentPannel = true;
    }

    handleAllStudentClick() {
        this.showStudentPannel = false;
        this.showStudentTable = true;
    }

    handleStudentAttendanceClick() {
        this.showStudentPannel = false;
        this.showStudentAttendanceTable = true;
    }

    handleAnnouncementTab() {
        this.showAdminDashboard = false;
        this.showTeacherDashboard = false;
        this.showAnnouncementDashboard = true;
        this.showParentDashboard = false;
        this.showStudentDashboard = false;
        this.showClassDashboard = false;
        this.showEventCalendarDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleAnnouncementBack() {
        this.showAnnouncementTable = false;
        this.showAnnouncementPannel = true;
    }

    handleAllAnnouncementClick() {
        this.showAnnouncementTable = true;
        this.showAnnouncementPannel = false;
    }

    handleParentTab() {
        this.showAdminDashboard = false;
        this.showTeacherDashboard = false;
        this.showParentDashboard = true;
        this.showAnnouncementDashboard = false;
        this.showStudentDashboard = false;
        this.showClassDashboard = false;
        this.showEventCalendarDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleParentBack() {
        this.showParentTable = false;
        this.showParentPannel = true;
    }

    handleAllParentClick() {
        this.showParentTable = true;
        this.showParentPannel = false;
    }

    handleClassTab() {
        this.showAdminDashboard = false;
        this.showTeacherDashboard = false;
        this.showParentDashboard = false;
        this.showClassDashboard = true;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventCalendarDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleClassBack() {
        this.showClassTable = false;
        this.showClassPannel = true;
    }

    handleAllClassesClick() {
        this.showClassTable = true;
        this.showClassPannel = false;
    }

    handleEventCalendarTab() {
        this.showEventCalendarDashboard = true;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleEventManagementTab() {
        this.showEventCalendarDashboard = false;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = true;
        this.showEmployeeDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleEventManagementBack() {
        this.showEventManagementTable = false;
        this.showEventManagementPannel = true;
    }

    handleAllEventsClick() {
        this.showEventManagementTable = true;
        this.showEventManagementPannel = false;
    }

    handleFeeManagementTab() {
        this.showFeeManagementDashboard = true;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleFeeManagementBack() {
        this.showFeeManagementTable = false;
        this.showFeeManagementPannel = true;
    }

    handleAllFeeClick() {
        this.showFeeManagementTable = true;
        this.showFeeManagementPannel = false;
    }

    handleEmployeeTab() {
        this.showEmployeeDashboard = true;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleEmployeeBack() {
        this.showEmployeeTable = false;
        this.showEmployeePannel = true;
    }

    handleAllEmployeeClick() {
        this.showEmployeeTable = true;
        this.showEmployeePannel = false;
    }

    handleTimeTableTab() {
        this.showTimeTableDashboard = true;
        this.showAdminDashboard = false;
        this.showTeacherDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showParentDashboard = false;
        this.showStudentDashboard = false;
        this.showClassDashboard = false;
        this.showEventCalendarDashboard = false;
        this.showEventManagementDashboard = false;
        this.showEmployeeDashboard = false;
        this.showAssignClassDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAttendanceDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleAttendanceTab() {
        this.showAttendanceDashboard = true;
        this.showFeeManagementDashboard = false;
        this.showAssignClassDashboard = false;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showTimeTableDashboard = false;
        this.showSubjectDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleSubjectTab() {
        this.showSubjectDashboard = true;
        this.showAttendanceDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAssignClassDashboard = false;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showTimeTableDashboard = false;
        this.showAdminTab = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handleAdminTab() {
        this.showAdminTab = true;
        this.showSubjectDashboard = false;
        this.showAttendanceDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAssignClassDashboard = false;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showTimeTableDashboard = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = false;
    }

    handlePaperTab() {
        this.showAdminTab = false;
        this.showSubjectDashboard = false;
        this.showAttendanceDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAssignClassDashboard = false;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showTimeTableDashboard = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = true;
        this.showResultDashboard = false;
    }

    handlePaperBack() {
        this.showPaperTable = false;
        this.showPaperPannel = true;
    }

    handleAllPaperClick() {
        this.showPaperPannel = false;
        this.showPaperTable = true;
    }

    

    handleResultTab() {
        this.showAdminTab = false;
        this.showSubjectDashboard = false;
        this.showAttendanceDashboard = false;
        this.showFeeManagementDashboard = false;
        this.showAssignClassDashboard = false;
        this.showAdminDashboard = false;
        this.showParentDashboard = false;
        this.showTeacherDashboard = false;
        this.showClassDashboard = false;
        this.showStudentDashboard = false;
        this.showAnnouncementDashboard = false;
        this.showEventManagementDashboard = false;
        this.showTimeTableDashboard = false;
        this.showStudentAttendanceTable = false;
        this.showPaperDashboard = false;
        this.showResultDashboard = true;
    }

    handleResultBack() {
        this.showResultTable = false;
        this.showPublishTable = false;
        this.showResultPannel = true;
    }

    handleResultClick() {
        this.showResultPannel = false;
        this.showResultTable = true;
    }

    handlePublishClick() {
        this.showResultPannel = false;
        this.showPublishTable = true;
    }

    closeModal() {
        this.showSchoolModal = false;
        this.showClassAndAssignedSubject = false;
        this.waitForASection = false;
    }

    handleSchoolModalCancelClick() {
        this.showSchoolModal = false;
    }

    handleSchoolModalSaveClick() {
        this.showSchoolModal = false;
        var msg = 'Record updated successfully.';
        this.showSuccessToast(msg);
    }

    handleSchoolInformationTab() {
        this.showSchoolModal = true;
        getSchoolRecord()
            .then((result) => {
                this.schoolRecord = result;
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleClassAndAssignedSubjectTab() {
        this.showClassAndAssignedSubject = true;
        setTimeout(() => {
            this.waitForASection = true;
        }, 1000);
    }

    handleClassChange() {
        this.selectedTeacher = event.target.value;
        console.log(this.selectedTeacher);
    }

    handleGoClick() {
        this.assignedClasses = [];
        getAssignClassRecord({ teacherId: this.selectedTeacher })
            .then((result) => {
                this.index = 1;
                if (result.length > 0) {
                    this.fetchedRecords = true;
                    this.assignedClasses = result;
                } else {
                    this.assignedClasses = [];
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    showSuccessToast(msg) {
        const event = new ShowToastEvent({
            title: 'Successful',
            variant: 'success',
            message: msg,
        });
        this.dispatchEvent(event);
    }
}