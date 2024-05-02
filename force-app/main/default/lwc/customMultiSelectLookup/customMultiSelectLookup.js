import { LightningElement, api, track } from 'lwc';
import retriveSearchData from '@salesforce/apex/LeaveController.retriveSearchData';

export default class CustomMultiSelectLookup extends LightningElement {
    @api objectname = 'Teacher__c';
    @api fieldnames = ' Id, Name ';
    @api Label;
    @api iconName = 'standard:people';
    @api placeholder = 'Search..';
    @track searchRecords = [];
    @track selectedRecords = [];
    @track messageFlag = false;
    @track isSearchLoading = false;
    @track searchKey;
    @track sortBy;
    @track sortDirection;

    delayTimeout;

    searchField() {
        var selectedRecordIds = [];

        this.selectedRecords.forEach(ele => {
            selectedRecordIds.push(ele.Id);
        });

        retriveSearchData({ ObjectName: this.objectname, fieldName: this.fieldnames, value: this.searchKey, selectedRecId: selectedRecordIds })
            .then(result => {
                console.log('result ::: ',JSON.stringify(result));
                this.searchRecords = result;
                this.isSearchLoading = false;
                const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
                const clsList = lookupInputContainer.classList;
                clsList.add('slds-is-open');

                if (this.searchKey.length > 0 && result.length == 0) {
                    this.messageFlag = true;
                } else {
                    this.messageFlag = false;
                }
            }).catch(error => {
                console.log(error);
            });
    }

    handleKeyChange(event) {
        this.isSearchLoading = true;
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        console.log(searchKey);
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
            this.searchField();
        }, 300);
    }

    toggleResult(event) {
        const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
        const clsList = lookupInputContainer.classList;
        const whichEvent = event.target.getAttribute('data-source');

        switch (whichEvent) {
            case 'searchInputField':
                clsList.add('slds-is-open');
                this.searchField();
                break;
            case 'lookupContainer':
                clsList.remove('slds-is-open');
                break;
        }
    }

    setSelectedRecord(event) {
        var recId = event.target.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        let newsObject = this.searchRecords.find(data => data.Id === recId);
        this.selectedRecords.push(newsObject);
        this.template.querySelector('.lookupInputContainer').classList.remove('slds-is-open');

        let selRecords = this.selectedRecords;
        this.template.querySelectorAll('lightning-input').forEach(each => {
            each.value = '';
        });

        var selTemRec = JSON.stringify(selRecords);

        const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
        this.dispatchEvent(selectedEvent);
    }

    removeRecord(event) {
        let selectRecId = [];
        for (let i = 0; i < this.selectedRecords.length; i++) {
            if (event.detail.name !== this.selectedRecords[i].Id)
                selectRecId.push(this.selectedRecords[i]);
        }

        this.selectedRecords = [...selectRecId];
        let selRecords = this.selectedRecords;
        const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
        this.dispatchEvent(selectedEvent);
    }

    handleSort(event) {
        const fieldName = event.detail.fieldName;
        const sortDirection = event.detail.sortDirection;

        this.sortBy = fieldName;
        this.sortDirection = sortDirection;

        // Handle sorting logic here based on the fieldName and sortDirection
        // Example sorting logic:
        // Sort the searchRecords array based on the selected column and direction
        this.searchRecords = [...this.searchRecords.sort((a, b) => {
            let x = a[fieldName] ? a[fieldName].toLowerCase() : '';
            let y = b[fieldName] ? b[fieldName].toLowerCase() : '';
            if (x < y) return sortDirection === 'asc' ? -1 : 1;
            if (x > y) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        })];
    }
}