trigger LeaveTrigger on Leave__c (after insert, after update, after delete) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            LeaveTriggerHandler.sendLeaveEmails(Trigger.new);
            LeaveTriggerHandler.updateTeacherTotalLeave(Trigger.new);
        }
        
        if (Trigger.isUpdate || Trigger.isDelete) {
            LeaveTriggerHandler.handleLeaveChanges(Trigger.new, Trigger.oldMap);
        }
    }
}