trigger TriggerOnClassForPreventDuplicacy on Class__c (before insert, before update) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) { 
            ForPreventDuplicacyOnClassHandler.PreventDuplicateRecords(trigger.new);
        } else if (Trigger.isUpdate) {
            ForPreventDuplicacyOnClassHandler.PreventDuplicateRecords(trigger.newMap, trigger.oldMap);
        }
    }
}