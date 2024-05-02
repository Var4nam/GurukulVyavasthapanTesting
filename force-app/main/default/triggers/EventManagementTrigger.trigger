trigger EventManagementTrigger on Event_Management__c (before insert, before update, before delete, after Insert, after Update) {
    
    if(trigger.isBefore) {
        if(trigger.isInsert) {
            EventManagementTriggerHandler.validateNameBeforeInsert(trigger.new);
        } else if(trigger.isUpdate) {
            EventManagementTriggerHandler.validateNameBeforeUpdate(trigger.new, trigger.oldMap);
        } else if(trigger.isDelete) {
            EventManagementTriggerHandler.validateNameBeforeDelete(trigger.old);
        }
    }
    
    if (Trigger.isAfter) {
        if (Trigger.isInsert) { 
            EventManagementTriggerHandler.CreateEventRecordAndHoliday(trigger.new);
        } else if (Trigger.isUpdate) {
            EventManagementTriggerHandler.CreateEventRecordAndHoliday(trigger.new, trigger.oldMap);
        }
    }
}