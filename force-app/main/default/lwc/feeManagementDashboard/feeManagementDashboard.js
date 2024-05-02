import { LightningElement, track, wire } from "lwc";
import showFeeManageRecord from "@salesforce/apex/AdminUIFirstPartController.showFeeManageRecord";
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class FeeManagementDashboard extends LightningElement {

  @track classValue;
  @track serialNumber = 1;
  @track refreshRecords = [];
  @track feeList = [];
  @track showFeeList = false;
  @track waitForASection = false;
  @track showCreateModal = false;
  @track showFeeManagementTableEmpty = false;
  @track feeId;

  handleClassChange(event) {
    this.classValue = event.target.value;
  }

  handleGoClick() {
    this.waitForASection = true;
    this.showFeeList = false;
    this.showCreateModal = false;
    this.showFeeManagementTableEmpty = false;
    showFeeManageRecord({ classId: this.classValue })
      .then((result) => {
        this.index = 1;
        if (result.length > 0) {
          this.waitForASection = false;
          this.showFeeList = true;
          this.feeList = result;
        } else {
          var msg = 'Records not found!';
          this.showErrorToast(msg);
          this.feeList = [];
          this.waitForASection = false;
          this.showFeeList = false;
          this.showFeeManagementTableEmpty = true;
        }
      })
      .catch((error) => {
        this.error = error;
      });
  }

  handleSubmitFeeClick(event) {
    this.feeId = event.currentTarget.dataset.id;
    console.log('this.feeId :::: ', this.feeId);
    this.showFeeList = false;
    this.showCreateModal = true;
  }

  handleCancelClick() {
    this.showCreateModal = false;
    this.showFeeList = true
  }

  handleSaveClick() {
    this.waitForASection = true;
  }

  handleSuccess() {
    this.showCreateModal = false;
    this.showFeeList = true;
    this.waitForASection = false;
    var msg = 'Record created successfully.';
    this.showSuccessToast(msg);
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