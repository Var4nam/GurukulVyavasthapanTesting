import { LightningElement, track, wire } from "lwc";
import showEmployeeRecord from "@salesforce/apex/AdminUIFirstPartController.showEmployeeRecord";
import getFieldAPINames from "@salesforce/apex/AdminUIFirstPartController.getFieldAPINames";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from "lightning/uiRecordApi";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import EMPLOYMENT_OBJECT from "@salesforce/schema/Staff__c";
import EMPLOYMENT_TYPE_FIELD from "@salesforce/schema/Staff__c.Staff_Type__c";

const columns = [
  { label: "Name", fieldName: "Name", editable: true, sortable: true },
  {
    label: "Staff Type",
    fieldName: "Staff_Type__c",
    editable: true,
    sortable: true,
    type: "picklistColumn",
    typeAttributes: {
      placeholder: "Select picklist",
      options: { fieldName: "phasepickListOptions" },
      value: { fieldName: "Staff_Type__c" },
      context: { fieldName: "Id" },
    },
  },
];

export default class AnnouncementUI extends LightningElement {
  @track currentPage = 1;
  @track totalRecords;
  @track recordSize = 5;
  @track totalPage = 0;
  @track employeeColumns = columns;
  @track showEmployeeTable = false;
  @track sortBy;
  @track employees = [];
  @track showButtons = true;
  @track employeeRecordId;
  @track saveDraftValues = [];
  @track sortDirection;
  @track showCreateModal = false;
  @track showEditModal = false;
  @track showEmployeeTableEmpty = false;
  @track tempRecord = [];
  @track updatedRecords = [];
  @track parentId;
  @track selectedLabel = [];
  @track showConfigModal = false;
  @track selectedField = [];
  @track visibleRecords = [];
  @track phasepickListOptions = [];
  @track employmentPicklist = [];
  @track waitForASection = true;
  options = [];
  values = [];
  objectName = "Staff__c";

  @wire(getObjectInfo, { objectApiName: EMPLOYMENT_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: EMPLOYMENT_TYPE_FIELD,
  })
  wirePickList({ error, data }) {
    if (data) {
      this.employmentPicklist = data.values;
      this.updateRecords();
    } else if (error) {
      console.error("Error retrieving picklist values:", error);
    }
  }

  @wire(getFieldAPINames, { objName: "$objectName" })
  wiredFields({ error, data }) {
    if (data) {
      this.fieldData = data;
      this.options = this.fieldData.map((field) => ({
        label: field.fieldLabel,
        value: field.fieldApiName,
      }));
    } else if (error) {
      console.error(error);
    }
  }

  @wire(showEmployeeRecord)
  wireParent(result) {
    this.updatedRecords = result;
    if (result.data) {
      this.waitForASection = false;
      this.totalRecords = JSON.parse(JSON.stringify(result.data));
      this.recordSize = Number(this.recordSize);
      this.totalPage = Math.ceil(result.data.length / this.recordSize);
      this.updateRecords();
      if (result.data !== "") {
        this.employees = result.data;
        this.showEmployeeTable = true;
      } else {
        this.showEmployeeTable = false;
        this.showEmployeeTableEmpty = true;
      }
    } else if (result.error) {
      console.error(result.error);
    }
  }

  get selected() {
    return this.selectedField.length ? this.selectedField : "none";
  }

  handleChange(event) {
    this.selectedField = event.detail.value;
    this.selectedLabel = this.selectedField.map(
      (option) => this.options.find((o) => o.value === option).label
    );
  }

  handleConfigModalCancel() {
    this.showConfigModal = false;
    this.values = [];
  }

  handleConfigClick() {
    this.showConfigModal = true;
    this.values = this.employeeColumns.map((column) => column.fieldName);
  }

