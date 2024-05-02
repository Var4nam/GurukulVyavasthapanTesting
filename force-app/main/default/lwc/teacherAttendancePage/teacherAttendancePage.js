import { LightningElement, track } from 'lwc';
import getAttendanceRecord from '@salesforce/apex/AdminUIFirstPartController.getAttendanceRecord';
import { updateRecord } from 'lightning/uiRecordApi';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class TeacherAttendancePage extends LightningElement {

    @track currentTime = {
        hours: '00',
        minutes: '00',
        seconds: '00'
    };
    @track teacherName;
    @track dayName;
    @track attendanceId;
    @track isPresent;
    @track teacherId;

    connectedCallback() {
        this.teacherName = localStorage.getItem('teacherName');
        this.teacherId = localStorage.getItem('idofTeacher');
        this.getAttendance();
        this.updateTimer();
        const isPresent = localStorage.getItem('isPresent');
        if (isPresent !== null) {
            this.isPresent = isPresent === 'true';
        }
    }

    getAttendance() {
        const now = new Date();
        var field = 'Day_' + now.getDate() + '__c';
        var monthName = month[now.getMonth()] + ' ' + now.getFullYear();
        getAttendanceRecord({ classId: '', fieldName: field, monthName: monthName, teacherId: this.teacherId, recordType: 'Teacher__c' })
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
        return this.isPresent ? 'Sign Out' : 'Sign In';
    }

    get greeting() {
        const currentTime = new Date();
        const ISTOffset = 5.5 * 60;
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
        const attendanceId = this.attendanceId;
        const isChecked = event.detail.checked;
        const currentDateTime = new Date();
        const fieldName = 'Day_' + currentDateTime.getDate() + '__c';
        currentDateTime.setHours(currentDateTime.getHours() + 5);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + 30);
        const currentTimeISO = currentDateTime.toISOString();

        const record = {
            fields: {
                Id: attendanceId
            }
        };

        if (isChecked) {
            record.fields[fieldName] = true;
            record.fields['Sign_In_Time__c'] = currentTimeISO;
        } else {
            record.fields['Sign_Out_Time__c'] = currentTimeISO;
        }

        updateRecord(record)
            .then((data) => {
                console.log('Updated successfully', data);
                localStorage.setItem('isPresent', isChecked);
            })
            .catch((error) => {
                console.error('Error updating record', error);
            });
    }

}