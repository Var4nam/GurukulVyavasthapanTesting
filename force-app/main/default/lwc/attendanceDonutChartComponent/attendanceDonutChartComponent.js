import { LightningElement , api, track} from 'lwc';
import chartjs from "@salesforce/resourceUrl/ChartJs";
import { loadScript } from "lightning/platformResourceLoader";
import getAttendance from '@salesforce/apex/TeacherAttendanceCalendarController.getAttendance';
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class AttendanceDonutChartComponent extends LightningElement {

    teacherId;
    @track currentDate = new Date();
    @api portalName;
    
    chart;
    chartjsInitialized = false;
    config={
        type : 'doughnut',
        data :{
            datasets :[
                {
                    data: [],
                    backgroundColor :[
                        'rgb(102,204,0)',
                        'rgb(255,51,51)',
                        'rgb(255,153,51)',
                        'rgb(255,255,0)',],
                    label:'Dataset 1'
                }
            ],
            labels:[]
        },
        options: {
            plugins: [1,2,3,4],
            responsive : true,
            legend : {
                position :'right'   
            },
            animation:{
                animateScale: true,
                animateRotate : true
            }
        }
    };

    connectedCallback() {
        this.attendance();
    }

    attendance() {
        var teacherId = '';
        var studentId = '';
        var staffId = '';
        if(this.portalName == 'teacher') {
            teacherId = localStorage.getItem('idofTeacher');
            studentId = '';
            staffId = '';
        } else if(this.portalName === 'student') {
            studentId = localStorage.getItem('idofStudent');
            teacherId = '';
            staffId = '';
        } else if(this.portalName === 'staff') {
            staffId = localStorage.getItem('idofStaff');
            teacherId = '';
            studentId = '';
        }
        var monthName = month[this.currentDate.getMonth()] + ' ' + this.currentDate.getFullYear();
        getAttendance({ teacherId: teacherId, studentId: studentId, staffId: staffId, selectedDate : this.currentDate, monthName: monthName})
        .then(data => {
            for(let i=0;i<data.length;i++) {
                console.log('data ----- >>>> ',data);
                this.updateChart(data[i].countPresent,'Present');
                this.updateChart(data[i].countAbsent,'Absent');
                if(this.portalName != 'student') {
                    this.updateChart(data[i].countHalfday,'Halfday');
                }
                this.updateChart(data[i].countLeave,'Leave');
            }
        })
        .catch(error => {
            console.log('this.createError --->>> ' + JSON,stringify(error));
        });
    }

    updateChart(count,label){
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(count);
        });
        this.chart.update();
    }

    renderedCallback() {
        Promise.all([
            loadScript(this, chartjs)
        ])
        .then(() => {
            const ctx = this.template.querySelector('canvas');
            this.chart = new window.Chart(ctx, this.config);
        })
        .catch((error) => {
            console.log('error :::: ',error);
        });
    }
}