import { LightningElement, track, wire } from "lwc";
import getAnnouncementRecords from "@salesforce/apex/AdminUIFirstPartController.getAnnouncementRecords";
import getFieldAPINames from "@salesforce/apex/AdminUIFirstPartController.getFieldAPINames";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from "lightning/uiRecordApi";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import ANNOUNCEMENT_OBJECT from "@salesforce/schema/Announcement__c";
import ANNOUNCEMENT_TYPE_FIELD from "@salesforce/schema/Announcement__c.Type__c";

export default class AnnouncementUI extends LightningElement {
  @track currentPage = 1;
  @track totalRecords;
  @track recordSize = 10;
  @track totalPage = 0;

  @track announcecolumns = [
    {
      label: "Description",
      fieldName: "Description__c",
      editable: true,
      sortable: true,
    },
    {
      label: "Announcement Name",
      fieldName: "Name",
      editable: true,
      sortable: true,
    },
    {
      label: "Type",
      fieldName: "Type__c",
      type: "picklistColumn",
      typeAttributes: {
        placeholder: "Select picklist",
        options: { fieldName: "phasepickListOptions" },
        value: { fieldName: "Type__c" },
        context: { fieldName: "Type__c" },
      },
      editable: true,
      sortable: true,
    },
    {
      label: "Start Date Time",
      fieldName: "Start_Date_Time__c",
      type: "date",
      typeAttributes: {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      },
      editable: true,
      sortable: true,
    },
    {
      label: "End Date Time",
      fieldName: "End_Date_Time__c",
      type: "date",
      typeAttributes: {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      },
      editable: true,
      sortable: true,
    },
  ];

  @track showAnnouncementTable = false;
  @track sortBy;
  @track announcementRecord = [];
  @track showButtons = true;
  @track announcementId;
  @track saveDraftValues = [];
  @track activeSections = ["A", "B", "C", "D"];
  @track sortDirection;
  @track showBackButton = false;
  @track showCreateModal = false;
  @track showEditModal = false;
  @track showAnnouncementTableEmpty = false;
  @track tstaffRecord = [];
  @track updatedRecords = [];
  @track parentId;
  @track showConfigModal = false;
  @track selectedLabel = [];
  @track selectedField = [];
  @track visibleRecords = [];
  @track phasepickListOptions = [];
  @track announcementPicklist = [];
  options = [];
  values = [];
  objectName = "Announcement__c";
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

  @wire(getObjectInfo, { objectApiName: ANNOUNCEMENT_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: ANNOUNCEMENT_TYPE_FIELD,
  })
  wirePickList({ error, data }) {
    if (data) {
      this.announcementPicklist = data.values;
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
      this.showErrorToast(error);
    }
  }

  @wire(getAnnouncementRecords)
  wireStudent(result) {
    this.updatedRecords = result;
    if (result.data) {
      this.waitForASection = false;
      this.totalRecords = result.data;
      this.recordSize = Number(this.recordSize);
      this.totalPage = Math.ceil(result.data.length / this.recordSize);
      this.updateRecords();
      if (result.data != "") {
        this.announcementRecord = result.data;
        this.showAnnouncementTable = true;
      } else {
        this.showAnnouncementTableEmpty = true;
        this.showAnnouncementTable = false;
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
    this.values = this.announcecolumns.map((column) => column.fieldName);
  }

  handleConfigModalSave() {
    if (this.selectedField.length > 0) {
      this.announcecolumns = [];
      var arr = [];
      for (let i = 0; i < this.selectedField.length; i++) {
        var item;
        if (this.selectedField[i] === "Type__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "picklistColumn",
            typeAttributes: {
              placeholder: "Select picklist",
              options: { fieldName: "phasepickListOptions" },
              value: { fieldName: "Type__c" },
              context: { fieldName: "Id" },
            },
            editable: true,
            sortable: true,
          };
        } else if (this.selectedField[i] === "End_Date_Time__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "date",
            typeAttributes: {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            },
            editable: true,
            sortable: true,
          };
        } else if (this.selectedField[i] === "Start_Date_Time__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "date",
            typeAttributes: {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
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
        this.announcecolumns = arr;
        getAnnouncementRecords({
          field: this.sortBy,
          sortOrder: this.sortDirection,
          fields: this.selectedField,
        })
          .then((result) => {
            this.updateRecords();
            this.visibleRecords = result;
            this.showConfigModal = false;
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
    const recordInputs = this.saveDraftValues.map((draft) => {
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
        var msg = "Error updating record.";
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
    getAnnouncementRecords({
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
    this.visibleRecords = this.tstaffRecord;
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
      availableAccounts = this.tstaffRecord;
    }
    this.visibleRecords = availableAccounts;
  }

  handleSuccess() {
    if (this.announcementRecord != null) {
      this.showAnnouncementTable = true;
    } else {
      this.showAnnouncementTableEmpty = true;
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
      var msg = "You have to select atleast one record.";
      this.showErrorToast(msg);
    } else {
      this.waitForASection = true;
      for (const element of selectedRows) {
        deleteRecord(element.Id)
          .then(() => {
            var msg = "Record deleted successfully.";
            this.showSuccessToast(msg);
            refreshApex(this.updatedRecords);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  handleCancelClick() {
    if (this.announcementRecord != null) {
      this.showAnnouncementTable = true;
    } else {
      this.showAnnouncementTableEmpty = true;
    }
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showButtons = true;
  }

  handleCreateClick() {
    if (this.announcementRecord != null) {
      this.showAnnouncementTable = false;
    } else {
      this.showAnnouncementTableEmpty = false;
    }
    this.showCreateModal = true;
    this.showButtons = false;
  }

  updateRecords() {
    const start = (this.currentPage - 1) * this.recordSize;
    const end = this.recordSize * this.currentPage;
    if (this.totalRecords != null) {
      var arr = this.totalRecords.slice(start, end);
      var modifiedData = arr.map((item) => ({
        ...item,
        phasepickListOptions: this.announcementPicklist,
      }));
      this.visibleRecords = modifiedData;
      this.tstaffRecord = this.visibleRecords;
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
}