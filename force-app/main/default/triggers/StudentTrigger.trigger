trigger StudentTrigger on Student__c (after insert, after update) {
    if(trigger.isAfter) {
        if(trigger.isInsert) {
            StudentTriggerHandler.createAttendanceAndExamForNewStudents(trigger.new);
            StudentTriggerHandler.createFeeForNewStudents(trigger.new);
        	credProvider.credCreation(trigger.new);
        }
        if(trigger.isUpdate) {
            StudentTriggerHandler.updateAttendanceAndExamForStudents(trigger.new, trigger.oldMap);
        }
    }
}