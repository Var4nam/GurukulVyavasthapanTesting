import { LightningElement, api, track, wire } from "lwc";
import getSubjectRecords from "@salesforce/apex/AdminUIFirstPartController.getSubjectRecords";
import getFieldAPINames from "@salesforce/apex/AdminUIFirstPartController.getFieldAPINames";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from "lightning/uiRecordApi";
import saveFile from "@salesforce/apex/SubjectImportController.saveFile";
import myResource from "@salesforce/resourceUrl/SampleCsvFileForSubject";

const sbjColumn = [
  { label: "Name", fieldName: "Name" },
  { label: "Class", fieldName: "ClassName" },
  { label: "Subject Code", fieldName: "SubjectCode" },
];

export default class SubjectComponent extends LightningElement {
  @track currentPage = 1;
  @track totalRecords;
  @track recordSize = 10;
  @track totalPage = 0;

  @track subjectcolumns = [
    { label: "Name", fieldName: "Name", editable: "true", sortable: "true" },
    {
      label: "Subject Code",
      fieldName: "Subject_Code__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Class Name",
      fieldName: "Class__c",
      type: "lookupColumn",
      typeAttributes: {
        object: "Subject__c",
        fieldName: "Class__c",
        value: { fieldName: "Class__c" },
        context: { fieldName: "Id" },
        name: "ClassName",
        fields: ["Class__r.Name"],
        target: "_self",
      },
      editable: true,
      sortable: true,
    },
  ];

  @track showbuttons = true;
  @track showSubjectTable = true;
  @track sortBy;
  @track saveDraftValues = [];
  @track activeSections = ["A", "B", "C", "D"];
  @track sortDirection;
  @track showCreateModal = false;
  @track showSubjectTableEmpty = false;
  @track subjectRecord = [];
  @track updatedRecords = [];
  @track subjectId;
  @track tstaffRecord = [];
  @track selectedLabel = [];
  @track showConfigModal = false;
  @track selectedField = [];
  @track visibleRecords = [];
  @api recordId;
  @track data = true;
  column = sbjColumn;
  wiredResult;
  @track fileName = "";
  @track UploadFile = "Upload CSV File";
  @track showLoadingSpinner = false;
  @track isTrue = false;
  selectedRecords;
  filesUploaded = [];
  file;
  fileContents;
  fileReader;
  content;
  MAX_FILE_SIZE = 1500000;
  sampleCsvUrl = myResource;
  showUploadSection = false;
  showNextModal = false;
  importedRecords = [];
  options = [];
  values = [];
  objectName = "Subject__c";

