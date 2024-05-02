trigger ClassTrigger on Class__c (after insert) {

    if(trigger.isAfter && trigger.isInsert) {
        ClassTriggerHandler.createPublishRelatedToClass(trigger.new);
    }
}