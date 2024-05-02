trigger TriggerOnAssignClassForPreventDuplicacy on Assign_Classes__c (before insert, before update) {
     if (Trigger.isBefore) {
        if (Trigger.isInsert) { 
            ForPreventDuplicacyOnAssignClassHandler.PreventDuplicateRecords(trigger.new);
        } else if (Trigger.isUpdate) {
            ForPreventDuplicacyOnAssignClassHandler.PreventDuplicateRecords(trigger.newMap, trigger.oldMap);
        }
    }
}