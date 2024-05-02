import { LightningElement, track } from 'lwc';
import createTimeTableRecord from '@salesforce/apex/AdminUIFirstPartController.createTimeTableRecord';
import getTeacherRecord from '@salesforce/apex/AdminUIFirstPartController.getTeacherRecord';
import getSubjectRecord from '@salesforce/apex/AdminUIFirstPartController.getSubjectRecord';

export default class TimeTable extends LightningElement {
    @track classValue;
    @track timeTableData = [];
    @track showTimeTable = false;
    @track sortedTimeList = [];
    @track dayList;
    @track timeList;
    @track isShowModal = false;
    @track recordId;
    @track teacherValue = '';
    @track subjectValue = '';
    @track subjectName = '';
    @track teacherSpecialization;

    getTeacherValue(event) {
        this.teacherValue = event.target.value;
        getTeacherRecord({ teacherId: this.teacherValue })
            .then((result) => {
                this.teacherSpecialization = result[0].Specialization__c;
                console.log('this.teacherSpecialization ::: ',this.teacherSpecialization);
            })
            .catch((error) => {
                this.error = error;
            });
    }

    getSubjectValue(event) {
        this.subjectValue = event.target.value;
        getSubjectRecord({ subjectId: this.subjectValue })
            .then((result) => {
                this.subjectName = result[0].Name;
                console.log('this.subjectName ::: ',this.subjectName);
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleSaveClick() {
        const regex = /^([\w\s]+?)-/;
        var match = this.subjectName.match(regex);
        var sub = match[1].trim();
        console.log('sub ::: ',sub);
        if(this.teacherValue != ''  && this.teacherSpecialization != sub) {
            window.alert('That Teacher is not specialized in that subject');
        }
    }

    handleClassChange(event) {
        this.classValue = event.target.value;
        console.log(this.classValue);
    }

    handleGetRecordsClick() {
        this.timeTableData = [];
        createTimeTableRecord({ classId: this.classValue })
            .then((result) => {
                this.timeList = new Set();
                var day = result[0].Day__c;
                var tempDayList = [];
                var listSize = result.length;
                var counter = 0;
                result.forEach(currentItem => {
                    if (currentItem.Day__c == day) {
                        const milliseconds = parseInt(currentItem.Period_Time__c, 10);
                        const time = new Date(milliseconds);
                        const hours = time.getUTCHours();
                        const minutes = time.getUTCMinutes();
                        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
                        this.timeList.add(formattedTime);
                        tempDayList.push(currentItem);
                        counter++;
                        if (listSize == counter) {
                            if (tempDayList.length == 8) {
                                const middleIndex = Math.floor(tempDayList.length / 2);
                                tempDayList.splice(middleIndex, 0, { blank: true });
                            }
                            this.timeTableData.push({ day1: day, day: tempDayList });
                        }

                    }
                    else {
                        counter++;
                        if (tempDayList.length == 8) {
                            const middleIndex = Math.floor(tempDayList.length / 2);
                            tempDayList.splice(middleIndex, 0, { blank: true });
                        }
                        this.timeTableData.push({ day1: day, day: tempDayList });
                        tempDayList = [];
                        tempDayList.push(currentItem);
                        day = currentItem.Day__c;
                    }
                });
                if (this.timeTableData.length > 0) {
                    this.sortedTimeList = Array.from(this.timeList).sort();
                    const middleIndex = Math.floor(this.sortedTimeList.length / 2);
                    this.sortedTimeList.splice(middleIndex, 0, 'Break');
                    this.showTimeTable = true;
                }
                else {
                    this.showTimeTable = false;
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    handleTeacherDeatils(event) {
        this.recordId = event.currentTarget.dataset.id;
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }

    handleTimetableRecord(event) {
        console.log('event.detail ::: ',event.detail);
       const teacher = event.detail.fields.Teacher__c.value;
       const subject = event.detail.fields.Subject__c.value;
       console.log('teacher :::: ',teacher);
       console.log('subject :::: ',subject);
       if(subject == null && teacher != null) {
            window.alert('Subject is not selected');
        }
        if(teacher == null && subject != null) {
            window.alert('Teacher is not selected');
        }
        if (event.detail != '') {
            this.isShowModal = false;
            this.handleGetRecordsClick();
        }
    }
}