import { LightningElement, track } from 'lwc';
import getHolidays from '@salesforce/apex/AdminUIFirstPartController.getHolidays';

export default class Calendar extends LightningElement {
    
    @track currentYear;
    @track currentMonth;
    @track monthName;
    @track holidays = [];
    @track tempholidays = [];
    @track calendarDays = [];
    @track showHolidayDetails = false;
    @track dayOfLeave;
    @track typeOfLeave;
    @track nameOfLeave;

    connectedCallback() {
        const currentDate = new Date();
        this.currentYear = currentDate.getFullYear();
        this.currentMonth = currentDate.getMonth();
        this.updateMonthName();
        this.getHolidayRecord();
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

    updateMonthName() {
        const monthsName = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.monthName = monthsName[this.currentMonth];
    }

    ganerateCalendar() {
        const monthDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
        let calendar = [];
        let currentWeek = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            currentWeek.push('');
        }
        for (let day = 1; day <= monthDays; day++) {  
            let className = 'day';  
            let dayName = ''; 
            let isSunday = (firstDayOfMonth + day - 1) % 7 === 0;

    if (isSunday) {
        className += 'sunday'; // Add the Sunday class
    }
            var mon;
            let leaveName;
            let leaveType;
            let leaveWeekName;
            let temp = true;
            if(parseInt(this.currentMonth+1) < 10) {
                mon = '0'+parseInt(this.currentMonth+1);
            } else {
                mon = parseInt(this.currentMonth+1);
            }
            const dates = this.currentYear+'-'+mon+'-'+day;
            if (currentWeek.length === 7 || currentWeek.length === 0) {
                className = 'day-weekend';
                temp = false;
            }
            const attendanceItem = this.holidays.find(item => {
                if(item.Date__c === dates) {
                    if(temp) {
                        dayName = 'H';
                        className = 'day-holiday';                        
                    } 
                    else {
                        dayName = 'H';
                    }
                } 
                return item.Date__c === dates;
            });
            if (attendanceItem) {
                leaveName = attendanceItem.Name; 
                leaveType = attendanceItem.Type__c;
                leaveWeekName = attendanceItem.Day__c;
                currentWeek.push({ day: day, class: className, name: dayName, lName: leaveName, type: leaveType, week: leaveWeekName });
            } else {
                currentWeek.push({ day: day, class: className});
            }
            if (currentWeek.length === 7) {
                calendar.push(currentWeek);
                currentWeek = [];
            }
        }

        while (currentWeek.length < 7) {
            currentWeek.push('');
        }
        calendar.push(currentWeek);
        this.calendarDays = calendar;
    }

    handlePrevious() {
        this.currentMonth -= 1;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear -= 1;
        }
        this.updateMonthName();
        this.ganerateCalendar();
    }

    handleNext() {
        this.currentMonth += 1;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear += 1;
        }
        this.updateMonthName();
        this.ganerateCalendar();
    }

    showModal(event) {
        console.log('clicked');
        this.dayOfLeave = event.currentTarget.dataset.id;
        console.log('this.dayOfLeave ::: ',this.dayOfLeave);
        this.nameOfLeave = event.currentTarget.dataset.name;
        console.log('this.nameOfLeave ::: ',this.nameOfLeave);
        // this.typeOfLeave = event.currentTarget.dataset.title;
        // console.log('this.typeOfLeave ::: ',this.typeOfLeave);
        var value = event.currentTarget.dataset.value;
        console.log('value ::: ',value);
        let dayName = '';
        if(value == 'day-holiday') {
            this.showHolidayDetails = true;
        } else if(value == 'day-weekend' && this.nameOfLeave != null) {
            this.showHolidayDetails = true;
        }
        else{
            this.showHolidayDetails = false;
        }

    }
    

    // showModal(event) {
    //     this.dayOfLeave = event.currentTarget.dataset.id;
    //     this.nameOfLeave = event.currentTarget.dataset.name;
    //     this.showHolidayDetails = true;
    // }

  

    closeModal() {
        this.showHolidayDetails = false;
        this.dayOfLeave = '';
        this.nameOfLeave = '';
        this.typeOfLeave = '';
    }

    //  handleMouseEnter(event) {
    //     // When mouse hovers over an element, show the modal
    //     this.showModal(event);
    // }

    // handleMouseLeave() {
    //     // When mouse leaves an element, close the modal
    //     this.closeModal();
    // }
}