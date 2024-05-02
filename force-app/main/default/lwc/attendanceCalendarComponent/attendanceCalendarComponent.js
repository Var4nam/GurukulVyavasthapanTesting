import { LightningElement, track, api } from 'lwc';
import getAttendanceCalendar from '@salesforce/apex/TeacherAttendanceCalendarController.getAttendanceCalendar';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class AttendanceCalendarComponent extends LightningElement {

    @track currentDate = new Date();
    @track dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    @track days = [];
    @track emptyCells = [];
    @track attendanceData = [];
    @track currentMonth;
    @api portalName;

    connectedCallback() {
        this.getAttendance();
    }

    getAttendance() {
        var teacherId = '';
        var studentId = '';
        var staffId = '';
        console.log('teacherId ::: ',teacherId);
        console.log('studentId ::: ',studentId);
        console.log('staffId ::: ',staffId);
        if(this.portalName == 'teacher') {
            teacherId = localStorage.getItem('idofTeacher');
            studentId = '';
            staffId = '';
        } else if(this.portalName === 'student') {
            studentId = localStorage.getItem('idofStudent');
            teacherId = '';
            staffId = '';
        } else if(this.portalName === 'staff') {
            staffId = localStorage.getItem('idofStaff');
            teacherId = '';
            studentId = '';
        }
        var monthName = month[this.currentDate.getMonth()] + ' ' + this.currentDate.getFullYear();
        getAttendanceCalendar({ teacherId: teacherId, studentId: studentId, staffId: staffId, selectedDate : this.currentDate, monthName: monthName})
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
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.getAttendance();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.getAttendance();
    }
}