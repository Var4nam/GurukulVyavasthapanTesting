import { LightningElement, track, wire } from 'lwc';
import getHolidays from '@salesforce/apex/AdminUIFirstPartController.getHolidays';
import getAttendanceRecord from '@salesforce/apex/AdminUIFirstPartController.getAttendanceRecord';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class EventCalendarComponent extends LightningElement {

    @track currentDate = new Date();
    @track dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    @track days = [];
    @track emptyCells = [];
    @track attendanceData = [];
    @track currentMonth;
    @track holidays = [];
    @track showHolidayDetails = false;
    @track nameOfLeave;
    @track typeOfLeave;
    @track dayOfLeave;
    @track currentYear;
    @track viewAttendance = false;
    @track classValue;
    @track attendance = [];
    @track goForAttendance = false;
    @track index = 1;
    @track recordType;
    @track dateField = '';

    get serialNumber() {
        return this.index++;
    }

    connectedCallback() {
        this.getHolidayRecord();
    }

    handleClassChange(event) {
        this.classValue = event.target.value;
    }

    handleGetRecordsClick() {
        this.goForAttendance = true;
        const now = new Date();
        var fieldName = 'Day_' + now.getDate() + '__c';
        var monthName = month[now.getMonth()] + ' ' + now.getFullYear();
        getAttendanceRecord({ classId: this.classValue, fieldName: fieldName, monthName: monthName, teacherId: '',staffId: '', recordType: 'Student__c' })
            .then((result) => {
                console.log('result :::');
                console.log(result);
                this.index = 1;
                if (result.length > 0) {
                    var arr = [];
                    for (let i = 0; i < result.length; i++) {
                        var item = {
                            'id': result[i].Id,
                            'name': result[i].Student__r.Name,
                            'isPresent': result[i][fieldName],
                            'className': result[i].Class__c
                        }
                        arr.push(item);
                    }
                    this.attendance = arr;
                        console.log('this.attendance ::: ',this.attendance);
                } else {
                    this.attendance = [];
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleToggleClick(event) {
        var check = event.detail.checked;
        var index = event.currentTarget.dataset.index;
        var id = event.currentTarget.dataset.id;
        const now = new Date();
        var fieldName = 'Day_' + now.getDate() + '__c';
        var record;
        if (this.dateField != '') {
            let rec = {
                fields: {
                    Id: this.attendance[index].id,
                    [this.dateField]: check,
                },
            };
            record = rec;
        } else {
            let rec = {
                fields: {
                    Id: id,
                    [fieldName]: check,
                },
            };
            record = rec;
        }
        updateRecord(record)
            .then(() => {
                console.log('updated.....');
            })
            .catch((error) => {
                console.log('not updated.....');
            });
    }

    handleDateChange(event) {
        this.attendance = [];
        var date = event.detail.value;
        var day = date.toString().substr(8)[0] === '0' ? date.toString().substr(9, 1) : date.toString().substr(8);
        var fieldName = 'Day_' + day + '__c';
        this.dateField = fieldName;
        var year = date.substr(0, 4);
        var dateMonth = date.substr(5, 2);
        var monthName = month[(dateMonth[0] === '0' ? dateMonth[1] : dateMonth) - 1] + ' ' + year;
        if (this.classValue == undefined) {
            var msg = 'Please select Class';
            this.showErrorToast(msg);
        } else {
            getAttendanceRecord({ classId: this.classValue, fieldName: fieldName, monthName: monthName, teacherId: '', staffId: '', recordType: 'Student__c'})
                .then((result) => {
                    this.index = 1;
                    if (result.length > 0) {
                        var msg = 'Record fetched successfully.';
                        this.showSuccessToast(msg);
                        var arr = [];
                        for (let i = 0; i < result.length; i++) {
                            var item = {
                                'id': result[i].Id,
                                'name': result[i].Student__r.Name,
                                'isPresent': result[i][fieldName],
                                'className': result[i].Class__c
                            }
                            arr.push(item);
                        }
                        this.attendance = arr;
                        console.log('this.attendance ::: ',this.attendance);
                    } else {
                        this.attendance = [];
                    }
                })
                .catch((error) => {
                    this.error = error;
                });
        }
    }

    handlePreviousClick() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.ganerateCalendar();
    }

    handleNextClick() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.ganerateCalendar();
    }

    getHolidayRecord() {
        getHolidays()
            .then(result => {
                this.holidays = result;
                this.ganerateCalendar();
            })
            .catch(error => {
                console.log('this.createError' + JSON.stringify(error));
            });
    }

    ganerateCalendar() {
        const year = this.currentDate.getFullYear();
        this.currentYear = year;
        const month = this.currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        this.currentMonth = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
        this.emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i);
        this.days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayOfWeek = new Date(year, month, day).getDay();
            let className = 'day';
            var mon;
            let leaveName;
            let leaveType;
            let leaveWeekName;
            if (parseInt(month + 1) < 10) {
                mon = '0' + parseInt(month + 1);
            } else {
                mon = parseInt(month + 1);
            }
            const dates = year + '-' + mon + '-' + day;

            const attendanceItem = this.holidays.find(item => {
                if (item.Date__c === dates) {
                    className = 'day-holiday';
                }
                return item.Date__c === dates;
            });
            if (attendanceItem) {
                leaveName = attendanceItem.Name;
                leaveType = attendanceItem.Type__c;
                leaveWeekName = attendanceItem.Day__c;
            }
            return {
                date: day,
                label: day,
                name: leaveName,
                type: leaveType,
                week: leaveWeekName,
                className: dayOfWeek >= 1 && dayOfWeek <= 6 ? className : 'day-weekend',
            };
        });
    }

    showModal(event) {
        this.showHolidayDetails = true;
        this.dayofLeave = event.currentTarget.dataset.id;
        this.nameOfLeave = event.currentTarget.dataset.name;
        this.typeOfLeave = event.currentTarget.dataset.title;
    }

    closeModal() {
        this.showHolidayDetails = false;
        this.dayOfLeave = '';
        this.nameOfLeave = '';
        this.typeOfLeave = '';
    }

    showErrorToast(msg) {
        const event = new ShowToastEvent({
            title: 'Not Valid',
            variant: 'error',
            message: msg,
        });
        this.dispatchEvent(event);
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