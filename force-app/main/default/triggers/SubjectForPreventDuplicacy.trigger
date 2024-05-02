trigger SubjectForPreventDuplicacy on Subject__c (before insert, before update) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) { 
            SubjectForPreventDuplicacyHandler.PreventDuplicateRecords(trigger.new);
        } else if (Trigger.isUpdate) {
            SubjectForPreventDuplicacyHandler.PreventDuplicateRecords(trigger.newMap, trigger.oldMap);
        }
    }
}