  @track waitForASection = false;

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
      this.options = data.map((field) => ({
        label: field.fieldLabel,
        value: field.fieldApiName,
      }));
    } else if (error) {
      console.error(error);
    }
  }

  @wire(getSubjectRecords)
  wireSubject(result) {
    this.updatedRecords = result;
    if (result.data) {
      this.waitForASection = false;
      this.totalRecords = result.data;
      this.recordSize = Number(this.recordSize);
      this.totalPage = Math.ceil(result.data.length / this.recordSize);
      this.updateRecords();
      if (result.data != "") {
        this.subjectRecord = result.data;
        this.showSubjectTable = true;
      } else {
        this.showSubjectTableEmpty = true;
        this.showSubjectTable = false;
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
    this.values = this.subjectcolumns.map((column) => column.fieldName);
  }

  handleConfigModalSave() {
    if (this.selectedField.length > 0) {
      this.subjectcolumns = [];
      var arr = [];
      for (let i = 0; i < this.selectedField.length; i++) {
        var item;
        if (this.selectedField[i] === "Class__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "lookupColumn",
            typeAttributes: {
              object: "Subject__c",
              fieldName: "Class__c",
              value: { fieldName: "Class__c" },
              context: { fieldName: "Id" },
              name: "Subject",
              fields: ["Class__c.Name"],
              target: "_self",
            },
            editable: false,
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
        this.subjectcolumns = arr;
        getSubjectRecords({
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
    getSubjectRecords({
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
    if (this.subjectRecord != null) {
      this.showSubjectTable = true;
    } else {
      this.showSubjectTableEmpty = true;
    }
    this.waitForASection = true;
    this.showCreateModal = false;
    this.showbuttons = true;
    refreshApex(this.updatedRecords);
    var msg = "record created successfully.";
    this.showSuccessToast(msg);
  }

  handleDeleteClick() {
    var selectedRows = this.template
      .querySelector("lightning-datatable")
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

  handleCancelClick() {
    if (this.subjectRecord != null) {
      this.showSubjectTable = true;
    } else {
      this.showSubjectTableEmpty = true;
    }
    this.showCreateModal = false;
    this.showbuttons = true;
  }

  handleCreateClick() {
    if (this.subjectRecord != null) {
      this.showSubjectTable = false;
    } else {
      this.showSubjectTableEmpty = false;
    }
    this.showCreateModal = true;
    this.showbuttons = false;
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

  handleCancel() {
    this.showUploadSection = false;
    this.showNextModal = false;
    this.importedRecords = [];
    this.fileContents = [];
    this.filesUploaded = [];
    refreshApex(this.updatedRecords);
  }

  handleNextModal() {
    this.showNextModal = true;
    this.handleCSVSave();
  }

  handleModalBack() {
    this.showNextModal = false;
  }

  handleImport() {
    this.showUploadSection = true;
  }

  handleFilesChange(event) {
    if (event.target.files.length > 0) {
      this.filesUploaded = event.target.files;
      this.fileName = this.filesUploaded[0].name;
    }
  }

  handleCSVSave() {
    if (this.filesUploaded.length > 0) {
      this.uploadFile();
    } else {
      this.fileName = "Please select a CSV file to upload!!";
    }
  }

  uploadFile() {
    if (this.filesUploaded[0].size > this.MAX_FILE_SIZE) {
      return;
    }
    this.showLoadingSpinner = true;
    this.fileReader = new FileReader();
    this.fileReader.onloadend = () => {
      this.fileContents = this.fileReader.result;
      const csvData = this.fileContents;
      const rows = csvData.split("\r\n");
      const headers = rows[0].split(",");
      var arr = [];
      for (let i = 1; i < rows.length; i++) {
        let rowData = rows[i].split(",");
        let obj = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = rowData[j];
        }
        arr.push(obj);
      }
      this.importedRecords = arr;
    };
    this.fileReader.readAsText(this.filesUploaded[0]);
  }

  handlesaveFile() {
    try {
      if (!this.fileContents) {
        throw new Error("No file content available to upload.");
      }
      const lines = this.fileContents.split("\n");
      const nonEmptyLines = lines.filter((line) => line.trim() !== "");
      const formattedCsvData = nonEmptyLines.join("\n");
      saveFile({ base64Data: formattedCsvData })
        .then((result) => {
          if (result === null || result.length === 0) {
            var msg = "The CSV file has not proper data Or Missing data";
            this.showWarningToast(msg);
          } else {
            this.parentData = result;
            this.fileName = this.fileName + "– Uploaded Successfully";
            this.isTrue = false;
            this.showLoadingSpinner = false;
            this.showUploadSection = false;
            this.showNextModal = false;
            var msg = this.filesUploaded[0].name + "– Uploaded Successfully!!!";
            this.showSuccessToast(msg);
            this.importedRecords = [];
            this.fileContents = [];
            this.filesUploaded = [];
            refreshApex(this.updatedRecords);
          }
        })
        .catch((error) => {
          this.showLoadingSpinner = false;
          var msg = error.message;
          this.showErrorToast(msg);
        });
    } catch (error) {
      this.showLoadingSpinner = false;
      var msg = error.message;
      this.showErrorToast(msg);
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