import { LightningElement, api, track, wire } from 'lwc';
import showAssignClassRecord from '@salesforce/apex/AdminUIFirstPartController.showAssignClassRecord';
import getFieldAPINames from '@salesforce/apex/AdminUIFirstPartController.getFieldAPINames';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from 'lightning/uiRecordApi';
import saveFile from '@salesforce/apex/AssignClassImportController.saveFile';
import saveRecords from '@salesforce/apex/AssignClassImportController.saveRecords';
import myResource from '@salesforce/resourceUrl/SampleCsvFileForAssignClass';

const assignClsColumn = [
    { label: 'Class', fieldName: 'Class' },
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Teacher', fieldName: 'Teacher' }
];

export default class AssignClassComponent extends LightningElement {

    @track currentPage = 1;
    @track totalRecords;
    @track recordSize = 10;
    @track totalPage = 0;
    @track assignClassColumns = [
        {
            label: 'Class Name',
            fieldName: 'Class__c',
            type: 'lookupColumn',
            typeAttributes: {
                object: 'Assign_Classes__c',
                fieldName: 'Class__c',
                value: { fieldName: 'Class__c' },
                context: { fieldName: 'Id' },
                name: 'Class__c',
                fields: ['Class__r.Name'],
                target: '_self'
            },
            sortable: true,
        },
        {
            label: 'Subject Name',
            fieldName: 'Subject__c',
            type: 'lookupColumn',
            typeAttributes: {
                object: 'Assign_Classes__c',
                fieldName: 'Subject__c',
                value: { fieldName: 'Subject__c' },
                context: { fieldName: 'Id' },
                name: 'Subject__c',
                fields: ['Subject__r.Name'],
                target: '_self'
            },
            sortable: true,
        },
        {
            label: 'Teacher Name',
            fieldName: 'Teacher__c',
            type: 'lookupColumn',
            typeAttributes: {
                object: 'Assign_Classes__c',
                fieldName: 'Teacher__c',
                value: { fieldName: 'Teacher__c' },
                context: { fieldName: 'Id' },
                name: 'Teacher__c',
                fields: ['Teacher__r.Name'],
                target: '_self'
            },
            sortable: true,
        },
    ];
    @track showButtons = true;
    @track showAssignClassTable = false;
    @track showCreateModal = false;
    @track showAssignClassTableEmpty = false;
    @track assignClassRecord = [];
    @track updatedRecords = [];
    @track saveDraftValues = [];
    @track sortBy;
    @track sortDirection;
    @track activeSections = ['A', 'B', 'C', 'D'];
    @track tempRecords = [];
    @track showConfigModal = false;
    @track visibleRecords = [];
    @track selectedField = [];
    @track selectedLabel = [];
    @api recordId;
    @track data = true;
    column = assignClsColumn;
    wiredResult;
    @track fileName = '';
    @track UploadFile = 'Upload CSV File';
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
    objectName = 'Assign_Classes__c';
    @track waitForASection = true;
    @track changesMade = false;

    renderedCallback() {
        let styles = document.createElement('style');
        styles.innerText = '.custom-datatable-style tbody c-custom-data-table tr:nth-child(even) { background-color: #60D2FF; height: 50px;} .custom-datatable-style tbody c-custom-data-table tr:nth-child(odd) { background-color: #a4e3fb; height: 50px;}';
        let customDatatable = this.template.querySelector('.custom-datatable-style');
        if (customDatatable) {
            customDatatable.appendChild(styles);
        } else {
            console.error("Element with class 'custom-datatable-style' not found.");
        }
    }

    @wire(getFieldAPINames, { objName: '$objectName' })
    wiredFields({ error, data }) {
        if (data) {
            this.options = data.map(field => ({
                label: field.fieldLabel,
                value: field.fieldApiName
            }));
        } else if (error) {
            this.showErrorToast(error);
        }
    }

    @wire(showAssignClassRecord)
    wireParent(result) {
        this.updatedRecords = result;
        if (result.data) {
            this.waitForASection = false;
            this.totalRecords = result.data;
            this.recordSize = Number(this.recordSize);
            this.totalPage = Math.ceil(result.data.length / this.recordSize);
            this.updateRecords();
            if (result.data != '') {
                this.assignClassRecord = result.data;
                this.showAssignClassTable = true;
            } else {
                this.showAssignClassTable = false;
                this.showAssignClassTableEmpty = true;
            }
        } else if (result.error) {
            this.showErrorToast(result.error);
        }
        this.waitForASection = false;
    }

