import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createLeaveRecords from '@salesforce/apex/LeaveController.createLeaveRecords';
import fetchTotalLeave from '@salesforce/apex/LeaveController.fetchTotalLeave';
import updateTotalLeave from '@salesforce/apex/LeaveController.updateTotalLeave';

const BASE_COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'From date', fieldName: 'FromDate' },
    { label: 'To date', fieldName: 'ToDate' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Total Day', fieldName: 'Total' },
    { label: 'Teacher Name', fieldName: 'TeacherName' },
];

const BASE_COLUMNS2 = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'From date', fieldName: 'FromDate' },
    { label: 'To date', fieldName: 'ToDate' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Total Day', fieldName: 'Total' },
    { label: 'Teacher Name', fieldName: 'TeacherName' },
];

export default class LeaveApplyComponent extends LightningElement {
    @track teacherId;
    @track value;
    @track isShowModal = false;
    @track activeTab = 'Pending';
    @track pendingData = [];
    @track approvedData = [];
    @track rejectedData = [];
    @track selectedTeacherId;
    @track columns2 = BASE_COLUMNS2;
    @track columns = [];

    connectedCallback() {
        this.teacherId = localStorage.getItem('idofTeacher');
        this.getLeaveRequests();
    }

    getLeaveRequests() {
        fetchTotalLeave({ teacherId: this.teacherId, status: this.activeTab })
            .then(result => {
                this.pendingData = this.mapLeaveRecords(result.leaveRecordList);
                console.log('pendingData :: ',pendingData);
                const role = result.role;
                console.log('role ::: ',role);
                this.columns = BASE_COLUMNS.slice();
                if (role != '') {
                    this.addRoleBasedButtons(role);
                }
            })
            .catch(error => {
                console.error('Error fetching leave requests:', error);
            });
    }

    mapLeaveRecords(records) {
        return records.map(record => ({
            Name: record.Name,
            FromDate: record.From_Date__c,
            ToDate: record.To_Date__c,
            Status__c: record.Status__c,
            Total: record.Leave_Days__c,
            TeacherName: record.To__r.Name,
            Role: record.To__r.Role__c,
            Id: record.Id,
            To__c: record.To__c
        }));
    }

    addRoleBasedButtons(teacherRole) {
        if (teacherRole === 'System administrator') {
            this.columns.push({
                type: 'button',
                label: 'Action',
                initialWidth: 150,
                typeAttributes: {
                    label: 'Approved',
                    name: 'button',
                    title: 'Click to perform an action',
                    variant: 'brand',
                },
            });
            this.columns.push({
                type: 'button',
                label: 'Action',
                initialWidth: 150,
                typeAttributes: {
                    label: 'Rejected',
                    name: 'button',
                    title: 'Click to perform an action',
                    variant: 'brand',
                },
            });
        }
    }

    handleRowAction(event) {
        const buttonLabel = event.detail.action.label;
        console.log('buttonLabel ::: ',buttonLabel);
        const recordId = event.detail.row.Id;
        console.log('recordId ::: ',recordId);
        this.selectedTeacherId = event.detail.row.To__c;
        console.log('this.selecetedTeacherId ::: ',this.selectedTeacherId);

        if (buttonLabel === 'Approved' || buttonLabel === 'Rejected') {
            this.removeRecordFromTable(recordId);
            this.updateTotalLeaves(recordId, buttonLabel);
        }
    }

    removeRecordFromTable(recordId) {
        const newData = [...this.pendingData];
        const rowIndex = newData.findIndex(item => item.Id === recordId);
        if (rowIndex !== -1) {
            newData.splice(rowIndex, 1);
            this.pendingData = newData;
        }
    }

    updateTotalLeaves(recordId, status) {
        updateTotalLeave({ teacherId: this.selectedTeacherId, recordId: recordId, statusValue: status })
            .then(result => {
                // Handle the result if needed
            })
            .catch(error => {
                console.error('Error updating total leaves:', error);
            });
    }

    handleTabChange(event) {
        const selectedTab = event.target.label;
        this.activeTab = selectedTab;
        if (this.activeTab === 'Approved' || this.activeTab === 'Rejected') {
            this.fetchTotalLeaveByStatus();
        }
    }

    fetchTotalLeaveByStatus() {
        fetchTotalLeave({ teacherId: this.teacherId, status: this.activeTab })
            .then(result => {
                if (this.activeTab === 'Approved') {
                    this.approvedData = this.mapLeaveRecords(result.leaveRecordList);
                } else if (this.activeTab === 'Rejected') {
                    this.rejectedData = this.mapLeaveRecords(result.leaveRecordList);
                }
            })
            .catch(error => {
                console.error('Error fetching leave requests by status:', error);
            });
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    handleSubmit() {
        event.preventDefault();
        console.log('teacherId ::: ',this.teacherId);
        const fields = event.detail.fields;
        fields.Multi_Select_Teacher__c = this.teacherId;
        console.log('fields ::: ',fields);
        createLeaveRecords({ leaves: fields })
            .then(result => {
                console.log('success')
                this.handleReset();
                const eventtemp = new ShowToastEvent({
                    title: 'Success',
                    message: 'Leave is submitted Successfully',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.dispatchEvent(eventtemp);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleselectedTeacherRecords(event) {
        let tempselectedRecords = '';
        let tempSectedeRec = event.detail.selRecords;
        for (let i = 0; i < tempSectedeRec.length; i++) {
            let ccRecord = tempSectedeRec[i].Name + '(' + tempSectedeRec[i].To__c + ')';
            if (tempselectedRecords == '') {
                tempselectedRecords = ccRecord;
            } else {
                tempselectedRecords = tempselectedRecords + ', ' + ccRecord;
            }
        }
        this.selectedRecords = tempselectedRecords;
    }

    handleReset(event) {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handleClickShowLeave() {
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }
}