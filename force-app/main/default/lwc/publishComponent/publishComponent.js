import { LightningElement, wire, track } from 'lwc';
import getPublishRecords from '@salesforce/apex/AdminUIFirstPartController.getPublishRecords';
import getStudentRecordsForAttendance from '@salesforce/apex/AdminUIFirstPartController.getStudentRecordsForAttendance';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class PublishComponent extends LightningElement {

    @track refreshedData = [];
    @track publishRecords = [];
    @track index = 1;
    @track showPublishModal = false;
    @track className;
    @track firstTestValue;
    @track secondTestValue;
    @track thirdTestValue;
    @track halfYearlyValue;
    @track finalValue;
    @track publishId;
    @track index;

    get serialNumber() {
        return this.index++;
    }

    @wire(getPublishRecords)
    wiredData(result) {
        this.refreshedData = result;
      if (result.data) {
        this.index = 1;
        console.log('Data', JSON.stringify(result.data));
        this.publishRecords = result.data;
      } else if (result.error) {
        console.error('Error:', result.error);
      }
    }

    handleFirstTestChange(event) {
        this.className = event.currentTarget.dataset.name;
        this.publishId = event.currentTarget.dataset.id;
        this.index = event.currentTarget.dataset.index;
        this.firstTestValue = event.detail.checked;
        this.secondTestValue = this.publishRecords[this.index].Second_Test__c;
        this.thirdTestValue = this.publishRecords[this.index].Third_Test__c;
        this.halfYearlyValue = this.publishRecords[this.index].Half_Yearly__c;
        this.finalValue = this.publishRecords[this.index].Final__c;
        this.showPublishModal = true;
    }

    handleSecondTestChange(event) {
        this.className = event.currentTarget.dataset.name;
        this.publishId = event.currentTarget.dataset.id;
        this.index = event.currentTarget.dataset.index;
        this.firstTestValue = this.publishRecords[this.index].First_Test__c;
        this.secondTestValue = event.detail.checked;
        this.thirdTestValue = this.publishRecords[this.index].Third_Test__c;
        this.halfYearlyValue = this.publishRecords[this.index].Half_Yearly__c;
        this.finalValue = this.publishRecords[this.index].Final__c;
        this.showPublishModal = true;
    }

    handleThirdTestChange(event) {
        this.className = event.currentTarget.dataset.name;
        this.publishId = event.currentTarget.dataset.id;
        this.index = event.currentTarget.dataset.index;
        this.firstTestValue = this.publishRecords[this.index].First_Test__c;
        this.secondTestValue = this.publishRecords[this.index].Second_Test__c;
        this.thirdTestValue = event.detail.checked;
        this.halfYearlyValue = this.publishRecords[this.index].Half_Yearly__c;
        this.finalValue = this.publishRecords[this.index].Final__c;
        this.showPublishModal = true;
    }

    handleHalfYearlyChange(event) {
        this.className = event.currentTarget.dataset.name;
        this.publishId = event.currentTarget.dataset.id;
        this.index = event.currentTarget.dataset.index;
        this.firstTestValue = this.publishRecords[this.index].First_Test__c;
        this.secondTestValue = this.publishRecords[this.index].Second_Test__c;
        this.thirdTestValue = this.publishRecords[this.index].Third_Test__c;
        this.halfYearlyValue = event.detail.checked;
        this.finalValue = this.publishRecords[this.index].Final__c;
        this.showPublishModal = true;
    }

    handleFinalChange(event) {
        this.className = event.currentTarget.dataset.name;
        this.publishId = event.currentTarget.dataset.id;
        this.index = event.currentTarget.dataset.index;
        this.firstTestValue = this.publishRecords[this.index].First_Test__c;
        this.secondTestValue = this.publishRecords[this.index].Second_Test__c;
        this.thirdTestValue = this.publishRecords[this.index].Third_Test__c;
        this.halfYearlyValue = this.publishRecords[this.index].Half_Yearly__c;
        this.finalValue = event.detail.checked;
        this.showPublishModal = true;
    }

    closeModal() {
        this.showPublishModal = false;
    }

    publishClick() {
        const recordInput = {
            fields : {
                Id : this.publishId,
                First_Test__c : this.firstTestValue,
                Second_Test__c : this.secondTestValue,
                Third_Test__c : this.thirdTestValue,
                Half_Yearly__c : this.halfYearlyValue,
                Final__c : this.finalValue
            }
        };
        console.log('recordInput ::: ',JSON.stringify(recordInput));
        updateRecord(recordInput)
            .then((result) => {
                const msg = "Records updated successfully.";
                this.showSuccessToast(msg);
            })
            .catch((error) => {
                const msg = "Not updated.";
                this.showErrorToast(msg);
            });

        getStudentRecordsForAttendance({ classValue: this.className })
            .then((result) => {
                console.log('Result:', JSON.stringify(result));
                const recordInputs = result.map((draft) => {
                    return {
                        fields: {
                            Id: draft.Id,
                            First_Test__c: this.firstTestValue,
                            Second_Test__c: this.secondTestValue,
                            Third_Test__c: this.thirdTestValue,
                            Half_Yearly__c: this.halfYearlyValue,
                            Final__c: this.finalValue
                        }
                    };
                });
                console.log('Record Inputs:', JSON.stringify(recordInputs));
                const updatePromises = recordInputs.map((recordInput) => {
                    return updateRecord(recordInput);
                });
                Promise.all(updatePromises)
                    .then((updateResults) => {
                        console.log('Update Results:', updateResults);
                        this.showPublishModal = false;
                        refreshApex(this.refreshedData);
                        const successMessage = "Records update initiated successfully.";
                        this.showSuccessToast(successMessage);
                    })
            })
            .catch((error) => {
                console.error('Fetch Error:', error);
                const errorMessage = "Failed to fetch student records for publish.";
                this.showErrorToast(errorMessage);
            });
    }

    resetInputValues() {
        this.className = null;
        this.firstTestValue = null;
        this.secondTestValue = null;
        this.thirdTestValue = null;
        this.halfYearlyValue = null;
        this.finalValue = null;
    }

    showErrorToast(msg) {
        const event = new ShowToastEvent({
            title: "Not Valid",
            variant: "error",
            message: msg,
        });
        this.dispatchEvent(event);
    }

    showSuccessToast(msg) {
        const event = new ShowToastEvent({
            title: "Successful",
            variant: "success",
            message: msg,
        });
        this.dispatchEvent(event);
    }
}