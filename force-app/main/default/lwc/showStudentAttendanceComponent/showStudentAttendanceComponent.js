import { LightningElement, track } from 'lwc';
import getStudentRecordsForAttendance from '@salesforce/apex/AdminUIFirstPartController.getStudentRecordsForAttendance';
import getAttendanceCalendar from '@salesforce/apex/StudentAttendanceCalendarController.getAttendanceCalendar';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class ShowStudentAttendanceComponent extends LightningElement {

    @track classValue;
    @track students = [];
    @track goForAttendance = false;
    @track index = 1;
    @track showCalendar = false;

    @track currentDate = new Date();
    @track dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    @track days = [];
    @track emptyCells = [];
    @track attendanceData = [];
    @track currentMonth;
    @track studentId;

    get serialNumber() {
        return this.index++;
    }

    handleClassChange(event) {
        this.classValue = event.target.value;
    }

    handleGetRecordsClick() {
        getStudentRecordsForAttendance({ classValue: this.classValue})
            .then((result) => {
                this.index = 1;
                if (result.length > 0) {
                    this.goForAttendance = true;
                    this.students = result;
                } else {
                    this.students = [];
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleShowAttendanceClick(event) {
        this.showCalendar = true;
        this.studentId = event.currentTarget.dataset.id;
        this.getAttendance();
    }

    handleCancel() {
        this.showCalendar = false;
    }

    getAttendance() {
        var monthName = month[this.currentDate.getMonth()] + ' ' + this.currentDate.getFullYear();
        console.log('monthName :::: ',monthName);
        console.log('student ID :::: ',this.studentId);
        console.log('selected date :::: ',this.selectedDate);
        getAttendanceCalendar({ studentId: this.studentId, selectedDate : this.currentDate, monthName: monthName})
        .then(result => {
            console.log('result ::: ',JSON.stringify(result));
            this.attendanceData = result;
            this.ganerateCalendar();
        })
        .catch(error => {
            console.log('this.createError' + error);
        });
    }

    ganerateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        this.currentMonth = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
        this.emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i);
        this.days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayOfWeek = new Date(year, month, day).getDay();
            const attendanceItem = this.attendanceData.find(item => {
                return item.dayNumber === day && item.monthNumber === month + 1;
            });
            let label = day.toString();
            let className = 'day ';
            if (attendanceItem) {
                if (attendanceItem.status === 'absent') {
                    className += 'absent';
                    label += ' A';
                } else if (attendanceItem.status === 'present') {
                    className += 'present';
                    label += ' P';
                } else if (attendanceItem.status === 'leave-a') {
                    className += 'leave-a';
                    label += ' L';
                }
            }
            return {
                date: day,
                label: dayOfWeek >= 1 && dayOfWeek <= 6 ? label : `${day} R`,
                className: dayOfWeek >= 1 && dayOfWeek <= 6 ? className : 'day weekend',
            };
        });
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.getAttendance();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.getAttendance();
    }
}