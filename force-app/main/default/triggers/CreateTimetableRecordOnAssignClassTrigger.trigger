trigger CreateTimetableRecordOnAssignClassTrigger on TimeTable__c (after insert, after update, after delete) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            CreateTTOnACTriggerHandler.createOrUpdateAssignClassRecord(Trigger.new, null);
        } else if (Trigger.isUpdate) {
            CreateTTOnACTriggerHandler.createOrUpdateAssignClassRecord(Trigger.new, Trigger.oldMap);
        } else if (Trigger.isDelete) {
            CreateTTOnACTriggerHandler.deleteRelatedAssignClassRecords(Trigger.old);
        }
    }
}