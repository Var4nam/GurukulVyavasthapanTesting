trigger PaperTrigger on Paper__c (after insert) {
    if(trigger.isAfter && trigger.isInsert) {
        PaperTriggerHandler.countOutofAndUpdateExam(trigger.new);
    }
}