import { LightningElement, wire, track } from 'lwc';
import getAssignClassRecord from '@salesforce/apex/AdminUIFirstPartController.getAssignClassRecord';
import getExamRecords from '@salesforce/apex/AdminUIFirstPartController.getExamRecords';
import getPaperOutof from '@salesforce/apex/AdminUIFirstPartController.getPaperOutof';
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import JSONMARKS_FIELD from "@salesforce/schema/Exam__c.Store_Student_Marks_Data__c";
import TOTALOBTAINMARKS_FIELD from "@salesforce/schema/Exam__c.Total_Obtain_Marks__c";
import ID_FIELD from "@salesforce/schema/Exam__c.Id";

export default class ResultForTeacherPortal extends LightningElement {

    @track assignedClasses = [];
    @track examList = [];
    @track showExamList = false;
    @track showPaperTypeList = true;
    @track showAssignClassList = false;
    @track index = 1;
    @track teacherId;
    @track paperTypeValue;
    @track recordsForUpdate = [];
    @track subjectName;
    @track outOfValue;
    @track totalExams = [];
    @track updatedRecords = [];
    @track showPublishModal = false;

    get options() {
        return [
            { label: 'First Test', value: 'First Test' },
            { label: 'Second Test', value: 'Second Test' },
            { label: 'Third Test', value: 'Third Test' },
            { label: 'Forth Test', value: 'Forth Test' },
            { label: 'Fifth Test', value: 'Fifth Test' },
            { label: 'Half Yearly', value: 'Half Yearly' },
            { label: 'Final', value: 'Final' },
        ];
    }

    get serialNumber() {
        return this.index++;
    }

    connectedCallback() {
        this.teacherId = localStorage.getItem('idofTeacher');
    }

    @wire(getAssignClassRecord, { teacherId: '$teacherId' })
    wiredAssignClasses(result) {
        this.updatedRecords = result;
        if (result.data) {
            this.assignedClasses = result.data;
        }
        else if (result.error) {
            window.console.log(result.error);
        }
    }

    handlePaperTypeChange(event) {
        this.index = 1;
        this.paperTypeValue = event.detail.value;
        this.showExamList = false;
        this.examList = [];
    }

    handleObtainMarksChange(event) {
        const index = event.currentTarget.dataset.index;
        const obtain = event.target.value;

        if (obtain > this.outOfValue) {
            const msg = 'Obtained marks cannot be greater than Out of marks!';
            this.showErrorToast(msg);
            return;
        }

        const marks = `${obtain}/${this.outOfValue}`;

        const updatedData = JSON.parse(this.totalExams[index].Store_Student_Marks_Data__c);
        console.log('updatedData ::: ', updatedData);
        console.log('this.paper Type ::: ',this.paperTypeValue);
        updatedData.forEach((item) => {
            if (item.SUBJECTNAME === this.subjectName) {
                switch (this.paperTypeValue) {
                    case 'First Test':
                        item.FIRSTTEST = marks;
                        break;
                    case 'Second Test':
                        item.SECONDTEST = marks;
                        break;
                    case 'Third Test':
                        item.THIRDTEST = marks;
                        break;
                    case 'Forth Test':
                        item.FORTHTEST = marks;
                        break;
                    case 'Fifth Test':
                        item.FIFTHTEST = marks;
                        break;
                    case 'Half Yearly':
                        item.HALF = marks;
                        break;
                    case 'Final':
                        item.FINAL = marks;
                        break;
                    default:
                        break;
                }
            }
        });
        let total;
        updatedData.forEach((item) => {
            if (item.SUBJECTNAME === this.subjectName) {
                console.log(parseInt(item.FIRSTTEST.split("/")[0]) +
                        parseInt(item.SECONDTEST.split("/")[0]) +
                        parseInt(item.THIRDTEST.split("/")[0]) +
                        parseInt(item.FORTHTEST.split("/")[0]) +
                        parseInt(item.FIFTHTEST.split("/")[0]) +
                        parseInt(item.HALF.split("/")[0]) +
                        parseInt(item.FINAL.split("/")[0]));

                total = parseInt(item.FIRSTTEST.split("/")[0]) +
                        parseInt(item.SECONDTEST.split("/")[0]) +
                        parseInt(item.THIRDTEST.split("/")[0]) +
                        parseInt(item.FORTHTEST.split("/")[0]) +
                        parseInt(item.FIFTHTEST.split("/")[0]) +
                        parseInt(item.HALF.split("/")[0]) +
                        parseInt(item.FINAL.split("/")[0]); 
            }
        });
        total = Number(total);
        console.log('total ::: ', total);

        const item = {
            Id: this.totalExams[index].Id,
            Store_Student_Marks_Data__c: updatedData,
            Total_Obtain_Marks__c: total
        };
        this.recordsForUpdate.push(item);
    }


