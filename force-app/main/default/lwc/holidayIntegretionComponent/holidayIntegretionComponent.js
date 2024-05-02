import { LightningElement, track, wire } from 'lwc';
import getHolidayRecord from '@salesforce/apex/HolidayIntegretionController.getHolidayRecord';
import createHolidaysRecord from '@salesforce/apex/HolidayIntegretionController.createHolidaysRecord';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import HOLIDAY_OBJECT from '@salesforce/schema/Holiday__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columnsList = [
    { label: 'Name', fieldName: 'name'},
    { label: 'Type', fieldName: 'type'},
    { label: 'Year', fieldName: 'year'},
    { label: 'Day', fieldName: 'day'},
    { label: 'Date', fieldName: 'date', type: 'date' }
];

export default class HolidayIntegretionComponent extends LightningElement {

    @track columnsList = columnsList;
    @track years;
    @track countryValue = 'India';
    @track yearValue = '';
    @track holidays = [];
    @track showDatatable = false;
    @track showSaveButton = false;
    @track showEmptyMsg = false;
    
    //geting account object information
    @wire(getObjectInfo, { objectApiName: HOLIDAY_OBJECT })
    holidayObjectInfo;

    //geting years picklist values from holiday
    @wire(getPicklistValues, { recordTypeId: '$holidayObjectInfo.data.defaultRecordTypeId', fieldApiName: 'Holiday__c.Year__c' })
    years({data, error}){
        if(data){
            this.years = (data.values);
        }else if(error){
            console.log('>>> data.... '+JSON.stringify(error));
        }
    }

    handleYearChange(event) {
        this.yearValue = event.target.value;
    }

    handleGetHolidayClick(event) {
        if(this.countryValue != null && this.yearValue != null) {
            getHolidayRecord({country: this.countryValue, year: this.yearValue })
            .then(result => {
                console.log(JSON.stringify(result));
                if(result == '') {
                    this.showEmptyMsg = true;
                    this.showSaveButton = false;
                    this.showDatatable = false;
                } else {
                    this.holidays = result;
                    this.showEmptyMsg = false;
                    this.showDatatable = true;
                    this.showSaveButton = true;
                }
            })
            .catch(error => {
                console.log('this.createError' + JSON.stringify(error));
            });
        }
    }

    handleSaveClick() {
        console.log('this.holidays ::: '+JSON.stringify(this.holidays));
        if(this.holidays != null) {
            var arr = [];
            for(let i=0;i<this.holidays.length;i++) {
                let item = {
                    'Name' : this.holidays[i].name,
                    'Type__c' : this.holidays[i].type,
                    'Date__c' : this.holidays[i].date,
                    'Day__c' : this.holidays[i].day,
                    'Year__c' : this.holidays[i].year.toString(),
                }
                arr.push(item);
            }
            createHolidaysRecord({holidays: arr})
            .then(result => {
                console.log('result :::: '+JSON.stringify(result));
                if(result == 'Success') {
                    this.showDatatable = false;
                    this.showEmptyMsg = false;
                    this.yearValue = null;
                    this.showSaveSuccessToast();
                } else {
                    this.showSaveErrorToast();
                }
            })
            .catch(error => {
                console.log('this.createError' + JSON.stringify(error));
            });
        }
    }

    showSaveSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Success',
            variant: 'success',
            message:
                'Records saved successfully.',
        });
        this.dispatchEvent(event);
    }

    showSaveErrorToast() {
        const event = new ShowToastEvent({
            title: 'Error',
            variant: 'error',
            message:
                'Records already exist.',
        });
        this.dispatchEvent(event);
    }
}