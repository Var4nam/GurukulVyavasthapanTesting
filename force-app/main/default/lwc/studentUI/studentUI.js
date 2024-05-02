import { LightningElement, api, track, wire } from "lwc";
import getStudentRecords from "@salesforce/apex/AdminUIFirstPartController.getStudentRecords";
import getFieldAPINames from "@salesforce/apex/AdminUIFirstPartController.getFieldAPINames";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from "lightning/uiRecordApi";
import myResource from "@salesforce/resourceUrl/SampleCsvFileForStudent";
import saveFile from "@salesforce/apex/StudentImportController.saveFile";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import STUDENT_OBJECT from "@salesforce/schema/Student__c";
import BLOOD_GROUP_FIELD from "@salesforce/schema/Student__c.Blood_Group__c";
import GENDER_FIELD from "@salesforce/schema/Student__c.Gender__c";

const stucolumn = [
  { label: "First Name", fieldName: "First Name" },
  { label: "Last Name", fieldName: "Last Name" },
  { label: "Contact Information", fieldName: "Contact Information" },
  { label: "Date of Birth", fieldName: "Date of Birth" },
  { label: "Blood Group", fieldName: "Blood Group" },
  { label: "Entrollment Date", fieldName: "Entrollment Date" },
  { label: "Enrollment Number", fieldName: "Enrollment Number" },
  { label: "Roll Number", fieldName: "Roll Number" },
  { label: "Class", fieldName: "Class" },
  { label: "School Name", fieldName: "School Name" },
  { label: "Result", fieldName: "Result" },
  { label: "Grade Level", fieldName: "Grade Level" },
  { label: "Father Name", fieldName: "Father Name" },
  { label: "Mother Name", fieldName: "Mother Name" },
  {
    label: "Parent Contact Information",
    fieldName: "ParentContactInformation",
  },
  { label: "Guardian Name", fieldName: "Guardian Name" },
  { label: "Relationship", fieldName: "Relationship" },
  { label: "Sibling1", fieldName: "Sibling1" },
  { label: "Sibling2", fieldName: "Sibling2" },
  { label: "Country", fieldName: "Country" },
  { label: "State", fieldName: "State" },
  { label: "City", fieldName: "City" },
  { label: "Postal Code", fieldName: "Postal Code" },
  { label: "Locality", fieldName: "Locality" },
  { label: "Address1", fieldName: "Addressline1" },
  { label: "Address2", fieldName: "Addressline2" },
  { label: "LandMark", fieldName: "LandMark" },
];

export default class StudentUI extends LightningElement {
  @track currentPage = 1;
  @track totalRecords;
  @track recordSize = 10;
  @track totalPage = 0;
  @track studentColumns = [
    {
      label: "Enrollment Number",
      fieldName: "Enrollment_Number__c",
      editable: "true",
      sortable: "true",
    },
    { label: "Name", fieldName: "Name", editable: "true", sortable: "true" },
    {
      label: "Father Name",
      fieldName: "Father_Name__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Mother Name",
      fieldName: "Mother_Name__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Roll Number",
      fieldName: "Roll_Number__c",
      editable: "true",
      sortable: "true",
    },
    {
      label: "Class Name",
      fieldName: "Class__c",
      type: "lookupColumn",
      typeAttributes: {
        object: "Student__c",
        fieldName: "Class__c",
        value: { fieldName: "Class__c" },
        context: { fieldName: "Id" },
        name: "Student",
        fields: ["Class__r.Name"],
        target: "_self",
      },
      editable: true,
      sortable: true,
    },
    {
      label: "School Name",
      fieldName: "School__c",
      type: "lookupColumn",
      typeAttributes: {
        object: "Student__c",
        fieldName: "School__c",
        value: { fieldName: "School__c" },
        context: { fieldName: "Id" },
        name: "Student",
        target: "_self",
      },
      editable: true,
      sortable: true,
    },
    {
      label: "Result Name",
      fieldName: "Result__c",
      type: "lookupColumn",
      typeAttributes: {
        object: "Student__c",
        fieldName: "Result__c",
        value: { fieldName: "Result__c" },
        context: { fieldName: "Id" },
        name: "Result",
        fields: ["Result__r.Name"],
        target: "_self",
      },
      editable: true,
      sortable: true,
    },
  ];
  @track showbuttons = true;
  @track showStudentTable = false;
  @track students;
  @track sortBy;
  @track saveDraftValues = [];
  @track activeSections = ["A", "B", "C", "D"];
  @track sortDirection;
  @track showCreateModal = false;
  @track showEditModal = false;
  @track showStudentTableEmpty = false;
  @track studentRecord = [];
  @track updatedRecords = [];
  @track studentId;
  @track tstaffRecord = [];
  @track selectedLabel = [];
  @track showConfigModal = false;
  @track selectedField = [];
  @track visibleRecords = [];
  @track phasepickListBloodGroupOptions = [];
  @track phasepickListGenderOptions = [];
  @track bloodGroupPicklist = [];
  @track genderPicklist = [];
  @track data = true;
  @track fileName = "";
  @track UploadFile = "Upload CSV File";
  @track showLoadingSpinner = false;
  @track isTrue = false;
  column = stucolumn;
  wiredResult;
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
  fieldData = [];
  options = [];
  values = [];
  objectName = "Student__c";

  @track waitForASection = true;
  @track showAllStudent = false;

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

