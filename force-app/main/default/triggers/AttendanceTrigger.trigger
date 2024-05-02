trigger AttendanceTrigger on Attendance__c (before update) {
    if(Trigger.isBefore && Trigger.isUpdate){
        AttendanceTriggerHandler.teacherIsPresent(Trigger.new);
    }
}