import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAnnouncementRecords from '@salesforce/apex/TeacherController.getAnnouncementRecords';
import updateTotalAnnouncement from '@salesforce/apex/TeacherController.updateTotalAnnouncement';
import createAnnouncementRecords from '@salesforce/apex/TeacherController.createAnnouncementRecords';


const BASE_COLUMNS = [
    { label: 'Start date', fieldName: 'StartDate' },
    { label: 'End date', fieldName: 'EndDate' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Total Day', fieldName: 'Total' },
    { label: 'Announcement Name', fieldName: 'AnnouncementName' },
];

const BASE_COLUMNS2 = [
    { label: 'Start date', fieldName: 'StartDate' },
    { label: 'End date', fieldName: 'EndDate' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Total Day', fieldName: 'Total' },
    { label: 'Announcement Name', fieldName: 'AnnouncementName' },
];

export default class AnnouncementApplyComponent extends LightningElement {

    @track teacherId;
    @track value;
    @track isShowModal = false;
    @track activeTab = 'Pending';
    @track pendingData = [];
    @track approvedData = [];
    @track rejectedData = [];
    @track selectedAnnouncementId;
    @track columns2 = BASE_COLUMNS2;
    @track columns = [];

    connectedCallback() {
        this.teacherId = localStorage.getItem('idofTeacher');
        this.getAnnouncementRequests();
    }

    getAnnouncementRequests() {
        getAnnouncementRecords({ teacherId: this.teacherId, status: this.activeTab })
            .then(result => {
                this.pendingData = this.mapAnnouncementRecords(result.announcementRecordList);
                console.log('pendingData ::: ',pendingData);
                const role = result.role;
                this.columns = BASE_COLUMNS.slice();
                if (role != '') {
                    this.addRoleBasedButtons(role);
                }
            })
            .catch(error => {
                console.error('Error fetching announcement requests:', error);
            });
    }

    mapAnnouncementRecords(records) {
        return records.map(record => ({
            StartDate: record.Start_Date_Time__c,
            EndDate: record.End_Date_Time__c,
            Status__c: record.Status__c,
            Total: record.Announcement_Days__c,
            AnnouncementName: record.Announcement_Id__r.Name,
            Role: record.Announcement_Id__r.Role__c,
            Id: record.Id,
            Announcement_Id__c: record.Announcement_Id__c
        }));
    }

    addRoleBasedButtons(AnnouncementRole) {
        if (AnnouncementRole === 'System administrator') {
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
            this.updateTotalAnnouncement(recordId, buttonLabel);
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

    updateTotalAnnouncement(recordId, status) {
        updateTotalAnnouncement({ teacherId: this.selectedTeacherId, recordId: recordId, statusValue: status })
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
            this.getTotalAnnouncementByStatus();
        }
    }

    getTotalAnnouncementByStatus() {
        getAnnouncementRecords({ teacherId: this.teacherId, status: this.activeTab })
            .then(result => {
                if (this.activeTab === 'Approved') {
                    this.approvedData = this.mapAnnouncementRecords(result.announcementRecordList);
                } else if (this.activeTab === 'Rejected') {
                    this.rejectedData = this.mapAnnouncementRecords(result.announcementRecordList);
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
        console.log('fields ::: ',fields);
        createAnnouncementRecords({ announce: fields })
            .then(result => {
                console.log('success')
                this.handleReset();
                const eventtemp = new ShowToastEvent({
                    title: 'Success',
                    message: 'Announcement is submitted Successfully',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.dispatchEvent(eventtemp);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleReset(event) {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handleClickShowRequest() {
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }
}