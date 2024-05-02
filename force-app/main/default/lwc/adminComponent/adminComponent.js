import { LightningElement, track, wire, api } from "lwc";
import getAdminRecords from "@salesforce/apex/AdminUIFirstPartController.getAdminRecords";
import getFieldAPINames from "@salesforce/apex/AdminUIFirstPartController.getFieldAPINames";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from "lightning/uiRecordApi";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import ADMIN_OBJECT from "@salesforce/schema/Admin__c";
import PROFILE_FIELD from "@salesforce/schema/Admin__c.Profile__c";
import GENDER_FIELD from "@salesforce/schema/Admin__c.Gender__c";

export default class AdminComponent extends LightningElement {
  @track currentPage = 1;
  @track totalRecords;
  @track recordSize = 10;
  @track totalPage = 0;
  @track adminColumns = [
    {
      label: "First Name",
      fieldName: "First_Name__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Last Name",
      fieldName: "Last_Name__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "User Name",
      fieldName: "User_Name__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Password",
      fieldName: "Password__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Profile",
      fieldName: "Profle__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Gender",
      fieldName: "Gender__c",
      editable: "true",
      sortable: "true",
    },
  ];
  @track updatedRecords = [];
  @track adminRecordId;
  @track admins;
  @track showCreateModal = false;
  @track showbuttons = true;
  @track showAdminTableEmpty = false;
  @track showAdminTable = false;
  @track saveDraftValues = [];
  @track sortBy;
  @track sortDirection;
  @track tstaffRecords = [];
  @track showConfigModal = false;
  @track visibleRecords = [];
  @track selectedField = [];
  @track selectedLabel = [];
  @track data = true;
  options = [];
  values = [];
  objectName = "Admin__c";
  @track phasepickListGenderOptions = [];
  @track genderPicklist = [];
  @track phasepickListProfileOptions = [];
  @track profilePicklist = [];

  //Varibale for spinner
  @track waitForASection = true;

  renderedCallback() {
    let styles = document.createElement("style");
    styles.innerText =
      ".custom-datatable-style tbody tr:nth-child(even) { background-color: #60D2FF; height: 50px;} .custom-datatable-style tbody tr:nth-child(odd) { background-color: #a4e3fb; height: 50px;}";
    let customDatatable = this.template.querySelector(
      ".custom-datatable-style"
    );
    if (customDatatable) {
      customDatatable.appendChild(styles);
    } else {
      console.error("Element with class 'custom-datatable-style' not found.");
    }
  }

  @wire(getObjectInfo, { objectApiName: ADMIN_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: GENDER_FIELD,
  })
  wireGenderPickList({ error, data }) {
    if (data) {
      this.genderPicklist = data.values;
      this.updateRecords();
    } else if (error) {
      console.error("Error retrieving picklist values:", error);
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: PROFILE_FIELD,
  })
  wireProfilePickList({ error, data }) {
    if (data) {
      this.profilePicklist = data.values;
      this.updateRecords();
    } else if (error) {
      console.error("Error retrieving picklist values:", error);
    }
  }

  @wire(getFieldAPINames, { objName: "$objectName" })
  wiredFields({ error, data }) {
    if (data) {
      this.options = data.map((field) => ({
        label: field.fieldLabel,
        value: field.fieldApiName,
      }));
    } else if (error) {
      console.error(error);
    }
  }

  @wire(getAdminRecords)
  wiredAdminRecords(result) {
    this.updatedRecords = result;
    if (result.data) {
      this.waitForASection = false;
      this.totalRecords = result.data;
      this.recordSize = Number(this.recordSize);
      this.totalPage = Math.ceil(result.data.length / this.recordSize);
      this.updateRecords();
      if (result.data != "") {
        this.admins = result.data;
        this.showAdminTable = true;
      } else {
        this.showAdminTableEmpty = true;
        this.showAdminTable = false;
      }
    } else if (result.error) {
      console.log("Error:::::", result.error);
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
    this.values = this.adminColumns.map((column) => column.fieldName);
  }

  handleConfigModalSave() {
    if (this.selectedField.length > 0) {
      this.adminColumns = [];
      var arr = [];
      for (let i = 0; i < this.selectedField.length; i++) {
        var item;
        if (this.selectedField[i] === "Gender__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "picklistColumn",
            typeAttributes: {
              placeholder: "Select picklist",
              options: { fieldName: "phasepickListGenderOptions" },
              value: { fieldName: "Gender__c" },
              context: { fieldName: "Id" },
            },
            editable: true,
            sortable: true,
          };
        } else if (this.selectedField[i] === "Profile__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "picklistColumn",
            typeAttributes: {
              placeholder: "Select picklist",
              options: { fieldName: "phasepickListProfileOptions" },
              value: { fieldName: "Profile__c" },
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
        this.adminColumns = arr;
        getAdminRecords({
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
    getAdminRecords({
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
    this.visibleRecords = this.tstaffRecords;
    var availableAdmins = [...this.visibleRecords];
    var searchKey = event.target.value.toLowerCase();
    if (searchKey) {
      if (availableAdmins) {
        let recs = [];
        for (let rec of availableAdmins) {
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
        availableAdmins = recs;
      }
    } else {
      availableAdmins = this.tstaffRecords;
    }
    this.visibleRecords = availableAdmins;
  }

  handleSaveClick() {
    if (this.admins != null) {
      this.showAdminTable = true;
    } else {
      this.showAdminTableEmpty = true;
    }
    this.waitForASection = true;
    this.showCreateModal = false;
    this.showbuttons = true;
    var msg = "Record created successfully.";
    this.showSuccessToast(msg);
    refreshApex(this.updatedRecords);
  }

  handleDeleteClick() {
    var selectedRows = this.template
      .querySelector("c-custom-data-table")
      .getSelectedRows();
    if (selectedRows.length < 1) {
      var msg = "You have to select atleast one record.";
      this.showErrorToast(msg);
    } else {
      this.waitForASection = true;
      for (const element of selectedRows) {
        deleteRecord(element.Id)
          .then(() => {
            this.showSuccessToast("Record deleted successfully.");
            refreshApex(this.updatedRecords);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  handleCreateClick() {
    if (this.admins != null) {
      this.showAdminTable = true;
    } else {
      this.showAdminTableEmpty = true;
    }
    this.showCreateModal = true;
    this.showbuttons = false;
  }

  handleCancelClick() {
    if (this.teachers != null) {
      this.showAdminTable = false;
    } else {
      this.showAdminTableEmpty = false;
    }
    this.showCreateModal = false;
    this.showbuttons = true;
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

  lastSavedData = [];

  updateRecords() {
    const start = (this.currentPage - 1) * this.recordSize;
    const end = this.recordSize * this.currentPage;
    if (this.totalRecords != null) {
      var arr = this.totalRecords.slice(start, end);
      var modifiedData = arr.map((item) => ({
        ...item,
        phasepickListGenderOptions: this.genderPicklist,
        phasepickListProfileOptions: this.profilePicklist,
      }));
      this.visibleRecords = modifiedData;
      this.tstaffRecords = this.visibleRecords;
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

  showWarningToast(msg) {
    const event = new ShowToastEvent({
      title: "Warning",
      variant: "warning",
      message: msg,
    });
    this.dispatchEvent(event);
  }
}