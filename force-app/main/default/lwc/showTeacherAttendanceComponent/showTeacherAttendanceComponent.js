import { LightningElement, track, wire } from 'lwc';
import getTeacherRecordsForAttendance from '@salesforce/apex/AdminUIFirstPartController.getTeacherRecordsForAttendance';
import getAttendanceCalendar from '@salesforce/apex/TeacherAttendanceCalendarController.getAttendanceCalendar';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class ShowTeacherAttendanceComponent extends LightningElement {

    @track teachers = [];
    @track index = 1;
    @track showCalendar = false;

    @track currentDate = new Date();
    @track dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    @track days = [];
    @track emptyCells = [];
    @track attendanceData = [];
    @track currentMonth;
    @track teacherId;

    get serialNumber() {
        return this.index++;
    }

    @wire(getTeacherRecordsForAttendance)
    wireTeacherRecords({data, error}) {
        if (data) {
            this.teachers = data;
        }
        else if (error) {
            window.console.log(error);
        }
    }

    handleShowAttendanceClick() {
        this.index = 1;
        this.showCalendar = true;
        this.teacherId = event.currentTarget.dataset.id;
        this.getAttendance();
    }

    handleCancel() {
        this.index = 1;
        this.showCalendar = false;
    }

    getAttendance() {
        var monthName = month[this.currentDate.getMonth()] + ' ' + this.currentDate.getFullYear();
        getAttendanceCalendar({ teacherId: this.teacherId, selectedDate : this.currentDate, monthName: monthName})
        .then(result => {
            this.index = 1;
            console.log('result ::: ',JSON.stringify(result));
            this.attendanceData = result;
            this.ganerateCalendar();
        })
        .catch(error => {
            console.log('this.createError' + error);
        });
    }

    ganerateCalendar() {
        this.index = 1;
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
                } else if (attendanceItem.status === 'halfday') {
                    className += 'halfday';
                    label += ' H';
                } else if (attendanceItem.status === 'absent-s') {
                    className += 'absent-s';
                    label += ' A';
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
        this.index = 1;
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.getAttendance();
    }

    nextMonth() {
        this.index = 1;
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.getAttendance();
    }
}