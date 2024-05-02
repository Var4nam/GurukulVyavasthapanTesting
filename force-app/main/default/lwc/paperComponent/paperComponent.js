import { LightningElement, track, api, wire } from 'lwc';
import getPaperRecords from '@salesforce/apex/AdminUIFirstPartController.getPaperRecords';
import myResource from "@salesforce/resourceUrl/SampleCsvFileForTeacher";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from "lightning/uiRecordApi";
import { updateRecord } from 'lightning/uiRecordApi';
import saveFile from '@salesforce/apex/TeacherImportController.saveFile';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import PAPER_OBJECT from '@salesforce/schema/Paper__c';
import PAPER_TYPE_FIELD from '@salesforce/schema/Paper__c.Paper_Type__c';

const paperColumn = [
    { label: 'Name', fieldName: 'FirstName' },
    { label: 'Assign Class', fieldName: 'assignClass' },
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Out of', fieldName: 'Outof' },
    { label: 'Maximum Marks', fieldName: 'maximumMarks' },
    { label: 'Paper Type', fieldName: 'paperType' }
];

export default class PaperComponent extends LightningElement {

    @track currentPage = 1
    @track totalRecords
    @track recordSize = 10
    @track totalPage = 0
    @track paperColumns = [
        { label: 'Name', fieldName: 'Name', editable: 'true', sortable: "true" },
        {
            label: 'Assign Class', fieldName: 'Assign_Class__c', editable: 'true', sortable: "true",
            type: 'lookupColumn',
            typeAttributes: {
                object: 'Paper__c',
                fieldName: 'Assign_Class__c',
                value: { fieldName: 'Assign_Class__c' },
                context: { fieldName: 'Id' },
                name: 'Paper',
                fields: ['Assign_Class__r.Name'],
                target: '_self'
            },
        },
        {
            label: 'Subject', fieldName: 'Subject__c', editable: 'true', sortable: "true",
            type: 'lookupColumn',
            typeAttributes: {
                object: 'Paper__c',
                fieldName: 'Subject__c',
                value: { fieldName: 'Subject__c' },
                context: { fieldName: 'Id' },
                name: 'Paper',
                fields: ['Subject__r.Name'],
                target: '_self'
            },
        },
        { label: 'Out of', fieldName: 'Out_of__c', editable: 'true', sortable: "true" },
        { label: 'Maximum Marks', fieldName: 'Maximum_Marks__c', editable: 'true', sortable: "true" },
        {
            label: 'Paper Type', fieldName: 'Paper_Type__c', editable: 'true', sortable: "true",
            type: 'picklistColumn',
            typeAttributes: {
                placeholder: 'Select picklist',
                options: { fieldName: 'phasepickListOptions' },
                value: { fieldName: 'Paper_Type__c' },
                context: { fieldName: 'Id' }
            },
        },
    ];
    @track updatedRecords = [];
    @track papers;
    @track showCreateModal = false;
    @track showbuttons = true;
    @track showPaperTableEmpty = false;
    @track showPaperTable = false;
    @track saveDraftValues = [];
    @track sortBy;
    @track sortDirection;
    @track tempRecords = [];
    @track visibleRecords = [];
    @track selectedField = [];
    @track selectedLabel = [];
    @track data = true;
    column = paperColumn;
    @track fileName = '';
    @track UploadFile = 'Upload CSV File';
    @track showLoadingSpinner = false;
    @track isTrue = false;
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
    @track phasepickListOptions = [];
    @track paperTypePicklist = [];
    @track waitForASection = true;
    @track showAllPaper = false;

    renderedCallback() {
        let styles = document.createElement('style');
        styles.innerText = '.custom-datatable-style tbody tr:nth-child(even) { background-color: #60D2FF; height: 50px;} .custom-datatable-style tbody tr:nth-child(odd) { background-color: #a4e3fb; height: 50px;}';
        let customDatatable = this.template.querySelector('.custom-datatable-style');
        if (customDatatable) {
            customDatatable.appendChild(styles);
        } else {
            console.error("Element with class 'custom-datatable-style' not found.");
        }
        console.log('visibleRecords : ', this.visibleRecords);
    }

