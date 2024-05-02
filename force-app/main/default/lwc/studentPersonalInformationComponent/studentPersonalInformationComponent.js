import { LightningElement , track} from 'lwc';
export default class StudentPersonalInformationComponent extends LightningElement {

    @track studentId;
    @track activeSections = ["A", "B", "C", "D"];

    connectedCallback() {
        this.studentId = localStorage.getItem('idofStudent');
        console.log('this.studentId :::: ',this.studentId);
    }
}