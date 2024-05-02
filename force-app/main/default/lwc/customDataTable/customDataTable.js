import { LightningElement, api, track, wire } from 'lwc';
// import LightningDatatable from 'lightning/datatable';
import picklistColumn from './picklistColumn.html';
import pickliststatic from './picklistStatic.html';
import lookupColumn from './lookupColumn.html';
import lookupstatic from './lookupStatic.html';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from "lightning/uiRecordApi";


export default class CustomDataTable extends NavigationMixin(LightningElement) {
    static customTypes = {
        picklistColumn: {
            template: pickliststatic,
            editTemplate: picklistColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant', 'name']
        },
        lookupColumn: {
            template: lookupstatic,
            editTemplate: lookupColumn,
            standardCellLayout: true,
            typeAttributes: ['value', 'fieldName', 'object', 'context', 'name', 'fields', 'target']
        }
    };
    @api recordData;
    @api index;
    @api tableType;
    @api recordUpdate;
    @track classValue;
    @track classObj;
    @track resultObj;
    @track subObj;
    @track teacherObj;
    @track schoolObj;
    showAssignClass = false;
    showAllTeacher = false;
    showAllStudent = false;
    showAllStaff = false;
    showAllAdmin = false;
    showAllSubject = false;
    isTeacherVisibles = true;
    isResultVisibles = true;
    isResultLookup = false;
    isClassVisibles = true;
    isSubVisibles = true;
    isTeacherLookup = false;
    isSubLookup = false;
    isClassLookup = false;
    isCompleted = false;
    isSchoolLookup = false;
    isSchoolVisibles = true;

    connectedCallback() {
        this.showDataTable();
        console.log('recordData : ',JSON.stringify(this.recordData));
        if (this.recordData) {
            if (this.recordData.Class__c) {
                this.classObj = { ...this.recordData.Class__r };
            }
            if (this.recordData.Subject__c) {
                this.subObj = { ...this.recordData.Subject__r };
            }
            if (this.recordData.Teacher__c) {
                this.teacherObj = { ...this.recordData.Teacher__r };
            }
            if (this.recordData.School__c) {
                this.schoolObj = { ...this.recordData.School__r };
            }
            if (this.recordData.Result__c) {
                this.resultObj = { ...this.recordData.Result__r };
            }
        } else {
            console.error('Record data is undefined.');
        }
    }

    renderedCallback() {
        console.log('renderedCallback is running');
        if (!this.isCompleted) {
            window.requestAnimationFrame(() => {
                console.log('AnimationFrame is running');
                let styles;
                if (this.index % 2 === 0) {
                    styles = 'oddRow';
                } else {
                    styles = 'evenRow';
                }
                let customDatatable = this.template.querySelector('.dataTableRow');
                if (customDatatable) {
                    customDatatable.classList.add(styles);
                } else {
                    console.error("Element with class 'dataTableRow' not found.");
                }
                this.isCompleted = true;
            });
        }
    }

    fields; recordId; currentField;

    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    getNameFieldVaule({ error, data }) {
        if (data && data != undefined) {
            this.updateLookupValue(this.currentField, data.fields.Name.value, this.recordId);

        } else if (error) {
            console.error('--Error-1-CustomInputField--', error);
        }

    }

    handleMultiYear(event) {
        let name = event.currentTarget.dataset.name;
        let value = event.currentTarget.value;
        if (value != '') {
            this.showLookup(name, false);
            this.recordId = value;
            this.currentField = name;
            this.fields = [name + '.Name'];
            this.enableSaveButton();
        }
    }

    handelEvent() {
        this.showLookup(event.currentTarget.dataset.name, true);
    }

    handelRedirect(event) {
        this.navigateToRecordPage(event.currentTarget.name, event.currentTarget.dataset.name);
    }

    showLookup(name, bool) {
        switch (name) {
            case 'Teacher__c':
                this.isTeacherLookup = bool;
                this.isTeacherVisibles = !bool;
                break;
            case 'Class__c':
                this.isClassLookup = bool;
                this.isClassVisibles = !bool;
                break;
            case 'Subject__c':
                this.isSubLookup = bool;
                this.isSubVisibles = !bool;
                break;
            case 'School__c':
                this.isSchoolLookup = bool;
                this.isSchoolVisibles = !bool;
                break;
            case 'Result__c':
                this.isResultLookup = bool;
                this.isResultVisibles = !bool;
                break;
        }
    }

    showDataTable() {
        switch (this.tableType) {
            case 'AssignClass':
                this.showAssignClass = true;
                break;
            case 'AllTeacher':
                this.showAllTeacher = true;
                break;
            case 'AllStudent':
                this.showAllStudent = true;
                break;
            case 'AllStaff':
                this.showAllStaff = true;
                break;
            case 'AllAdmin':
                this.showAllAdmin = true;
                break;
            case 'AllSubject':
                this.showAllSubject = true;
                break;
        }
    }

    recordUpdate = { 'teacher': undefined, 'classVal': undefined, 'subject': undefined, 'Id': undefined, 'result': undefined, 'school': undefined };
    updateLookupValue(fieldname, value, objId) {
        switch (fieldname) {
            case 'Teacher__c':
                this.teacherObj.Id = objId;
                this.teacherObj.Name = value;
                if (objId != this.recordData.Teacher__c) {
                    this.recordUpdate.teacher = objId;
                    this.recordUpdate.Id = this.recordData.Id;
                }
                else {
                    this.recordUpdate.teacher = undefined;
                }
                break;
            case 'Class__c':
                this.classObj.Id = objId;
                this.classObj.Name = value;
                if (objId != this.recordData.Class__c) {
                    this.recordUpdate.classVal = objId;
                    this.recordUpdate.Id = this.recordData.Id;

                }
                else {
                    this.recordUpdate.classVal = undefined;
                }
                break;
            case 'Subject__c':
                this.subObj.Id = objId;
                this.subObj.Name = value;
                if (objId != this.recordData.Subject__c) {
                    this.recordUpdate.subject = objId;
                    this.recordUpdate.Id = this.recordData.Id;

                }
                else {
                    this.recordUpdate.subject = undefined;
                }
                break;
            case 'Result__c':
                this.resultObj.Id = objId;
                this.resultObj.Name = value;
                if (objId != this.recordData.Result__c) {
                    this.recordUpdate.result = objId;
                    this.recordUpdate.Id = this.recordData.Id;

                }
                else {
                    this.recordUpdate.result = undefined;
                }
                break;
            case 'School__c':
                this.schoolObj.Id = objId;
                this.schoolObj.Name = value;
                if(objId != this.recordData.School__c) {
                    this.recordUpdate.school = objId;
                    this.recordUpdate.Id = this.recordData.Id;
                }
                else {
                    this.recordUpdate.school = undefined;
                }
                break;
        }
    }

    enableSaveButton() {
        this.dispatchEvent(new CustomEvent('lookupchanges'));
        console.log('Dispatched Successfully');
    }

    navigateToRecordPage(recordId, objectApiName) {
        this[NavigationMixin.GenerateUrl]({
            type: "standard__recordPage",
            attributes: {
                recordId: recordId,
                objectApiName: objectApiName,
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, "_blank");
        });
    }
}