    get selected() {
        return this.selectedField.length ? this.selectedField : 'none';
    }

    handleChange(event) {
        this.selectedField = event.detail.value;
        this.selectedLabel = this.selectedField.map(option => this.options.find(o => o.value === option).label);
    }

    handleConfigModalCancel() {
        this.showConfigModal = false;
        this.values = [];
    }

    handleConfigClick() {
        this.showConfigModal = true;
        this.values = this.assignClassColumns.map(column => column.fieldName);
    }

    handleConfigModalSave() {
        if (this.selectedField.length > 0) {
            this.assignClassColumns = [];
            var arr = [];
            for (let i = 0; i < this.selectedField.length; i++) {
                var item;
                if (this.selectedField[i] === 'Class__c') {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        type: 'lookupColumn',
                        typeAttributes: {
                            object: 'Assign_Classes__c',
                            fieldName: 'Class__c',
                            value: { fieldName: 'Class__c' },
                            context: { fieldName: 'Id' },
                            name: 'Class__c',
                            fields: ['Class__c.Name'],
                            target: '_self'
                        },
                        sortable: true,
                    }
                } else if (this.selectedField[i] === 'Subject__c') {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        type: 'lookupColumn',
                        typeAttributes: {
                            object: 'Assign_Classes__c',
                            fieldName: 'Subject__c',
                            value: { fieldName: 'Subject__c' },
                            context: { fieldName: 'Id' },
                            name: 'Subject__c',
                            fields: ['Subject__r.Name'],
                            target: '_self'
                        },
                        sortable: true,
                    }
                } else if (this.selectedField[i] === 'Teacher__c') {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        type: 'lookupColumn',
                        typeAttributes: {
                            object: 'Assign_Classes__c',
                            fieldName: 'Teacher__c',
                            value: { fieldName: 'Teacher__c' },
                            context: { fieldName: 'Id' },
                            name: 'Teacher__c',
                            fields: ['Teacher__c.Name'],
                            target: '_self'
                        },
                        sortable: true,
                    }
                } else {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        sortable: 'true',
                    }
                }
                arr.push(item);
                this.assignClassColumns = arr;
                showAssignClassRecord({ field: this.sortBy, sortOrder: this.sortDirection, fields: this.selectedField })
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
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            var msg = 'record updated successfully.';
            this.showSuccessToast(msg);
            return this.refresh();
        }).catch(error => {
            var msg = 'Error creating record.';
            this.showErrorToast(msg);
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }

    async refresh() {
        await refreshApex(this.updatedRecords);
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        showAssignClassRecord({ field: this.sortBy, sortOrder: this.sortDirection, fields: this.selectedField })
            .then((result) => {
                this.visibleRecords = result;
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleLookupChange() {
        this.changesMade = true;
    }

    handleSearch(event) {
        this.visibleRecords = this.tempRecords;
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
        }
        else {
            availableAccounts = this.tempRecords;
        }
        this.visibleRecords = availableAccounts;
    }

    handleCellChange() {
        this.saveDraftValues(event.detail.draftValues[0]);
    }

    handleSaveClick() {
        if (this.assignClassRecord != null) {
            this.showAssignClassTable = true;
        } else {
            this.showAssignClassTableEmpty = true;
        }
        this.waitForASection = true;
        this.showCreateModal = false;
        this.showButtons = true;
        var msg = 'record created successfully.';
        this.showSuccessToast(msg);
        refreshApex(this.updatedRecords);
    }

    handleDeleteClick() {
        var selectedRows = this.template.querySelector('c-custom-data-table').getSelectedRows();
        if (selectedRows.length < 1) {
            var msg = 'You have to select atleast one record.';
            this.showErrorToast(msg);
        } else {
            this.waitForASection = true;
            for (const element of selectedRows) {
                deleteRecord(element.Id)
                    .then(() => {
                        this.showSuccessToast('Record deleted successfully.');
                        refreshApex(this.updatedRecords);
                    })
                    .catch((error) => {
                        this.showErrorToast(error);
                    });
            }
        }
    }

    handleCancelClick() {
        if (this.assignClassRecord != null) {
            this.showAssignClassTable = true;
        } else {
            this.showAssignClassTableEmpty = true;
        }
        this.showCreateModal = false;
        this.showButtons = true;
    }

    handleCreateClick() {
        if (this.assignClassRecord != null) {
            this.showAssignClassTable = false;
        } else {
            this.showAssignClassTableEmpty = false;
        }
        this.showCreateModal = true;
        this.showButtons = false;
    }

    previousHandler() {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            this.updateRecords()
        }
    }

    nextHandler() {
        if (this.currentPage < this.totalPage) {
            this.currentPage = this.currentPage + 1
            this.updateRecords()
        }
    }
    lastSavedData = [];

    updateRecords() {
        const start = (this.currentPage - 1) * this.recordSize
        const end = this.recordSize * this.currentPage
        if (this.totalRecords !== null) {
            this.visibleRecords = this.totalRecords.slice(start, end);
            this.tempRecords = this.visibleRecords;
            this.dispatchEvent(new CustomEvent('update', {
                detail: {
                    records: this.visibleRecords
                }
            }))
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
            this.fileName = 'Please select a CSV file to upload!!';
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
            const rows = csvData.split('\r\n');
            const headers = rows[0].split(',');
            var arr = [];
            for (let i = 1; i < rows.length; i++) {
                let rowData = rows[i].split(',');
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
                throw new Error('No file content available to upload.');
            }
            const lines = this.fileContents.split('\n');
            const nonEmptyLines = lines.filter(line => line.trim() !== '');
            const formattedCsvData = nonEmptyLines.join('\n');
            saveFile({ base64Data: formattedCsvData })
                .then(result => {
                    if (result === null || result.length === 0) {
                        var msg = 'The CSV file has not proper data Or Missing data';
                        this.showWarningToast(msg);
                    } else {
                        this.parentData = result;
                        this.fileName = this.fileName + '– Uploaded Successfully';
                        this.isTrue = false;
                        this.showLoadingSpinner = false;
                        this.showUploadSection = false;
                        this.showNextModal = false;
                        var msg = this.filesUploaded[0].name + '– Uploaded Successfully!!!';
                        this.showSuccessToast(msg);
                        this.importedRecords = [];
                        this.fileContents = [];
                        this.filesUploaded = [];
                        refreshApex(this.updatedRecords);
                    }
                })
                .catch(error => {
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
            title: 'Not Valid',
            variant: 'error',
            message: msg,
        });
        this.dispatchEvent(event);
    }

    showSuccessToast(msg) {
        const event = new ShowToastEvent({
            title: 'Successful',
            variant: 'success',
            message: msg,
        });
        this.dispatchEvent(event);
    }

    showWarningToast(msg) {
        const event = new ShowToastEvent({
            title: 'Warning',
            variant: 'warning',
            message: msg,
        });
        this.dispatchEvent(event);
    }

    handleFieldChange(event) {
        this.changesMade = true;
    }

    handleCancelClick() {
        this.changesMade = false;
    }

    handleSave() {
        if (this.changesMade) {
            this.changesMade = false;
        }
    }

    handleSaveChanges() {
        this. waitForASection = true;
        console.log('HERE in save:');
        let recordsToUpdate = [];
        this.template.querySelectorAll(".assignClassTable").forEach(element=>{
            let recordUpdate = element.recordUpdate;
            if( recordUpdate.classVal != undefined 
                || recordUpdate.subject != undefined || recordUpdate.teacher != undefined ){
                recordsToUpdate.push(recordUpdate);
            }
            
        });
        console.log('recordsToUpdate 1: ', JSON.stringify(recordsToUpdate));
        this.saveRecords(recordsToUpdate);
    }

    saveRecords(recordsToUpdate) {
        saveRecords({ recordsToUpdate : JSON.stringify(recordsToUpdate) }).then( res=>{
            if(res == 'Success') {
                this.handleSave();
                refreshApex(this.updatedRecords);
            }
            }).catch(error=>{
                this.changesMade = false;
                this.waitForASection = false;
                console.error('--error--1--saveRecords--',error);
            });
    }
}