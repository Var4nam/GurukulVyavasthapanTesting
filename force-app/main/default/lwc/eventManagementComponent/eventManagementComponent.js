import { LightningElement, track, wire } from "lwc";
import getEventManagementRecords from "@salesforce/apex/AdminUIFirstPartController.getEventManagementRecords";
import getFieldAPINames from "@salesforce/apex/AdminUIFirstPartController.getFieldAPINames";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from "lightning/uiRecordApi";

export default class EventManagementComponent extends LightningElement {
  @track currentPage = 1;
  @track totalRecords;
  @track recordSize = 10;
  @track totalPage = 0;
  @track eventManagentcolumns = [
    { label: "School Name", fieldName: "School__c" },
    {
      label: "Event Name",
      fieldName: "Name",
      type: "text",
      sortable: "true",
      editable: "true",
    },
    {
      label: "Address",
      fieldName: "Address__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Description",
      fieldName: "Description__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Date",
      fieldName: "Date__c",
      type: "date-local",
      typeAttributes: {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
    },
  ];
  @track showButtons = true;
  @track showEventManagementTable = true;
  @track showCreateModal = false;
  @track showEventManagementTableEmpty = false;
  @track eventManagementRecord = [];
  @track sortBy;
  @track saveDraftValues = [];
  @track activeSections = ["A", "B", "C", "D"];
  @track sortDirection;
  @track updatedRecords = [];
  @track eventManagementId;
  @track tstaffRecord = [];
  @track selectedLabel = [];
  @track showConfigModal = false;
  @track selectedField = [];
  @track visibleRecords = [];
  @track waitForASection = true;
  options = [];
  values = [];
  objectName = "Event_Management__c";

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

  @wire(getEventManagementRecords)
  wireEventManagement(result) {
    this.updatedRecords = result;
    if (result.data) {
      this.waitForASection = false;
      this.totalRecords = result.data;
      this.recordSize = Number(this.recordSize);
      this.totalPage = Math.ceil(result.data.length / this.recordSize);
      this.updateRecords();
      if (result.data != "") {
        this.eventManagementRecord = result.data;
        this.showEventManagementTable = true;
      } else {
        this.showEventManagementTable = false;
        this.showEventManagementTableEmpty = true;
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
  }

  handleConfigClick() {
    this.showConfigModal = true;
    this.values = this.eventManagentcolumns.map((column) => column.fieldName);
  }

  handleConfigModalSave() {
    if (this.selectedField.length > 0) {
      this.eventManagentcolumns = [];
      var arr = [];
      for (let i = 0; i < this.selectedField.length; i++) {
        var item;
        if (this.selectedField[i] === "School__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
          };
        } else if (this.selectedField[i] === "Date__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "date-local",
            typeAttributes: {
              year: "numeric",
              month: "numeric",
              day: "numeric",
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
        this.eventManagentcolumns = arr;
        getEventManagementRecords({
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
    getEventManagementRecords({
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
    if (this.eventManagementRecord != null) {
      this.showEventManagementTable = true;
    } else {
      this.showEventManagementTableEmpty = true;
    }
    this.waitForASection = true;
    this.showCreateModal = false;
    this.showButtons = true;
    refreshApex(this.updatedRecords);
    var msg = "record created successfully.";
    this.showSuccessToast(msg);
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
            var msg = error.body.output.fieldErrors.Name[0].message;
            this.showErrorToast(msg);
          });
      }
    }
  }

  handleCancelClick() {
    if (this.eventManagementRecord != null) {
      this.showEventManagementTable = true;
    } else {
      this.showEventManagementTableEmpty = true;
    }
    this.showCreateModal = false;
    this.showButtons = true;
  }

  handleCreateClick() {
    if (this.eventManagementRecord != null) {
      this.showEventManagementTable = false;
    } else {
      this.showEventManagementTableEmpty = false;
    }
    this.showCreateModal = true;
    this.showButtons = false;
  }

  updateRecords() {
    const start = (this.currentPage - 1) * this.recordSize;
    const end = this.recordSize * this.currentPage;
    if (this.totalRecords != null) {
      this.visibleRecords = this.totalRecords.slice(start, end);
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