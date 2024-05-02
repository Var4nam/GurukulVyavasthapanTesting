public class TimeTableTriggerHandler {
    public static void teacherIsPresent(List<TimeTable__c> oldRecord){
        Set<Id> teacherIds = new Set<Id>();
        List<String> dayPeriodSet = new List<String>();
        Set<Id> tmIds  = new Set<Id>();
        for(TimeTable__c tcRecord : oldRecord){
            if(tcRecord.Teacher__c == null && tcRecord.Subject__c == null) {
                tcRecord.addError('Please select atleast one field.');
            }
            if(tcRecord.Teacher__c != null) {
                tmIds.add(tcRecord.Id);
                teacherIds.add(tcRecord.Teacher__c);
                dayPeriodSet.add(tcRecord.Teacher__c + tcRecord.Day__c + tcRecord.Period__c);
            }
        }
        
        if(!teacherIds.isEmpty()) {
            List<TimeTable__c> timeTableRecords = [SELECT Id, Teacher__c, Period__c, Day__c, Name FROM TimeTable__c WHERE Teacher__c IN : teacherIds AND Id NOT IN : tmIds];
            integer index = 0;
            for(TimeTable__c tcRecord : timeTableRecords){
                string dayString = tcRecord.Teacher__c + tcRecord.Day__c + tcRecord.Period__c;
                if(dayPeriodSet.contains(dayString)){
                   oldRecord[index].Teacher__c.addError('The teacher already assigned on the same time in ');
                    index++;
                }
            }
        }
    }
}