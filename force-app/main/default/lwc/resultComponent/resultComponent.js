import { LightningElement, track } from 'lwc';
import getExamRecords from '@salesforce/apex/AdminUIFirstPartController.getExamRecords';

export default class ResultComponent extends LightningElement {
    @track classValue;
    @track examsList = [];
    @track goForResult = false;
    @track index = 1;
    @track showResult = false;
    @track publishes = [];
    @track studentId;

    get serialNumber() {
        return this.index++;
    }

    handleClassChange(event) {
        this.classValue = event.target.value;
    }

    handleGetRecordsClick() {
        console.log('clicked');
        console.log('this.classValue ::: ',this.classValue);
        getExamRecords({ classId: this.classValue})
            .then((result) => {
                this.index = 1;
                if (result.length > 0) {
                    this.goForResult = true;
                    console.log('result ::: ',JSON.stringify(result));
                    this.examsList = result;
                } else {
                    this.examsList = [];
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleShowResultClick() {
        this.showResult = true;

    }

    handleCancel() {
        this.showResult = false;
    }
}