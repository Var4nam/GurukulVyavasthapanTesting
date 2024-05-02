trigger TeacherTrigger on Teacher__c (after insert) {

    if(trigger.isAfter && trigger.isInsert) {
        TeacherTriggerHandler.createAttendanceForNewTeachers(trigger.new);
        credProvider.credCreation(trigger.new);
    }
}