  @wire(getObjectInfo, { objectApiName: STUDENT_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: BLOOD_GROUP_FIELD,
  })
  wirePickList({ error, data }) {
    if (data) {
      this.bloodGroupPicklist = data.values;
      console.log("bloodGroupPicklist ::: ", this.bloodGroupPicklist);
      this.updateRecords();
    } else if (error) {
      console.error("Error retrieving picklist values:", error);
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: GENDER_FIELD,
  })
  wirePickList({ error, data }) {
    if (data) {
      this.genderPicklist = data.values;
      console.log("genderPicklist ::: ", this.genderPicklist);
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

  @wire(getStudentRecords)
  wireStudent(result) {
    this.updatedRecords = result;
    if (result.data) {
      this.waitForASection = false;
      this.totalRecords = result.data;
      this.recordSize = Number(this.recordSize);
      this.totalPage = Math.ceil(result.data.length / this.recordSize);
      this.updateRecords();
      if (result.data != "") {
        this.students = result.data;
        this.showStudentTable = true;
      } else {
        this.showStudentTableEmpty = true;
        this.showStudentTable = false;
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

  handleConfigClick() {
    this.showConfigModal = true;
    this.values = this.studentColumns.map((column) => column.fieldName);
  }

  handleConfigModalCancel() {
    this.showConfigModal = false;
    this.values = [];
  }

  handleConfigModalSave() {
    if (this.selectedField.length > 0) {
      this.studentColumns = [];
      var arr = [];
      for (let i = 0; i < this.selectedField.length; i++) {
        console.log(" --- ", this.selectedField[i]);
        var item;
        if (this.selectedField[i] === "Class__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "lookupColumn",
            typeAttributes: {
              object: "Student__c",
              fieldName: "Class__c",
              value: { fieldName: "Class__c" },
              context: { fieldName: "Id" },
              name: "Student",
              fields: ["Class__r.Name"],
              target: "_self",
            },
            editable: false,
            sortable: true,
          };
        } else if (this.selectedField[i] === "Result__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "lookupColumn",
            typeAttributes: {
              object: "Student__c",
              fieldName: "Result__c",
              value: { fieldName: "Result__c" },
              context: { fieldName: "Id" },
              name: "Result",
              fields: ["Result__r.Name"],
              target: "_self",
            },
            editable: false,
            sortable: true,
          };
        } else if (this.selectedField[i] === "Sibling1__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "lookupColumn",
            typeAttributes: {
              object: "Student__c",
              fieldName: "Sibling1__c",
              value: { fieldName: "Sibling1__c" },
              context: { fieldName: "Id" },
              name: "Student",
              fields: ["Sibling1__r.Name"],
              target: "_self",
            },
            editable: false,
            sortable: true,
          };
        } else if (this.selectedField[i] === "Sibling2__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "lookupColumn",
            typeAttributes: {
              object: "Student__c",
              fieldName: "Sibling2__c",
              value: { fieldName: "Sibling2__c" },
              context: { fieldName: "Id" },
              name: "Student",
              fields: ["Sibling2__r.Name"],
              target: "_self",
            },
            editable: false,
            sortable: true,
          };
        } else if (this.selectedField[i] === "School__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "lookupColumn",
            typeAttributes: {
              object: "Student__c",
              fieldName: "School__c",
              value: { fieldName: "School__c" },
              context: { fieldName: "Id" },
              name: "Student",
              fields: ["School__r.Name"],
              target: "_self",
            },
            editable: false,
            sortable: true,
          };
        } else if (this.selectedField[i] === "Blood_Group__c") {
          item = {
            label: this.selectedLabel[i],
            fieldName: this.selectedField[i],
            type: "picklistColumn",
            typeAttributes: {
              placeholder: "Select picklist",
              options: { fieldName: "phasepickListBloodGroupOptions" },
              value: { fieldName: "Blood_Group__c" },
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
              options: { fieldName: "phasepickListGenderOptions" },
              value: { fieldName: "Profile__c" },
              context: { fieldName: "Id" },
            },
            editable: true,
            sortable: true,
          };
        } else if (this.selectedField[i] === "Date_of_Birth__c") {
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
        } else if (this.selectedField[i] === "Enrollment_Date__c") {
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
        this.studentColumns = arr;
        getStudentRecords({
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
    getStudentRecords({
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
    const searchKey = event.target.value.trim().toLowerCase();
    if (searchKey) {
      this.visibleRecords = this.tstaffRecord.filter((record) => {
        return Object.values(record).some((value) => {
          const strVal = String(value);
          return strVal.toLowerCase().includes(searchKey);
        });
      });
    } else {
      this.visibleRecords = this.tstaffRecord;
    }
  }

  handleSuccess() {
    if (this.students != null) {
      this.showStudentTable = true;
    } else {
      this.showStudentTableEmpty = true;
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
    if (this.students != null) {
      this.showStudentTable = true;
    } else {
      this.showStudentTableEmpty = true;
    }
    this.showCreateModal = false;
    this.showbuttons = true;
  }

  handleCreateClick() {
    if (this.students != null) {
      this.showStudentTable = false;
    } else {
      this.showStudentTableEmpty = false;
    }
    this.showCreateModal = true;
    this.showbuttons = false;
  }

  updateRecords() {
    const start = (this.currentPage - 1) * this.recordSize;
    const end = this.recordSize * this.currentPage;
    if (this.totalRecords != null) {
      var arr = this.totalRecords.slice(start, end);
      var modifiedData = arr.map((item) => ({
        ...item,
        phasepickListBloodGroupOptions: this.bloodGroupPicklist,
        phasepickListGenderOptions: this.genderPicklist,
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
      console.log("File Size is too large");
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
      this.showAllStudent = true;
    };
    this.fileReader.readAsText(this.filesUploaded[0]);
  }

  handlesaveFile() {
    try {
      console.log("inSave");
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
            this.Teacherdata = result;
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