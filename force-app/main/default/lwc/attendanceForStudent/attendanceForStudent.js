import { LightningElement, track, wire } from 'lwc';
import getAssignClassRecord from '@salesforce/apex/AdminUIFirstPartController.getAssignClassRecord';
import getAttendanceRecord from '@salesforce/apex/AdminUIFirstPartController.getAttendanceRecord';
import { updateRecord } from 'lightning/uiRecordApi';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class AttendanceForStudent extends LightningElement {

    @track assignedClasses = [];
    @track attendance = [];
    @track showStudentList = false;
    @track showAssignClassList = false;
    @track index = 1;
    @track dateField = '';
    @track classValue;
    @track teacherId;

    get serialNumber() {
        return this.index++;
    }

    connectedCallback() {
        this.teacherId = localStorage.getItem('idofTeacher');
        console.log('teacherId ::: ',this.teacherId);
    }

    @wire(getAssignClassRecord, { teacherId: '$teacherId' })
    wiredAssignClasses({ data, error }) {
        if (data) {
            this.showAssignClassList = true;
            this.assignedClasses = data;
        }
        else if (error) {
            window.console.log(error);
        }
    }

    handleBackClick() {
        this.showStudentList = false;
        this.showAssignClassList = true;
        this.attendance = [];
        this.index = 1;
    }

    handleAttendanceClick(event) {
        this.showStudentList = false;
        this.attendance = [];
        this.classValue = event.currentTarget.dataset.id;
        const now = new Date();
        var fieldName = 'Day_' + now.getDate() + '__c';
        var monthName = month[now.getMonth()] + ' ' + now.getFullYear();
        getAttendanceRecord({ classId: this.classValue, fieldName: fieldName, monthName: monthName, teacherId: '', staffId: '', recordType: 'Student__c'  })
            .then((result) => {
                this.index = 1;
                if (result.length > 0) {
                    this.showAssignClassList = false;
                    this.showStudentList = true;
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
        console.log('record ::: ',JSON.stringify(record));
        updateRecord(record)
            .then((data) => {
                console.log('updated.....',data);
            })
            .catch((error) => {
                console.log('not updated.....', error);
            });
    }

    handleDateChange(event) {
        this.showStudentList = false;
        this.attendance = [];
        var date = event.detail.value;
        var day = date.toString().substr(8)[0] === '0' ? date.toString().substr(9, 1) : date.toString().substr(8);
        var fieldName = 'Day_' + day + '__c';
        console.log(fieldName);
        this.dateField = fieldName;
        var year = date.substr(0, 4);
        var dateMonth = date.substr(5, 2);
        var monthName = month[(dateMonth[0] === '0' ? dateMonth[1] : dateMonth) - 1] + ' ' + year;
        console.log(monthName);
        console.log(this.classValue);
        getAttendanceRecord({ classId: this.classValue, fieldName: fieldName, monthName: monthName, teacherId: '', staffId: '', recordType: 'Student__c' })
        .then((result) => {
            this.index = 1;
            if (result.length > 0) {
                this.showAssignClassList = false;
                this.showStudentList = true;
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