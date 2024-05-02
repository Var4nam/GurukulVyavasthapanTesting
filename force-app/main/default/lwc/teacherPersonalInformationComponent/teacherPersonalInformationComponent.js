import { LightningElement, track } from 'lwc';
export default class TeacherPersonalInformationComponent extends LightningElement {

    @track teacherId;
    @track activeSections = ["A", "B", "C"];

    connectedCallback() {
        this.teacherId = localStorage.getItem('idofTeacher');
        console.log('this.teacherId :::: ',this.teacherId);
    }
}