    handleBackClick() {
        this.showExamList = false;
        this.showPaperTypeList = true;
        this.showAssignClassList = true;
        this.examList = [];
        this.index = 1;
    }

    handleMarksClick() {
        this.index = 1;
        var classId = event.currentTarget.dataset.id;
        this.subjectName = event.currentTarget.dataset.name;
        this.studentId = event.currentTarget.dataset.index;
        getExamRecords({ classId: classId })
            .then((result) => {
                this.index = 1;
                if (result.length > 0) {
                    this.showAssignClassList = false;
                    this.showExamTypeList = false;
                    this.showExamList = true;
                    var arr = [];
                    this.totalExams = result;
                    for (let i = 0; i < result.length; i++) {
                        const storeStudentMarksData = JSON.parse(result[i].Store_Student_Marks_Data__c);
                        console.log('storeStudentMarksData ::: ', JSON.stringify(storeStudentMarksData));
                        const relevantMarksData = storeStudentMarksData.filter(item => item.SUBJECTNAME === this.subjectName);
                        for (let j = 0; j < relevantMarksData.length; j++) {
                            let obtainMarks = this.paperTypeValue === 'First Test' ? relevantMarksData[j].FIRSTTEST :
                                this.paperTypeValue === 'Second Test' ? relevantMarksData[j].SECONDTEST :
                                    this.paperTypeValue === 'Third Test' ? relevantMarksData[j].THIRDTEST :
                                        this.paperTypeValue === 'Forth Test' ? relevantMarksData[j].FORTHTEST :
                                            this.paperTypeValue === 'Fifth Test' ? relevantMarksData[j].FIFTHTEST :
                                                this.paperTypeValue === 'Half Yearly' ? relevantMarksData[j].HALF :
                                                    this.paperTypeValue === 'Final' ? relevantMarksData[j].FINAL : null;
                            let obtain = obtainMarks.split("/")[0];
                            let item = {
                                Id: result[i].Id,
                                StudentName: result[i].Student__r.Name,
                                ClassId: result[i].Student__r.Class__c,
                                StudentId: result[i].Student__r.Id,
                                ObtainMarks: obtain,
                                Outof: this.outOfValue,
                            };
                            arr.push(item);
                        }
                    }
                    this.examList = arr;
                } else {
                    var msg = 'Records not found!';
                    this.showErrorToast(msg);
                    this.examList = [];
                }
            })
            .catch((error) => {
                this.error = error;
            });

    }

    handleProceedClick() {
        this.index = 1;
        this.showAssignClassList = true;
        console.log('type ::: ',this.paperTypeValue);
        getPaperOutof({ paperType: this.paperTypeValue })
            .then((result) => {
                console.log('ob ---- > ',result);
                if(result == 0) {
                    var msg = 'Paper record is not created for '+this.paperTypeValue;
                    this.showErrorToast(msg);
                } else {
                    this.outOfValue = result;
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleResultsClick() {

    }

    handlePublishClick() {
        this.showPublishModal = true;
    }

    closeModal() {
        this.showPublishModal = false;
    }

    async handleSaveClick() {
        try {
            console.log('this.recordsForUpdate str ::: ', JSON.stringify(this.recordsForUpdate));
            const promises = [];
            for (let i = 0; i < this.recordsForUpdate.length; i++) {
                const fields = {};
                fields[ID_FIELD.fieldApiName] = this.recordsForUpdate[i].Id;
                fields[JSONMARKS_FIELD.fieldApiName] = JSON.stringify(this.recordsForUpdate[i].Store_Student_Marks_Data__c);
                fields[TOTALOBTAINMARKS_FIELD.fieldApiName] = this.recordsForUpdate[i].Total_Obtain_Marks__c;
                const recordInputs = { fields };
                const result = await updateRecord(recordInputs);
                promises.push(result);
            }
            Promise.all(promises)
                .then((res) => {
                    this.paperTypeValue = null;
                    this.showAssignClassList = false;
                    this.showPaperTypeList = true;
                    this.examList = [];
                    this.assignedClasses = [];
                    this.outOfValue = null;
                    this.showExamList = false;
                    refreshApex(this.updatedRecords);
                    console.log(JSON.stringify(res));
                    const msg = "Records updated successfully.";
                    this.showSuccessToast(msg);
                })
                .catch((error) => {
                    console.error(JSON.stringify(error));
                    const msg = "Error updating records.";
                    this.showErrorToast(msg);
                })
                .finally(() => {
                    // Any final cleanup or actions
                });
        } catch (error) {
            console.error("Error updating records: ", JSON.stringify(error));
            const msg = "Error updating records.";
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
}