    @wire(getObjectInfo, { objectApiName: PAPER_OBJECT })
    objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: PAPER_TYPE_FIELD,
    })

    wirePickList({ error, data }) {
        if (data) {
            this.paperTypePicklist = data.values;
            this.updateRecords();
        } else if (error) {
            console.error('Error retrieving picklist values:', error);
        }
    }

    @wire(getPaperRecords)
    wiredPaperRecords(result) {
        this.updatedRecords = result;
        if (result.data) {
            this.waitForASection = false;
            this.totalRecords = result.data;
            this.recordSize = Number(this.recordSize);
            this.totalPage = Math.ceil(result.data.length / this.recordSize);
            this.updateRecords();
            if (result.data != '') {
                this.papers = result.data;
                this.showPaperTable = true;
            } else {
                this.showPaperTableEmpty = true;
                this.showPaperTable = false;
            }
        }
        else if (result.error) {
            console.log('Error:::::', result.error);
        }
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
        this.values = this.paperColumns.map(column => column.fieldName);
    }

    handleConfigModalSave() {
        if (this.selectedField.length > 0) {
            this.paperColumns = [];
            var arr = [];
            for (let i = 0; i < this.selectedField.length; i++) {
                var item;
                if (this.selectedField[i] === 'Assign_Class__c') {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        type: 'lookupColumn',
                        typeAttributes: {
                            object: 'Paper__c',
                            fieldName: 'Assign_Class__c',
                            value: { fieldName: 'Assign_Class__c' },
                            context: { fieldName: 'Id' },
                            name: 'Paper',
                            fields: ['Assign_Class__r.Name'],
                            target: '_self'
                        },
                        editable: true,
                        sortable: true,
                    }
                } else if (this.selectedField[i] === 'Subject__c') {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        type: 'lookupColumn',
                        typeAttributes: {
                            object: 'Paper__c',
                            fieldName: 'Subject__c',
                            value: { fieldName: 'Subject__c' },
                            context: { fieldName: 'Id' },
                            name: 'Paper',
                            fields: ['Subject__r.Name'],
                            target: '_self'
                        },
                        editable: true,
                        sortable: true,
                    };
                }
                else if (this.selectedField[i] === 'Paper_Type__c') {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        type: 'picklistColumn',
                        typeAttributes: {
                            placeholder: 'Select picklist',
                            options: { fieldName: 'phasepickListOptions' },
                            value: { fieldName: 'Paper_Type__c' },
                            context: { fieldName: 'Id' }
                        },
                        editable: true,
                        sortable: true,
                    }
                } else {
                    item = {
                        label: this.selectedLabel[i],
                        fieldName: this.selectedField[i],
                        editable: 'true',
                        sortable: 'true',
                    }
                }
                arr.push(item);
                this.paperColumns = arr;
                getPaperRecords({ field: this.sortBy, sortOrder: this.sortDirection, fields: this.selectedField })
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
        console.log('this.sortBy ::: ',this.sortBy);    
        console.log('this.sortDirection ::: ',this.sortDirection);
        getPaperRecords({ field: this.sortBy, sortOrder: this.sortDirection, fields: this.selectedField })
            .then((result) => {
                this.visibleRecords = result;
            })
            .catch((error) => {
                this.error = error;
            });
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

    handleSaveClick() {
        if (this.papers != null) {
            this.showPaperTable = true;
        } else {
            this.showPaperTableEmpty = true;
        }
        this.waitForASection = true;
        this.showCreateModal = false;
        this.showbuttons = true;
        var msg = 'Record created successfully.';
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
                        console.log(error);
                    });
            }
        }
    }

    handleCreateClick() {
        if (this.papers != null) {
            this.showPaperTable = false;
        } else {
            this.showPaperTableEmpty = false;
        }
        this.showCreateModal = true;
        this.showbuttons = false;
    }

    handleCancelClick() {
        if (this.papers != null) {
            this.showPaperTable = false;
        } else {
            this.showPaperTableEmpty = false;
        }
        this.showCreateModal = false;
        this.showbuttons = true;
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
        const start = (this.currentPage - 1) * this.recordSize;
        const end = this.recordSize * this.currentPage;
        if (this.totalRecords != null) {
            var arr = this.totalRecords.slice(start, end);
            var modifiedData = arr.map(item => ({
                ...item,
                phasepickListOptions: this.paperTypePicklist
            }));
            this.visibleRecords = modifiedData;
            this.tempRecords = this.visibleRecords;
            this.dispatchEvent(new CustomEvent('update', {
                detail: {
                    records: this.visibleRecords
                }
            }));
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
            console.log('File Size is too large');
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
            console.log('this.importedRecords :::: ',JSON.stringify(this.importedRecords));
            this.showAllPaper = true;
        };
        this.fileReader.readAsText(this.filesUploaded[0]);
    }

    handlesaveFile() {
        try {
            console.log('inSave');
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
                        this.Paperdata = result;
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
                    console.error(error);
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
}