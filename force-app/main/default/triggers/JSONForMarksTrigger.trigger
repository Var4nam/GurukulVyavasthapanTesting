trigger JSONForMarksTrigger on Exam__c (before update) {
    if(Trigger.isBefore && Trigger.isUpdate){
        JSONForMarksTriggerHandler.studentMarks(Trigger.new);
    }
}