  handleConfigModalSave() {
    if (this.selectedField.length > 0) {
      this.employeeColumns = [];
      var arr = [];
      for (let i = 0; i < this.selectedField.length; i++) {
        var item;
        if (this.selectedField[i] === "Staff_Type__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "picklistColumn",
            typeAttributes: {
              placeholder: "Select picklist",
              options: { fieldName: "phasepickListOptions" },
              value: { fieldName: "Staff_Type__c" },
              context: { fieldName: "Id" },
            },
            editable: true,
            sortable: true,
          };
        } else {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            editable: "true",
            sortable: "true",
          };
        }
        arr.push(item);
        this.employeeColumns = arr;
        showEmployeeRecord({
          field: this.sortBy,
          sortOrder: this.sortDirection,
          fields: this.selectedField,
        })
          .then((result) => {
            this.updateRecords();
            this.showConfigModal = false;
            this.visibleRecords = result;
            this.values = [];
          })
          .catch((error) => {
            this.error = error;
          });
      }
    } else {
      this.showConfigModal = false;
    }
  }

  async handleSave(event) {
    this.waitForASection = true;
    this.saveDraftValues = event.detail.draftValues;
    const recordInputs = this.saveDraftValues.slice().map((draft) => {
      const fields = Object.assign({}, draft);
      return { fields };
    });
    const promises = recordInputs.map((recordInput) =>
      updateRecord(recordInput)
    );
    Promise.all(promises)
      .then((res) => {
        var msg = "record updated successfully.";
        this.showSuccessToast(msg);
        return this.refresh();
      })
      .catch((error) => {
        var msg = "Error creating record.";
        this.showErrorToast(msg);
      })
      .finally(() => {
        this.saveDraftValues = [];
      });
  }

  async refresh() {
    await refreshApex(this.updatedRecords);
  }

  doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    showEmployeeRecord({
      field: this.sortBy,
      sortOrder: this.sortDirection,
      fields: this.selectedField,
    })
      .then((result) => {
        this.visibleRecords = result;
      })
      .catch((error) => {
        this.error = error;
      });
  }

  handleSearch(event) {
    this.visibleRecords = this.tempRecord;
    var availableAccounts = [...this.visibleRecords];
    var searchKey = event.target.value.toLowerCase();
    if (searchKey) {
      if (availableAccounts) {
        let recs = [];
        for (let rec of availableAccounts) {
          let valuesArray = Object.values(rec);
          for (let val of valuesArray) {
            let strVal = String(val);
            if (strVal) {
              if (strVal.toLowerCase().includes(searchKey)) {
                recs.push(rec);
                break;
              }
            }
          }
        }
        availableAccounts = recs;
      }
    } else {
      availableAccounts = this.tempRecord;
    }
    this.visibleRecords = availableAccounts;
  }

  handleSuccess() {
    if (this.employees != null) {
      this.showEmployeeTable = true;
    } else {
      this.showEmployeeTableEmpty = true;
    }
    this.waitForASection = true;
    this.showCreateModal = false;
    this.showButtons = true;
    this.showSuccessToast("record created successfully.");
    refreshApex(this.updatedRecords);
  }

  handleDeleteClick() {
    var selectedRows = this.template
      .querySelector("c-custom-data-table")
      .getSelectedRows();
    if (selectedRows.length < 1) {
      this.showErrorToast("You have to select at least one record.");
    } else {
      this.waitForASection = true;
      for (const element of selectedRows) {
        deleteRecord(element.Id)
          .then(() => {
            this.showSuccessToast("Record deleted successfully.");
            refreshApex(this.updatedRecords);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }

  handleCancelClick() {
    if (this.employees != null) {
      this.showEmployeeTable = true;
    } else {
      this.showEmployeeTableEmpty = true;
    }
    this.showCreateModal = false;
    this.showButtons = true;
  }

  handleCreateClick() {
    if (this.employees != null) {
      this.showEmployeeTable = false;
    } else {
      this.showEmployeeTableEmpty = false;
    }
    this.showCreateModal = true;
    this.showButtons = false;
  }

  previousHandler() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.updateRecords();
    }
  }

  nextHandler() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.updateRecords();
    }
  }

  updateRecords() {
    const start = (this.currentPage - 1) * this.recordSize;
    const end = start + this.recordSize;
    if (this.totalRecords != null) {
      var arr = this.totalRecords.slice(start, end);
      var modifiedData = arr.map((item) => ({
        ...item,
        phasepickListOptions: this.employmentPicklist,
      }));
      this.visibleRecords = modifiedData;
      this.tempRecord = this.visibleRecords;
      this.dispatchEvent(
        new CustomEvent("update", {
          detail: {
            records: this.visibleRecords,
          },
        })
      );
    }
  }

  showErrorToast(msg) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Not Valid",
        variant: "error",
        message: msg,
      })
    );
  }

  showSuccessToast(msg) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Successful",
        variant: "success",
        message: msg,
      })
    );
  }
}