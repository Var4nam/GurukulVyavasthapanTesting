import { LightningElement, track } from 'lwc';
export default class ParentPersonalInformationComponent extends LightningElement {

    @track parentId;

    connectedCallback() {
        this.parentId = localStorage.getItem('idofParent');
        console.log('this.parentId :::: ',this.parentId);
    }
}