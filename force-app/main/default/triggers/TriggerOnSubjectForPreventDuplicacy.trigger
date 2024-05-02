trigger TriggerOnSubjectForPreventDuplicacy on Subject__c (before insert, before update) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) { 
            ForPreventDuplicacyOnSubjectHandler.PreventDuplicateRecords(trigger.new);
        } else if (Trigger.isUpdate) {
            ForPreventDuplicacyOnSubjectHandler.PreventDuplicateRecords(trigger.newMap, trigger.oldMap);
        }
    }
}