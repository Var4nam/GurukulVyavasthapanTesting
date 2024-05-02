import { LightningElement, track, wire } from 'lwc';
import getHolidays from '@salesforce/apex/AdminUIFirstPartController.getHolidays';

export default class EventCalendarComponent extends LightningElement {

    // @track selectedYear = new Date().getFullYear();
    // @track monthNames = [];
    // holidays = [];
    // tempholidays = [];

    // get years() {
    //     const currentYear = this.selectedYear;
    //     return [currentYear - 1, currentYear, currentYear + 1];
    // }

    // handleYearChange(event) {
    //     this.selectedYear = parseInt(event.target.value, 10);
    //     this.loadHolidays();
    //     console.log('data  this.selectedYear ::: ', this.selectedYear);
    // }

    // connectedCallback() {
    //     this.loadHolidays();
    // }

    // loadHolidays() {
    //     this.monthNames = [];
    //     for (let month = 0; month < 12; month++) {
    //         const date = new Date(this.selectedYear, month, 1);
    //         const monthName = date.toLocaleString('default', { month: 'short' });
    //         const formattedMonth = `${monthName} ${this.selectedYear}`;
    //         this.monthNames.push({ monthName: formattedMonth });
    //     }
    // }

    // get monthsData() {
    //     return this.months.map(month => ({
    //         label: month,
    //         holidays: this.holidaysData[month.split(' ')[0]] || []
    //     }));
    // }

    // @wire(getHolidayRecords, { selectedYear: '$selectedYear' })
    // getHolidayRecords({ error, data }) {
    //     if (data) {
    //         this.holidays = data;
    //         this.monthNames.forEach(months => {
    //             const monthsName = months.monthName.split(' ');
    //             this.tempholidays = [];
    //             this.holidays.forEach(currentItem => {
    //                 const date = new Date(currentItem.Date__c);
    //                 const monthYear = date.toLocaleString('default', { month: 'short' });
    //                 if (monthYear == monthsName[0]) {
    //                     this.tempholidays.push({ day: currentItem.Day__c, des: currentItem.Name, date: currentItem.Date__c });
    //                 }
    //             });
    //             if (this.tempholidays != '') {
    //                 months.holidays = this.tempholidays;
    //                 months.isTrue = false;
    //             }
    //             else {
    //                 months.isTrue = true;
    //             }
    //         });

    //     } else if (error) {
    //         this.error = error;
    //         console.log('error>>> ', this.error);
    //     }
    // }






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
    @track waitForASection = true;

    connectedCallback() {
        this.getHolidayRecord();
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
            this.waitForASection = false;
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
            console.log('dayOfWeek ::::: -----> ',dayOfWeek);
            let className = 'day';
            var mon;
            let leaveName;
            let leaveType;
            let leaveWeekName;
            if(parseInt(month+1) < 10) {
                mon = '0'+parseInt(month+1);
            } else {
                mon = parseInt(month+1);
            }
            const dates = year+'-'+mon+'-'+day;

            const attendanceItem = this.holidays.find(item => {
                if(item.Date__c === dates) {
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
        this.dayofLeave = event.currentTarget.dataset.id;
        this.nameOfLeave = event.currentTarget.dataset.name;
        this.typeOfLeave = event.currentTarget.dataset.title;
        var value = event.currentTarget.dataset.value;
        if(value == 'day-holiday') {
            this.showHolidayDetails = true;
        } else {
            this.showHolidayDetails = false;
        }
    }

    closeModal() {
        this.showHolidayDetails = false;
        this.dayOfLeave = '';
        this.nameOfLeave = '';
        this.typeOfLeave = '';
    }
}