import { LightningElement , track} from 'lwc';
import getAttendanceRecord from '@salesforce/apex/AdminUIFirstPartController.getAttendanceRecord';
import { updateRecord } from 'lightning/uiRecordApi';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class StaffAttendancePage extends LightningElement {

    @track currentTime = {
        hours: '00',
        minutes: '00',
        seconds: '00'
    };
    @track staffName;
    @track dayName;
    @track attendanceId;
    @track isPresent;
    @track staffId;

    connectedCallback() {
        this.staffName = localStorage.getItem('staffName');
        console.log('staffName ::: ',this.staffName);
        this.staffId = localStorage.getItem('idofStaff');
        console.log('staffId :::: ',this.staffId);
        this.getAttendance();
        this.updateTimer();
    }

    getAttendance() {
        const now = new Date();
        var field = 'Day_' + now.getDate() + '__c';
        var monthName = month[now.getMonth()] + ' ' + now.getFullYear();
        getAttendanceRecord({ classId: '', fieldName: field, monthName: monthName, teacherId: '', staffId: this.staffId, recordType: 'Staff__c' })
            .then((result) => {
                console.log('result', JSON.stringify(result))
                this.attendanceId = result[0].Id;
                this.isPresent = result[0][field];
            })
            .catch((error) => {
                console.log(error);
            });
    }

    updateTimer() {
        setInterval(() => {
            const now = new Date();
            this.currentTime.hours = this.formatNumber(now.getHours());
            this.currentTime.minutes = this.formatNumber(now.getMinutes());
            this.currentTime.seconds = this.formatNumber(now.getSeconds());
        }, 1000);
    }

    formatNumber(number) {
        return number < 10 ? '0' + number : number.toString();
    }

    get buttonLabel() {
        return this.isSignedIn ? 'Sign Out' : 'Sign In';
    }

    get greeting() {
        const currentTime = new Date();
        const ISTOffset = 5.5 * 60; // 5 hours and 30 minutes
        const ISTTime = new Date(currentTime.getTime() + ISTOffset * 60000);
        const currentHour = ISTTime.getUTCHours();

        function getGreeting(hour) {
            if (hour < 12) {
                return "Good Morning";
            } else if (hour < 18) {
                return "Good Afternoon";
            } else {
                return "Good Evening";
            }
        }
        return getGreeting(currentHour);
    }

    get formattedDate() {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.dayName = daysOfWeek[currentDate.getDay()];
        return `${day} ${month} ${year}`;
    }

    handleToggleChange(event) {
        var attendanceId = event.currentTarget.dataset.id;
        console.log('attendanceId ::: ',attendanceId);
        var check = event.detail.checked;
        console.log('check ::: ',check);
        const currentDateTime = new Date();
        var fieldName = 'Day_' + currentDateTime.getDate() + '__c';
        console.log('fieldName ::: ',fieldName);
        currentDateTime.setHours(currentDateTime.getHours() + 12);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + 30);
        var twelveHoursAgo = currentDateTime.toISOString();
        console.log('twelveHoursAgo ::: ',twelveHoursAgo);
        if (check) {
            var record = {
                fields: {
                    Id: attendanceId,
                    Sign_In_Time__c: twelveHoursAgo
                },
            };
            updateRecord(record)
                .then((data) => {
                    console.log('updated.....');
                })
                .catch((error) => {
                    console.log('not updated.....');
                });
        } else {
            var record = {
                fields: {
                    Id: attendanceId,
                    [fieldName]: true,
                    Sign_Out_Time__c: twelveHoursAgo
                },
            };
            updateRecord(record)
                .then((data) => {
                    console.log('updated.....');
                })
                .catch((error) => {
                    console.log('not updated.....');
                });
        }
    }
}