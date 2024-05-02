import { LightningElement, wire } from 'lwc';
import showAnnoucementDashboard from '@salesforce/apex/AdminUIFirstPartController.showAnnoucementDashboard';

export default class AnnouncementDashboard extends LightningElement {
    @wire(showAnnoucementDashboard)
    announce;

    get announcementDashboards() {
        if (this.announce && this.announce.data) {
            return this.announce.data.map((announcement, index) => ({
                id: index,
                name: announcement.Name,
                start: announcement.Start_Date_Time__c ? announcement.Start_Date_Time__c.toString().slice(0, 10) : '',
                end: announcement.End_Date_Time__c ? announcement.End_Date_Time__c.toString().slice(0, 10) : '',
                classes: '--sds-c-badge-color-background: '+this.randomColor()
            }));
        } else {
            return [];
        }
    }

    randomColor(){
        var rc = "#";
        for(let i=0;i<6;i++){
            rc += Math.floor(Math.random()*16).toString(16);
        }
        return rc;
    }
}